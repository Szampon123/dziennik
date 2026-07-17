import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  deleteStravaActivity,
  forgetStravaAthlete,
  getUserIdByAthleteId,
  syncSingleActivity,
} from "@/lib/strava";

// Strava webhook endpoint — one subscription per app, created once via the
// push subscriptions API with callback_url pointing here and verify_token =
// STRAVA_WEBHOOK_VERIFY_TOKEN. Strava then POSTs an event for every activity
// create/update/delete (and athlete deauthorization) of every connected user.
//
// This route is unauthenticated by nature (Strava calls it), so it never
// trusts the payload with anything beyond ids: the activity data itself is
// always re-fetched through the owner's stored token.

/** Subscription validation: echo hub.challenge when the verify token matches. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const verifyToken = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;
  if (
    params.get("hub.mode") !== "subscribe" ||
    !verifyToken ||
    params.get("hub.verify_token") !== verifyToken
  ) {
    return NextResponse.json({ error: "verification failed" }, { status: 403 });
  }
  return NextResponse.json({ "hub.challenge": params.get("hub.challenge") });
}

type StravaEvent = {
  object_type?: string; // "activity" | "athlete"
  object_id?: number;
  aspect_type?: string; // "create" | "update" | "delete"
  owner_id?: number; // athlete id
  updates?: Record<string, unknown>; // athlete: { authorized: "false" } on revoke
};

export async function POST(request: NextRequest) {
  let event: StravaEvent;
  try {
    event = (await request.json()) as StravaEvent;
  } catch {
    return NextResponse.json({ ok: true }); // malformed body — nothing to retry
  }

  // Always answer 200: a non-2xx makes Strava retry for hours and eventually
  // disable the subscription. Failures are logged, never surfaced.
  try {
    const athleteId = event.owner_id != null ? String(event.owner_id) : null;
    if (!athleteId || event.object_id == null) return NextResponse.json({ ok: true });

    // User revoked access on strava.com — drop the dead token.
    if (event.object_type === "athlete") {
      if (event.updates?.authorized === "false") {
        await forgetStravaAthlete(athleteId);
      }
      return NextResponse.json({ ok: true });
    }

    if (event.object_type !== "activity") return NextResponse.json({ ok: true });

    const userId = await getUserIdByAthleteId(athleteId);
    if (!userId) return NextResponse.json({ ok: true }); // not one of ours

    const stravaId = String(event.object_id);
    if (event.aspect_type === "delete") {
      await deleteStravaActivity(userId, stravaId);
    } else if (event.aspect_type === "create" || event.aspect_type === "update") {
      await syncSingleActivity(userId, stravaId);
    }
  } catch (error) {
    console.error("[STRAVA] webhook event failed:", error);
  }
  return NextResponse.json({ ok: true });
}
