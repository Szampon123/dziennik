import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { handleOAuthCallback } from "@/lib/google";
import { clearCalendarCache } from "@/lib/calendar-cache";
import {
  OAUTH_STATE_COOKIE,
  clearedStateCookieOptions,
  getStateCookie,
  isSecureRequest,
  statesMatch,
} from "@/lib/oauth-state";

// Calendar OAuth redirect URI — exchanges the code for tokens and stores them
// for the signed-in user.
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
  const clearOptions = clearedStateCookieOptions(isSecureRequest(request));
  const settingsRedirect = (status: string) => {
    const res = NextResponse.redirect(new URL(`/settings?google=${status}`, request.url));
    res.cookies.set(OAUTH_STATE_COOKIE, "", clearOptions);
    return res;
  };

  if (error || !code) {
    return settingsRedirect("error");
  }

  // CSRF check: what Google echoed back must equal what we stored. Runs before
  // the code is exchanged, so a forged callback never reaches Google.
  if (!statesMatch(stateParam, getStateCookie(request))) {
    console.error("[OAUTH] State mismatch — possible CSRF attempt");
    return settingsRedirect("error");
  }

  try {
    await handleOAuthCallback(userId, code);
    clearCalendarCache(userId);
    return settingsRedirect("connected");
  } catch (e) {
    console.error("Google OAuth callback failed:", e);
    return settingsRedirect("error");
  }
}
