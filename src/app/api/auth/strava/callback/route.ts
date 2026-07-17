import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { handleStravaCallback, syncStravaActivities } from "@/lib/strava";
import {
  STRAVA_OAUTH_STATE_COOKIE,
  clearedStateCookieOptions,
  getStateCookie,
  isSecureRequest,
  statesMatch,
} from "@/lib/oauth-state";

// Strava OAuth redirect URI — exchanges the code for tokens, stores them for
// the signed-in user, then runs the initial import so the account isn't empty
// until the first webhook event arrives.
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const stateParam = url.searchParams.get("state");

  // The state cookie is single-use: expire it on every outcome, success or not.
  const clearOptions = clearedStateCookieOptions(isSecureRequest(request), "/api/auth/strava");
  const settingsRedirect = (status: string) => {
    const res = NextResponse.redirect(new URL(`/settings?strava=${status}`, request.url));
    res.cookies.set(STRAVA_OAUTH_STATE_COOKIE, "", clearOptions);
    return res;
  };

  if (error || !code) {
    return settingsRedirect("error");
  }

  // CSRF check: what Strava echoed back must equal what we stored. Runs before
  // the code is exchanged, so a forged callback never reaches Strava.
  if (!statesMatch(stateParam, getStateCookie(request, STRAVA_OAUTH_STATE_COOKIE))) {
    console.error("[OAUTH] Strava state mismatch — possible CSRF attempt");
    return settingsRedirect("error");
  }

  try {
    await handleStravaCallback(userId, code);
  } catch (e) {
    console.error("Strava OAuth callback failed:", e);
    return settingsRedirect("error");
  }

  // Initial import is best-effort: the connection is already saved, so a
  // hiccup here must not read as "connecting failed" — the user can hit
  // "sync now" in Settings and the webhook covers everything from now on.
  try {
    await syncStravaActivities(userId);
  } catch (e) {
    console.error("Strava initial import failed:", e);
  }
  return settingsRedirect("connected");
}
