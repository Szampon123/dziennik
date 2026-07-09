import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getCachedEvents } from "@/lib/calendar-cache";
import { getGoogleStatus } from "@/lib/google";
import { rateLimit } from "@/lib/rate-limit";

// GET /api/calendar/events?days=7[&past=6][&fresh=1]
// Returns the signed-in user's events, `past` days back through `days` ahead
// (5 min cache). The past window feeds the 7-day completion trend.
export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ status: "unauthorized", events: [] }, { status: 401 });
  }

  const rl = rateLimit(`api:calendar:${userId}`, 60, 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { status: "rate_limited", error: "Too many requests. Try again later.", events: [] },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  const url = new URL(request.url);
  const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 7, 0), 35);
  const pastDays = Math.min(Math.max(Number(url.searchParams.get("past")) || 0, 0), 31);
  const fresh = url.searchParams.get("fresh") === "1";

  const status = await getGoogleStatus(userId);
  if (status.state !== "connected") {
    return NextResponse.json({ status: status.state, events: [] });
  }

  try {
    const { events, cached } = await getCachedEvents(userId, days, { fresh, pastDays });
    return NextResponse.json({ status: "ok", events, cached });
  } catch (e) {
    console.error("Calendar fetch failed:", e);
    const message =
      e instanceof Error && e.message === "NOT_CONNECTED"
        ? "Brak połączenia z Google. Autoryzuj ponownie w Ustawieniach."
        : "Nie udało się pobrać wydarzeń z Google Calendar.";
    return NextResponse.json({ status: "error", error: message, events: [] }, { status: 502 });
  }
}
