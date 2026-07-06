// Shared helpers for activity seed files.
import type { Criterion } from "../../src/lib/milestone-criteria";

export type MilestoneSeed = { level: number; title: string; detail?: string };

/** Build milestones from an ordered [title, detail?] list (index 0 = level 1). */
export function ladder(entries: [string, string?][]): MilestoneSeed[] {
  return entries.map(([title, detail], i) => ({ level: i + 1, title, detail }));
}

// Co-located criterion form: [title, detail?, criterion?]. Building milestones
// and criteriaByLevel from one list guarantees levels never drift apart —
// preferred for ladders with many auto-evaluable/progression levels.
export type LadderEntry = [string, (string | undefined)?, Criterion?];

export function ladderC(entries: LadderEntry[]): {
  milestones: MilestoneSeed[];
  criteriaByLevel: Record<number, Criterion>;
} {
  const milestones: MilestoneSeed[] = [];
  const criteriaByLevel: Record<number, Criterion> = {};
  entries.forEach(([title, detail, criterion], i) => {
    const level = i + 1;
    milestones.push({ level, title, detail });
    if (criterion) criteriaByLevel[level] = criterion;
  });
  return { milestones, criteriaByLevel };
}

// Criterion factories (distances in km, times in minutes).
export const d = (km: number): Criterion => ({ type: "single_distance", km });
export const t = (minutes: number): Criterion => ({ type: "single_duration", minutes });
export const tfd = (km: number, maxMinutes: number): Criterion => ({
  type: "time_for_distance",
  km,
  maxMinutes,
});
export const weekly = (km: number): Criterion => ({ type: "weekly_km", km });
export const monthly = (km: number): Criterion => ({ type: "monthly_km", km });
export const total = (km: number): Criterion => ({ type: "total_km", km });
export const freq = (perWeek: number, weeks: number): Criterion => ({
  type: "frequency",
  perWeek,
  weeks,
});
export const race: Criterion = { type: "race" };
export const anyOf = (...of: Criterion[]): Criterion => ({ type: "any_of", of });
/** Manual skill track — implication only (never auto-completed from workouts). */
export const prog = (track: string, value: number): Criterion => ({
  type: "progression",
  track,
  value,
});
