import { Flame } from "lucide-react";
import { TIERS, tierForLevel } from "@/lib/activity-tiers";
import { formatDate, startOfWeek, addDays, todayKey, dayKeyToDate } from "@/lib/dates";
import { Progress } from "@/components/ui/Progress";
import { getT } from "@/lib/i18n/server";

type MilestoneLite = { level: number; title: string; done: boolean; completedAt: number | null };
type WorkoutLite = { date: string; distanceKm: number };

// Consecutive calendar weeks (ending this week or last) that have ≥1 workout.
function weeklyTrainingStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const weeks = new Set(dates.map((d) => startOfWeek(d)));
  const thisWeek = startOfWeek(todayKey());
  let cur = weeks.has(thisWeek) ? thisWeek : addDays(thisWeek, -7);
  if (!weeks.has(cur)) return 0;
  let n = 0;
  while (weeks.has(cur)) {
    n++;
    cur = addDays(cur, -7);
  }
  return n;
}

// Rich header for an activity: completion ring, per-tier breakdown, next goals
// and this-week momentum (levels gained; for distance activities also a weekly
// training streak + this week's distance). Server component (pure display).
export async function ActivityStats({
  completedCount,
  maxLevel,
  level,
  levelAchievedAt,
  logKind,
  milestones,
  workouts,
}: {
  completedCount: number;
  maxLevel: number;
  level: number;
  levelAchievedAt: number | null;
  logKind: string;
  milestones: MilestoneLite[];
  workouts: WorkoutLite[];
}) {
  const { t, locale } = await getT();
  const pct = maxLevel > 0 ? Math.round((completedCount / maxLevel) * 100) : 0;
  const allDone = completedCount === maxLevel;

  const weekStart = startOfWeek(todayKey());
  const weekStartMs = dayKeyToDate(weekStart).getTime();
  const gainedThisWeek = milestones.filter(
    (m) => m.done && m.completedAt !== null && m.completedAt >= weekStartMs
  ).length;

  const tiers = TIERS.map((t) => {
    const inRange = milestones.filter((m) => m.level >= t.from && m.level <= t.to);
    return { ...t, total: inRange.length, done: inRange.filter((m) => m.done).length };
  });
  const currentTier = tierForLevel(level > 0 ? level : 1);

  const nextGoals = milestones.filter((m) => !m.done).slice(0, 3);

  // Distance-activity momentum.
  const isDistance = logKind === "distance";
  const streak = isDistance ? weeklyTrainingStreak(workouts.map((w) => w.date)) : 0;
  const kmThisWeek = isDistance
    ? workouts
        .filter((w) => startOfWeek(w.date) === weekStart)
        .reduce((s, w) => s + w.distanceKm, 0)
    : 0;

  return (
    <div className="rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-card">
      {/* Top: ring + level + momentum pills */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Ring pct={pct} />
        <div className="min-w-0">
          <p className="text-2xl font-semibold">
            <span className="text-violet-700">{completedCount}</span>
            <span className="text-base font-normal text-neutral-500">
              /{maxLevel} {t("stats.levelsWord")}
            </span>
          </p>
          <p className="mt-0.5 text-[13px] text-neutral-500">
            {t("stats.stage")}{" "}
            <span className="text-neutral-800">{t(tierForLevel(level > 0 ? level : 1).nameKey)}</span>
            {levelAchievedAt !== null && (
              <> · {t("stats.lastly", { date: formatDate(levelAchievedAt, locale) })}</>
            )}
          </p>
        </div>
        <div className="ml-auto flex flex-wrap justify-end gap-2">
          {gainedThisWeek > 0 && (
            <Pill tone="success">{t("stats.gained", { n: gainedThisWeek })}</Pill>
          )}
          {isDistance && streak > 0 && (
            <Pill tone="warning">
              <Flame aria-hidden className="h-3.5 w-3.5" /> {t("stats.streakWeeks", { n: streak })}
            </Pill>
          )}
          {isDistance && kmThisWeek > 0 && (
            <Pill tone="azure">{t("stats.kmThisWeek", { km: Math.round(kmThisWeek * 10) / 10 })}</Pill>
          )}
        </div>
      </div>

      {/* Tier breakdown */}
      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {tiers.map((tier) => {
          const isCurrent = tier.nameKey === currentTier.nameKey && !allDone;
          const full = tier.done === tier.total && tier.total > 0;
          return (
            <div
              key={tier.nameKey}
              className={`rounded-lg border p-2 ${
                isCurrent ? "border-violet-400 bg-violet-100/40" : "border-neutral-200"
              }`}
            >
              <p className="truncate text-[11px] font-medium text-neutral-600" title={t(tier.nameKey)}>
                {t(tier.nameKey)}
              </p>
              <p
                className={`mb-1 text-[11px] tabular-nums ${
                  full ? "font-semibold text-success" : "text-neutral-400"
                }`}
              >
                {tier.done}/{tier.total}
              </p>
              <Progress value={tier.done} max={tier.total} className="h-1" />
            </div>
          );
        })}
      </div>

      {/* Next goals / done */}
      <div className="mt-4 border-t border-neutral-100 pt-4">
        {allDone ? (
          <p className="text-[13px] font-medium text-success">{t("stats.allDone")}</p>
        ) : (
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
              {t("stats.nextGoals")}
            </p>
            <ul className="flex flex-col gap-1">
              {nextGoals.map((m) => (
                <li key={m.level} className="flex items-baseline gap-2 text-[14px]">
                  <span className="w-7 shrink-0 text-right font-mono text-[12px] text-neutral-400">
                    {m.level}
                  </span>
                  <span className="text-neutral-800">{m.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "success" | "warning" | "azure";
  children: React.ReactNode;
}) {
  const cls = {
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
    azure: "bg-azure-100 text-azure-700",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold ${cls}`}>
      {children}
    </span>
  );
}

function Ring({ pct }: { pct: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0" aria-hidden>
      <circle cx="32" cy="32" r={r} fill="none" stroke="var(--neutral-200)" strokeWidth="7" />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="var(--azure-500)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 32 32)"
      />
      <text
        x="32"
        y="32"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-neutral-900 text-[15px] font-semibold"
      >
        {pct}%
      </text>
    </svg>
  );
}
