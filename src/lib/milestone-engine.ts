// Milestone evaluation engine — "proven only" mode: a milestone is auto-completed
// iff the user's logged workouts actually satisfy its criteria. Auto rows
// (UserMilestone.source === "auto") are fully engine-managed and recomputed
// after every workout change; manual rows are never touched.
import { prisma } from "@/lib/prisma";
import { parseCriteria, type Criterion } from "@/lib/milestone-criteria";
import { dayKeyToDate } from "@/lib/dates";

export type WorkoutFacts = {
  date: string; // "YYYY-MM-DD"
  distanceKm: number;
  durationMin: number;
  isRace: boolean;
};

/** Monday-based week key for a day, e.g. "2026-W27" equivalent (uses Monday's date). */
function weekKey(date: string): string {
  const d = dayKeyToDate(date);
  const day = (d.getDay() + 6) % 7; // Mon=0..Sun=6
  d.setDate(d.getDate() - day);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthKey(date: string): string {
  return date.slice(0, 7); // "YYYY-MM"
}

/** Consecutive Monday keys: next week's key for a given week key. */
function nextWeekKey(key: string): string {
  const d = dayKeyToDate(key);
  d.setDate(d.getDate() + 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function satisfies(criterion: Criterion, workouts: WorkoutFacts[]): boolean {
  switch (criterion.type) {
    case "single_distance":
      return workouts.some((w) => w.distanceKm >= criterion.km);
    case "single_duration":
      return workouts.some((w) => w.durationMin >= criterion.minutes);
    case "time_for_distance":
      // Average-pace scaling: a longer run counts for a shorter distance only
      // if the average pace is fast enough (documented simplification).
      // Strict < to match milestone titles ("poniżej X minut").
      return workouts.some(
        (w) =>
          w.distanceKm >= criterion.km &&
          (w.durationMin / w.distanceKm) * criterion.km < criterion.maxMinutes
      );
    case "weekly_km": {
      const sums = new Map<string, number>();
      for (const w of workouts) {
        const key = weekKey(w.date);
        sums.set(key, (sums.get(key) ?? 0) + w.distanceKm);
      }
      return [...sums.values()].some((km) => km >= criterion.km);
    }
    case "monthly_km": {
      const sums = new Map<string, number>();
      for (const w of workouts) {
        const key = monthKey(w.date);
        sums.set(key, (sums.get(key) ?? 0) + w.distanceKm);
      }
      return [...sums.values()].some((km) => km >= criterion.km);
    }
    case "total_km":
      return workouts.reduce((sum, w) => sum + w.distanceKm, 0) >= criterion.km;
    case "frequency": {
      const counts = new Map<string, number>();
      for (const w of workouts) {
        const key = weekKey(w.date);
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
      const qualifying = [...counts.entries()]
        .filter(([, count]) => count >= criterion.perWeek)
        .map(([key]) => key)
        .sort();
      let streak = 0;
      let prev: string | null = null;
      for (const key of qualifying) {
        streak = prev !== null && nextWeekKey(prev) === key ? streak + 1 : 1;
        if (streak >= criterion.weeks) return true;
        prev = key;
      }
      return false;
    }
    case "race":
      return workouts.some((w) => w.isRace);
    case "progression":
      // Manual skill tracks are never auto-completed from workouts.
      return false;
    case "any_of":
      return criterion.of.some((c) => satisfies(c, workouts));
  }
}

/**
 * Recompute engine-managed completions for a user+activity.
 * Returns the newly auto-completed levels (ascending).
 */
export async function recomputeAutoMilestones(
  userId: string,
  activityId: string
): Promise<number[]> {
  const [milestones, workouts] = await Promise.all([
    prisma.milestone.findMany({
      where: { activityId },
      select: {
        id: true,
        level: true,
        criteriaJson: true,
        completions: { where: { userId }, select: { source: true } },
      },
      orderBy: { level: "asc" },
    }),
    prisma.workout.findMany({
      where: { userId, activityId },
      select: { date: true, distanceKm: true, durationMin: true, isRace: true },
    }),
  ]);

  const toCreate: { id: string; level: number }[] = [];
  const toDelete: string[] = [];

  for (const m of milestones) {
    const criterion = parseCriteria(m.criteriaJson);
    if (!criterion) continue; // manual-only milestone
    const proven = satisfies(criterion, workouts);
    const existing = m.completions[0];
    if (proven && !existing) {
      toCreate.push({ id: m.id, level: m.level });
    } else if (!proven && existing?.source === "auto") {
      toDelete.push(m.id);
    }
  }

  await prisma.$transaction([
    ...toCreate.map((m) =>
      prisma.userMilestone.create({
        data: { userId, milestoneId: m.id, source: "auto" },
      })
    ),
    ...(toDelete.length > 0
      ? [prisma.userMilestone.deleteMany({ where: { userId, milestoneId: { in: toDelete } } })]
      : []),
  ]);

  return toCreate.map((m) => m.level).sort((a, b) => a - b);
}
