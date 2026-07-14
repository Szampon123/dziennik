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

/** What a recompute changed, both directions. Levels are ascending. */
export type RecomputeResult = { added: number[]; removed: number[] };

/** A recompute, decided but not yet written. */
export type RecomputePlan = {
  toCreate: { id: string; level: number }[];
  toDelete: { id: string; level: number }[];
};

/**
 * Decide what a recompute would change, and write nothing.
 *
 * Split out from the apply step so a migration can be *shown* before it happens:
 * scripts/recompute-milestones.ts runs this against every affected user to print a
 * diff, and only writes when told to. A dry run that re-implemented these rules
 * instead of calling them would be a dry run of a different engine.
 */
export async function planRecompute(userId: string, activityId: string): Promise<RecomputePlan> {
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
  const toDelete: { id: string; level: number }[] = [];

  for (const m of milestones) {
    const criterion = parseCriteria(m.criteriaJson);
    const existing = m.completions[0];

    if (!criterion) {
      // The level is manual-only *now*. If the engine granted it earlier, it did so
      // on the strength of a criterion that has since been removed from the seed —
      // and nothing else will ever revisit it. Skipping here (as this loop used to)
      // left the row on the account for good: a completion the engine still owns
      // but can no longer justify. Take it back; a level the user actually earned by
      // hand is a manual row and is not reachable from here.
      if (existing?.source === "auto") toDelete.push({ id: m.id, level: m.level });
      continue;
    }

    const proven = satisfies(criterion, workouts);
    if (proven && !existing) {
      toCreate.push({ id: m.id, level: m.level });
    } else if (!proven && existing?.source === "auto") {
      toDelete.push({ id: m.id, level: m.level });
    }
  }

  return { toCreate, toDelete };
}

/**
 * Recompute engine-managed completions for a user+activity, and write the result.
 *
 * The contract, in one line: a row with `source: "auto"` exists if and only if the
 * user's workouts prove the criterion the engine can see *right now*. Manual rows
 * are the user's own claim and are never touched, in either direction.
 */
export async function recomputeAutoMilestones(
  userId: string,
  activityId: string
): Promise<RecomputeResult> {
  const { toCreate, toDelete } = await planRecompute(userId, activityId);

  await prisma.$transaction([
    ...toCreate.map((m) =>
      prisma.userMilestone.create({
        data: { userId, milestoneId: m.id, source: "auto" },
      })
    ),
    ...(toDelete.length > 0
      ? [
          prisma.userMilestone.deleteMany({
            where: { userId, milestoneId: { in: toDelete.map((m) => m.id) } },
          }),
        ]
      : []),
  ]);

  const asc = (a: number, b: number) => a - b;
  return {
    added: toCreate.map((m) => m.level).sort(asc),
    removed: toDelete.map((m) => m.level).sort(asc),
  };
}
