import { prisma } from "@/lib/prisma";
import { daysInMonth } from "@/lib/dates";

export type HabitWithChecks = {
  id: string;
  name: string;
  /** Weekly target: how many days a week to do it (1..7; 7 = every day). */
  targetPerWeek: number;
  /** Day keys ("YYYY-MM-DD") in the requested month on which the habit is done. */
  checkedDates: string[];
};

/**
 * Active (non-archived) habits for a user, each with the set of days it was
 * completed within `monthKey` ("YYYY-MM"). One cheap query for the habits, one
 * for the month's checks — mirrors the CalendarEventCheck read pattern.
 */
export async function listHabitsWithChecks(
  userId: string,
  monthKey: string
): Promise<HabitWithChecks[]> {
  const days = daysInMonth(monthKey);
  const [habits, checks] = await Promise.all([
    prisma.habit.findMany({
      where: { userId, archivedAt: null },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, targetPerWeek: true },
    }),
    prisma.habitCheck.findMany({
      where: { userId, date: { in: days } },
      select: { habitId: true, date: true },
    }),
  ]);

  const byHabit = new Map<string, string[]>();
  for (const c of checks) {
    const arr = byHabit.get(c.habitId);
    if (arr) arr.push(c.date);
    else byHabit.set(c.habitId, [c.date]);
  }

  return habits.map((h) => ({
    id: h.id,
    name: h.name,
    targetPerWeek: h.targetPerWeek,
    checkedDates: byHabit.get(h.id) ?? [],
  }));
}

export type ArchivedHabit = { id: string; name: string };

/** Archived (dropped) habits — surfaced in the manage panel so they can be restored. */
export async function archivedHabits(userId: string): Promise<ArchivedHabit[]> {
  return prisma.habit.findMany({
    where: { userId, archivedAt: { not: null } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}
