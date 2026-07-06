// Machine-readable milestone criteria (client-safe: no Prisma imports).
// Stored as JSON in Milestone.criteriaJson; null/invalid = manual-only milestone.
import { z } from "zod";

const baseCriterion = z.discriminatedUnion("type", [
  // One continuous workout covering at least `km`.
  z.object({ type: z.literal("single_distance"), km: z.number().positive() }),
  // One workout lasting at least `minutes`.
  z.object({ type: z.literal("single_duration"), minutes: z.number().positive() }),
  // One workout with distance >= km whose average pace covers `km` within
  // `maxMinutes`: (durationMin / distanceKm) * km <= maxMinutes.
  z.object({
    type: z.literal("time_for_distance"),
    km: z.number().positive(),
    maxMinutes: z.number().positive(),
  }),
  // Any calendar week (Mon-Sun) with total distance >= km.
  z.object({ type: z.literal("weekly_km"), km: z.number().positive() }),
  // Any calendar month with total distance >= km.
  z.object({ type: z.literal("monthly_km"), km: z.number().positive() }),
  // All-time total distance >= km.
  z.object({ type: z.literal("total_km"), km: z.number().positive() }),
  // `weeks` consecutive calendar weeks, each with >= perWeek workouts.
  z.object({
    type: z.literal("frequency"),
    perWeek: z.number().int().positive(),
    weeks: z.number().int().positive(),
  }),
  // Any workout flagged as an official race/parkrun.
  z.object({ type: z.literal("race") }),
  // Manual skill track: not evaluable from workouts, but enables implication
  // within the same named track (e.g. 20 push-ups proves 10 push-ups, and
  // never anything about squats). Higher value = stronger claim.
  z.object({ type: z.literal("progression"), track: z.string().min(1), value: z.number() }),
]);

export const criterionSchema: z.ZodType<Criterion> = z.lazy(() =>
  z.union([baseCriterion, z.object({ type: z.literal("any_of"), of: z.array(criterionSchema).min(1) })])
) as z.ZodType<Criterion>;

export type BaseCriterion = z.infer<typeof baseCriterion>;
export type Criterion = BaseCriterion | { type: "any_of"; of: Criterion[] };

/** Parse a criteriaJson column value; returns null for manual-only milestones. */
export function parseCriteria(json: string | null): Criterion | null {
  if (!json) return null;
  try {
    const parsed = criterionSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * Logical implication between criteria: does achieving `stronger` prove
 * `weaker`? Deliberately conservative — never crosses dimensions (running
 * 20 minutes proves nothing about kilometers, since the pace is unknown).
 * Used by the manual-cascade so checking a level only auto-checks lower
 * levels it actually proves.
 */
export function implies(stronger: Criterion, weaker: Criterion): boolean {
  // An any_of claim proves `weaker` only if every branch proves it.
  if (stronger.type === "any_of") return stronger.of.every((s) => implies(s, weaker));
  // Proving any branch of a weaker any_of is enough.
  if (weaker.type === "any_of") return weaker.of.some((w) => implies(stronger, w));

  switch (weaker.type) {
    case "single_duration":
      return stronger.type === "single_duration" && stronger.minutes >= weaker.minutes;
    case "single_distance":
      return (
        (stronger.type === "single_distance" && stronger.km >= weaker.km) ||
        (stronger.type === "time_for_distance" && stronger.km >= weaker.km)
      );
    case "time_for_distance":
      // Same average-pace scaling as the workout engine.
      return (
        stronger.type === "time_for_distance" &&
        stronger.km >= weaker.km &&
        (stronger.maxMinutes / stronger.km) * weaker.km <= weaker.maxMinutes
      );
    case "weekly_km":
      return stronger.type === "weekly_km" && stronger.km >= weaker.km;
    case "monthly_km":
      return stronger.type === "monthly_km" && stronger.km >= weaker.km;
    case "total_km":
      return stronger.type === "total_km" && stronger.km >= weaker.km;
    case "frequency":
      return (
        stronger.type === "frequency" &&
        stronger.perWeek >= weaker.perWeek &&
        stronger.weeks >= weaker.weeks
      );
    case "race":
      return stronger.type === "race";
    case "progression":
      return (
        stronger.type === "progression" &&
        stronger.track === weaker.track &&
        stronger.value >= weaker.value
      );
  }
}
