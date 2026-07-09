import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getAuthUrl, isGoogleConfigured } from "@/lib/google";
import {
  OAUTH_STATE_COOKIE,
  generateOAuthState,
  isSecureRequest,
  stateCookieOptions,
} from "@/lib/oauth-state";

// Starts the calendar OAuth flow by redirecting to Google's consent screen.
// (Separate from login: this asks for calendar.readonly, incremental consent.)
export async function GET(request: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL("/settings?google=not_configured", request.url));
  }

  // The state travels two ways: in the consent URL (Google echoes it to the
  // callback) and in an HttpOnly cookie the callback compares it against.
  const state = generateOAuthState();
  const response = NextResponse.redirect(getAuthUrl(state));
  response.cookies.set(OAUTH_STATE_COOKIE, state, stateCookieOptions(isSecureRequest(request)));
  return response;
}
