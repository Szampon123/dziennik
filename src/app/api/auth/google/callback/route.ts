import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { handleOAuthCallback } from "@/lib/google";
import { clearCalendarCache } from "@/lib/calendar-cache";

// Calendar OAuth redirect URI — exchanges the code for tokens and stores them
// for the signed-in user.
export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/settings?google=error", request.url));
  }

  try {
    await handleOAuthCallback(userId, code);
    clearCalendarCache(userId);
    return NextResponse.redirect(new URL("/settings?google=connected", request.url));
  } catch (e) {
    console.error("Google OAuth callback failed:", e);
    return NextResponse.redirect(new URL("/settings?google=error", request.url));
  }
}
