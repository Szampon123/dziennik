import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getAuthUrl, isGoogleConfigured } from "@/lib/google";

// Starts the calendar OAuth flow by redirecting to Google's consent screen.
// (Separate from login: this asks for calendar.readonly, incremental consent.)
export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL("/settings?google=not_configured", request.url));
  }
  return NextResponse.redirect(getAuthUrl());
}
