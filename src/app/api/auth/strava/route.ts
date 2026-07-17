import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getStravaAuthUrl, isStravaConfigured } from "@/lib/strava";
import {
  STRAVA_OAUTH_STATE_COOKIE,
  generateOAuthState,
  isSecureRequest,
  stateCookieOptions,
} from "@/lib/oauth-state";

// Starts the Strava OAuth flow by redirecting to Strava's consent screen.
// (Incremental consent, separate from login — same shape as the Google flow.)
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!isStravaConfigured()) {
    return NextResponse.redirect(new URL("/settings?strava=not_configured", request.url));
  }

  // The state travels two ways: in the consent URL (Strava echoes it to the
  // callback) and in an HttpOnly cookie the callback compares it against.
  const state = generateOAuthState();
  const response = NextResponse.redirect(getStravaAuthUrl(state));
  response.cookies.set(
    STRAVA_OAUTH_STATE_COOKIE,
    state,
    stateCookieOptions(isSecureRequest(request), "/api/auth/strava")
  );
  return response;
}
