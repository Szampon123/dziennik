import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  deleteStravaActivity,
  forgetStravaAthlete,
  getUserIdByAthleteId,
  syncSingleActivity,
  verifyStravaDeauthorized,
} from "@/lib/strava";
import { statesMatch } from "@/lib/oauth-state";
import { rateLimit } from "@/lib/rate-limit";

// Strava webhook endpoint — one subscription per app, created once via the
// push subscriptions API with verify_token = STRAVA_WEBHOOK_VERIFY_TOKEN and
// callback_url pointing here WITH the token in the query string:
//
//   https://<domain>/api/strava/webhook?token=<STRAVA_WEBHOOK_VERIFY_TOKEN>
//
// Strava then POSTs an event for every activity create/update/delete (and
// athlete deauthorization) of every connected user.
//
// Threat model: Strava does not sign events, so this route is reachable by
// anyone. Three layers keep forged requests harmless:
//   1. The token in the query string — only Strava ever learns the full
//      callback URL, so a POST without it is not Strava. (This is the
//      standard capability-URL workaround for Strava's lack of signatures.)
//   2. Payloads are never trusted beyond ids — activity data is always
//      re-fetched through the owner's stored token.
//   3. Destructive events are verified against Strava before acting:
//      deletes only when the activity is really gone, deauthorizations only
//      when the grant is really dead (see src/lib/strava.ts).

function tokenMatches(request: NextRequest): boolean {
  const expected = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;
  if (!expected) return false;
  return statesMatch(request.nextUrl.searchParams.get("token"), expected);
}

/** Subscription validation: echo hub.challenge when the verify token matches. */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const verifyToken = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN;
  if (
    params.get("hub.mode") !== "subscribe" ||
    !verifyToken ||
    !statesMatch(params.get("hub.verify_token"), verifyToken)
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
  // Not Strava (or a misconfigured subscription): reject loudly. A 403 here is
  // visible during registration, when it's still cheap to fix.
  if (!tokenMatches(request)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Defence in depth for the API quota (200 req/15 min shared app-wide): even
  // a caller who somehow holds the callback URL can't make us burn it — each
  // accepted event costs up to one Strava fetch. Real traffic is nowhere near
  // this; Strava retries 429s later.
  const limited = rateLimit("strava:webhook", 120, 60);
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "rate limited" },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let event: StravaEvent;
  try {
    event = (await request.json()) as StravaEvent;
  } catch {
    return NextResponse.json({ ok: true }); // malformed body — nothing to retry
  }

  // Always answer 200 past this point: a non-2xx makes Strava retry for hours
  // and eventually disable the subscription. Failures are logged, never surfaced.
  try {
    const athleteId = event.owner_id != null ? String(event.owner_id) : null;
    if (!athleteId || event.object_id == null) return NextResponse.json({ ok: true });

    // User revoked access on strava.com — verify against Strava, then drop the
    // dead token. Unverified events are ignored (see threat model above).
    if (event.object_type === "athlete") {
      if (event.updates?.authorized === "false") {
        const userId = await getUserIdByAthleteId(athleteId);
        if (userId && (await verifyStravaDeauthorized(userId))) {
          await forgetStravaAthlete(athleteId);
        }
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
