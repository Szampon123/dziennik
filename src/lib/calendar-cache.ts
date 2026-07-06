// In-memory cache for calendar events (TTL 5 min), keyed per user. Events are
// never written to the database — this only spares the Google API on reloads.
import {
  fetchCalendarEvents,
  fetchCalendarEventsForDay,
  type CalendarEvent,
} from "@/lib/google";

const TTL_MS = 5 * 60 * 1000;

type CacheEntry = { events: CalendarEvent[]; fetchedAt: number };

// Survives hot reloads in dev the same way the Prisma singleton does.
const globalForCache = globalThis as unknown as {
  calendarCache?: Map<string, CacheEntry>;
};
const cache = (globalForCache.calendarCache ??= new Map<string, CacheEntry>());

export async function getCachedEvents(
  userId: string,
  days: number,
  { fresh = false, pastDays = 0 }: { fresh?: boolean; pastDays?: number } = {}
): Promise<{ events: CalendarEvent[]; cached: boolean }> {
  const key = `events:${userId}:${days}:${pastDays}`;
  const entry = cache.get(key);
  if (!fresh && entry && Date.now() - entry.fetchedAt < TTL_MS) {
    return { events: entry.events, cached: true };
  }
  const events = await fetchCalendarEvents(userId, days, pastDays);
  cache.set(key, { events, fetchedAt: Date.now() });
  return { events, cached: false };
}

/** Cached events for a single absolute day — used to review a past day's tasks. */
export async function getCachedDayEvents(
  userId: string,
  dayKey: string,
  { fresh = false }: { fresh?: boolean } = {}
): Promise<{ events: CalendarEvent[]; cached: boolean }> {
  const key = `dayEvents:${userId}:${dayKey}`;
  const entry = cache.get(key);
  if (!fresh && entry && Date.now() - entry.fetchedAt < TTL_MS) {
    return { events: entry.events, cached: true };
  }
  const events = await fetchCalendarEventsForDay(userId, dayKey);
  cache.set(key, { events, fetchedAt: Date.now() });
  return { events, cached: false };
}

/** Drop cached events for one user (on connect/disconnect) or everyone. */
export function clearCalendarCache(userId?: string) {
  if (!userId) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(`events:${userId}:`)) cache.delete(key);
  }
}
