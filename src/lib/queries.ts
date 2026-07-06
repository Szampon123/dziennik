// Read-side helpers used by server components. Every query is scoped to a
// user id (resolved from the session by the caller via requireUserId()).
import { prisma } from "@/lib/prisma";
import { todayKey, dayKeyDaysAgo } from "@/lib/dates";

/** Get today's entry for the user, creating an empty open one on first visit. */
export async function getOrCreateToday(userId: string) {
  const date = todayKey();
  return prisma.dayEntry.upsert({
    where: { userId_date: { userId, date } },
    update: {},
    create: { userId, date },
    include: { notes: { orderBy: { createdAt: "asc" } } },
  });
}

export async function getDayWithNotes(userId: string, date: string) {
  return prisma.dayEntry.findUnique({
    where: { userId_date: { userId, date } },
    include: { notes: { orderBy: { createdAt: "asc" } } },
  });
}

/** Number of activity levels the user has completed — the Dudu companion's XP. */
export async function completedMilestoneCount(userId: string): Promise<number> {
  return prisma.userMilestone.count({ where: { userId } });
}

/** The user's saved quote ids, newest first (references src/lib/quotes.ts). */
export async function favoriteQuoteIds(userId: string): Promise<string[]> {
  const rows = await prisma.favoriteQuote.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { quoteId: true },
  });
  return rows.map((r) => r.quoteId);
}

/** All of the user's days, newest first, with note counts — for the history list. */
export async function listDays(userId: string) {
  return prisma.dayEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { _count: { select: { notes: true } } },
  });
}

/** The user's last 30 days (including today) with ratings — for the chart. */
export async function lastThirtyDays(userId: string) {
  const from = dayKeyDaysAgo(29);
  return prisma.dayEntry.findMany({
    where: { userId, date: { gte: from } },
    orderBy: { date: "asc" },
    select: { date: true, dayRating: true, energyLevel: true, tasksDone: true, tasksTotal: true },
  });
}

/**
 * Consecutive closed-day streak. Today still being open doesn't break the
 * streak (the day isn't over yet) — counting starts from today if closed,
 * otherwise from yesterday.
 */
export async function closedDayStreak(userId: string): Promise<number> {
  const from = dayKeyDaysAgo(365);
  const closed = await prisma.dayEntry.findMany({
    where: { userId, status: "closed", date: { gte: from } },
    select: { date: true },
  });
  const closedSet = new Set(closed.map((d) => d.date));

  let streak = 0;
  let offset = closedSet.has(todayKey()) ? 0 : 1;
  while (closedSet.has(dayKeyDaysAgo(offset))) {
    streak++;
    offset++;
  }
  return streak;
}
