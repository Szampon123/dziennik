"use client";

import { type CSSProperties, useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Archive,
  Trash2,
  Plus,
  Check,
  Flame,
  RotateCcw,
} from "lucide-react";
import {
  createHabit,
  renameHabit,
  moveHabit,
  setHabitArchived,
  deleteHabit,
  setHabitCheck,
  setHabitTarget,
  setHabitColor,
} from "@/actions/habits";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import {
  HABIT_COLORS,
  HABIT_COLOR_KEYS,
  habitColorValue,
  normalizeHabitColor,
  type HabitColorKey,
} from "@/lib/habit-colors";
import {
  daysInMonth,
  firstDayOfMonth,
  formatMonthYear,
  addMonths,
  addDays,
  startOfWeek,
  dayKeyToDate,
} from "@/lib/dates";

type Habit = {
  id: string;
  name: string;
  targetPerWeek: number;
  color: string;
  checkedDates: string[];
};
type ArchivedHabit = { id: string; name: string };

// A small round colour dot for a habit (name labels + manage list).
function ColorDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: habitColorValue(color) }}
    />
  );
}

function targetLabel(t: number) {
  return t >= 7 ? "codziennie" : `${t}×/tydz`;
}

// Sets the --hc CSS var used by coloured checkboxes.
function hcVar(color: string): CSSProperties {
  return { ["--hc"]: habitColorValue(color) } as CSSProperties;
}

// Flexible day columns (1fr) so the whole month fits on desktop without
// scrolling; the grid keeps a min-width so it still scrolls on narrow phones.
const NAME_COL = "minmax(72px,120px)";
// Two-letter weekday labels (index = Date.getDay(); 0 = Sunday).
const WEEKDAY = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function weekdayOf(dayKey: string) {
  return WEEKDAY[dayKeyToDate(dayKey).getDay()];
}
function isWeekendKey(dayKey: string) {
  const g = dayKeyToDate(dayKey).getDay();
  return g === 0 || g === 6;
}

// Monthly habit tracker. The grid is the overview; the "Dzisiaj" card is the
// fast daily interaction. Optimistic Set-toggle pattern from DayCalendarTasks;
// month navigation is server-driven via ?m=YYYY-MM. Design System: azure = data
// (ring + chart), violet = actions.
export function HabitTracker({
  habits,
  archived,
  monthKey,
  today,
}: {
  habits: Habit[];
  archived: ArchivedHabit[];
  monthKey: string;
  today: string;
}) {
  const [checked, setChecked] = useState<Set<string>>(
    () => new Set(habits.flatMap((h) => h.checkedDates.map((d) => `${h.id}|${d}`)))
  );
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const days = daysInMonth(monthKey);
  const isCurrentMonth = monthKey === today.slice(0, 7);
  const monthLabel = capitalize(formatMonthYear(firstDayOfMonth(monthKey)));

  // Group day keys into calendar weeks (Mon–Sun).
  const weeks: string[][] = [];
  for (const d of days) {
    const wk = startOfWeek(d);
    const last = weeks[weeks.length - 1];
    if (last && startOfWeek(last[0]) === wk) last.push(d);
    else weeks.push([d]);
  }

  const has = (habitId: string, d: string) => checked.has(`${habitId}|${d}`);
  const doneInMonth = (habitId: string) => days.filter((d) => has(habitId, d)).length;

  // Weekly-target progress: for each calendar week (its days within the month)
  // the goal is min(target, days available); completions are credited up to that
  // goal. This generalises the old daily model (target 7 → goal = # of days).
  // `elapsedOnly` restricts to days up to today (used by the "so far" ring).
  function progressOf(habitId: string, target: number, elapsedOnly: boolean) {
    let credited = 0;
    let goal = 0;
    for (const week of weeks) {
      const wdays = elapsedOnly ? week.filter((d) => d <= today) : week;
      if (wdays.length === 0) continue;
      const weekGoal = Math.min(target, wdays.length);
      const doneWeek = wdays.filter((d) => has(habitId, d)).length;
      credited += Math.min(doneWeek, weekGoal);
      goal += weekGoal;
    }
    return { credited, goal };
  }

  // Per-day completion count (chart) + total raw completions (summary).
  const dailyCounts = days.map((d) => habits.reduce((n, h) => n + (has(h.id, d) ? 1 : 0), 0));
  const totalDone = dailyCounts.reduce((a, b) => a + b, 0);
  const lastIdx = days.reduce((acc, d, i) => (d <= today ? i : acc), -1);

  // Adherence ring: credited completions vs weekly goals, over elapsed days.
  let adhDone = 0;
  let adhGoal = 0;
  for (const h of habits) {
    const p = progressOf(h.id, h.targetPerWeek, true);
    adhDone += p.credited;
    adhGoal += p.goal;
  }
  const adherencePct = adhGoal > 0 ? Math.round((adhDone / adhGoal) * 100) : 0;

  // Current streak (consecutive done days ending today or yesterday — stays
  // alive during the day until you check in).
  function streakOf(habitId: string) {
    let cur = has(habitId, today) ? today : addDays(today, -1);
    if (!has(habitId, cur)) return 0;
    let n = 0;
    while (has(habitId, cur)) {
      n++;
      cur = addDays(cur, -1);
    }
    return n;
  }
  // Longest run within the displayed month (month summary).
  function bestStreakInMonth(habitId: string) {
    let best = 0;
    let run = 0;
    for (const d of days) {
      if (has(habitId, d)) {
        run++;
        best = Math.max(best, run);
      } else run = 0;
    }
    return best;
  }

  // This-week summary (current month only): credited vs weekly goals, elapsed.
  const weekStart = startOfWeek(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)).filter(
    (d) => d.slice(0, 7) === monthKey && d <= today
  );
  const weekDoneOf = (habitId: string) => weekDays.filter((d) => has(habitId, d)).length;
  let weekDone = 0;
  let weekPossible = 0;
  for (const h of habits) {
    const wg = Math.min(h.targetPerWeek, weekDays.length);
    weekDone += Math.min(weekDoneOf(h.id), wg);
    weekPossible += wg;
  }

  // Month summary stats.
  const bestStreak = habits.reduce((m, h) => Math.max(m, bestStreakInMonth(h.id)), 0);
  const topHabit = habits.reduce<{ name: string; n: number } | null>((top, h) => {
    const n = doneInMonth(h.id);
    if (n > 0 && (!top || n > top.n)) return { name: h.name, n };
    return top;
  }, null);

  function toggle(habitId: string, date: string) {
    const key = `${habitId}|${date}`;
    const next = !checked.has(key);
    setChecked((prev) => {
      const s = new Set(prev);
      if (next) s.add(key);
      else s.delete(key);
      return s;
    });
    startTransition(async () => {
      const result = await setHabitCheck({ habitId, date, checked: next });
      if (!result.ok) {
        setError(result.error);
        setChecked((prev) => {
          const s = new Set(prev);
          if (next) s.delete(key);
          else s.add(key);
          return s;
        });
      } else {
        setError("");
      }
    });
  }

  const gridCols = `${NAME_COL} repeat(${days.length}, minmax(17px, 1fr))`;
  const gridMinWidth = 72 + days.length * 17;

  return (
    <div className="flex flex-col gap-5">
      {/* Header: month nav + adherence ring (azure = data) */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <div className="flex items-center gap-2">
          <Link
            href={`/nawyki?m=${addMonths(monthKey, -1)}`}
            aria-label="Poprzedni miesiąc"
            className="rounded-lg p-2 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-[160px] text-center">
            <p className="text-[18px] font-semibold tracking-[-0.3px] text-neutral-900">
              {monthLabel}
            </p>
            <p className="text-[12px] text-neutral-500">
              {isCurrentMonth && weekPossible > 0
                ? `${weekDone}/${weekPossible} w tym tygodniu`
                : "Dashboard nawyków"}
            </p>
          </div>
          <Link
            href={`/nawyki?m=${addMonths(monthKey, 1)}`}
            aria-label="Następny miesiąc"
            className="rounded-lg p-2 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>

        {habits.length > 0 && (
          <div className="flex items-center gap-3">
            <Ring pct={adherencePct} />
            <div className="text-[13px] text-neutral-500">
              <p className="font-semibold text-neutral-900">{adherencePct}% celu</p>
              <p>
                {adhDone}/{adhGoal} do tej pory
              </p>
            </div>
          </div>
        )}
      </div>

      {habits.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Today — fast daily check-in (only when viewing the current month) */}
          {isCurrentMonth && (
            <div className="rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-[15px] font-semibold text-neutral-900">Dzisiaj</h2>
                <span className="text-[12px] text-neutral-500">
                  {capitalize(
                    new Intl.DateTimeFormat("pl-PL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }).format(dayKeyToDate(today))
                  )}
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {habits.map((h) => {
                  const done = has(h.id, today);
                  const streak = streakOf(h.id);
                  const isDaily = h.targetPerWeek >= 7;
                  const weekN = weekDoneOf(h.id);
                  const weekMet = weekN >= h.targetPerWeek;
                  return (
                    <li key={h.id} className="flex items-center gap-3 py-1">
                      <button
                        type="button"
                        onClick={() => toggle(h.id, today)}
                        aria-pressed={done}
                        aria-label={`${h.name}${done ? " (zrobione dziś)" : " — odhacz dziś"}`}
                        style={hcVar(h.color)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                          done
                            ? "border-[var(--hc)] bg-[var(--hc)] text-white"
                            : "border-neutral-300 bg-neutral-0 text-transparent hover:border-[var(--hc)]"
                        }`}
                      >
                        <Check className="h-5 w-5" strokeWidth={3} />
                      </button>
                      <span
                        className={`flex-1 text-[15px] ${
                          done ? "text-neutral-400 line-through decoration-neutral-300" : "text-neutral-800"
                        }`}
                      >
                        {h.name}
                        {!isDaily && (
                          <span className="ml-1.5 text-[12px] text-neutral-400">
                            {targetLabel(h.targetPerWeek)}
                          </span>
                        )}
                      </span>
                      {isDaily
                        ? streak > 0 && (
                            <span
                              className="flex shrink-0 items-center gap-1 rounded-full bg-warning-bg px-2 py-0.5 text-[12px] font-semibold text-warning"
                              title={`Seria: ${streak} dni z rzędu`}
                            >
                              <Flame className="h-3.5 w-3.5" />
                              {streak}
                            </span>
                          )
                        : (
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold ${
                                weekMet
                                  ? "bg-success-bg text-success"
                                  : "bg-neutral-100 text-neutral-600"
                              }`}
                              title={
                                weekN > h.targetPerWeek
                                  ? "Powyżej celu tygodniowego — świetnie!"
                                  : "Wykonania w tym tygodniu"
                              }
                            >
                              {weekN}/{h.targetPerWeek} w tyg.
                            </span>
                          )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Month grid */}
          <div className="rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
            <div className="overflow-x-auto">
              <div
                className="grid w-full items-stretch"
                style={{ gridTemplateColumns: gridCols, minWidth: gridMinWidth }}
              >
                {/* Week band */}
                <div className="sticky left-0 z-10 bg-neutral-0" />
                {weeks.map((week, wi) => (
                  <div
                    key={`wk-${wi}`}
                    style={{ gridColumn: `span ${week.length}` }}
                    className={`mb-1 flex items-center justify-center py-1 text-[11px] font-semibold text-neutral-500 ${
                      wi > 0 ? "border-l border-neutral-200" : ""
                    }`}
                  >
                    Tydz. {wi + 1}
                  </div>
                ))}

                {/* Day header */}
                <div className="sticky left-0 z-10 flex items-end bg-neutral-0 pb-2 pr-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
                  Nawyk
                </div>
                {weeks.map((week, wi) =>
                  week.map((d, di) => {
                    const isToday = d === today;
                    const weekend = isWeekendKey(d);
                    return (
                      <div
                        key={`h-${d}`}
                        className={`flex flex-col items-center pb-2 pt-0.5 ${
                          wi > 0 && di === 0 ? "border-l border-neutral-200" : ""
                        } ${isToday ? "bg-violet-100" : weekend ? "bg-neutral-50" : ""}`}
                      >
                        <span
                          className={`text-[9px] leading-none ${
                            weekend ? "text-neutral-400" : "text-neutral-400"
                          }`}
                        >
                          {weekdayOf(d)}
                        </span>
                        <span
                          className={`text-[11px] leading-tight ${
                            isToday ? "font-bold text-violet-700" : "font-medium text-neutral-600"
                          }`}
                        >
                          {Number(d.slice(-2))}
                        </span>
                      </div>
                    );
                  })
                )}

                {/* One row per habit */}
                {habits.map((habit) => {
                  const p = progressOf(habit.id, habit.targetPerWeek, false);
                  return (
                    <HabitRow
                      key={habit.id}
                      habit={habit}
                      weeks={weeks}
                      has={has}
                      today={today}
                      done={doneInMonth(habit.id)}
                      goal={p.goal}
                      onToggle={toggle}
                    />
                  );
                })}
              </div>
            </div>
            {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
          </div>

          {/* Monthly activity chart + summary stats */}
          <div className="rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-neutral-900">Aktywność w miesiącu</h2>
              <div className="flex flex-wrap gap-1.5">
                <Stat label="Najlepsza seria" value={`${bestStreak} dni`} />
                <Stat label="Łącznie" value={`${totalDone} ✓`} />
                <Stat label="Top nawyk" value={topHabit ? topHabit.name : "—"} />
              </div>
            </div>
            <MonthActivityChart counts={dailyCounts} lastIdx={lastIdx} max={habits.length} days={days} />
          </div>
        </>
      )}

      <ManagePanel habits={habits} archived={archived} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[12px]">
      <span className="text-neutral-500">{label}:</span>
      <span className="max-w-[140px] truncate font-semibold text-neutral-900" title={value}>
        {value}
      </span>
    </span>
  );
}

function HabitRow({
  habit,
  weeks,
  has,
  today,
  done,
  goal,
  onToggle,
}: {
  habit: Habit;
  weeks: string[][];
  has: (habitId: string, d: string) => boolean;
  today: string;
  done: number;
  goal: number;
  onToggle: (habitId: string, date: string) => void;
}) {
  const over = done > goal;
  return (
    <>
      <div className="sticky left-0 z-10 flex flex-col justify-center gap-1 border-t border-neutral-100 bg-neutral-0 py-2 pr-2">
        <div className="flex items-baseline justify-between gap-1.5">
          <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-medium text-neutral-800">
            <ColorDot color={habit.color} />
            <span className="truncate" title={habit.name}>
              {habit.name}
              <span className="ml-1 font-normal text-neutral-400">· {targetLabel(habit.targetPerWeek)}</span>
            </span>
          </span>
          <span
            className={`shrink-0 font-mono text-[11px] ${over ? "font-semibold text-success" : "text-neutral-500"}`}
            title={over ? "Powyżej celu — świetnie!" : undefined}
          >
            {done}/{goal}
          </span>
        </div>
        <Progress value={done} max={goal} className="h-1.5" />
      </div>
      {weeks.map((week, wi) =>
        week.map((d, di) => {
          const isDone = has(habit.id, d);
          const isFuture = d > today;
          const isToday = d === today;
          const weekend = isWeekendKey(d);
          return (
            <div
              key={`${habit.id}-${d}`}
              className={`flex items-center justify-center border-t border-neutral-100 py-1 ${
                wi > 0 && di === 0 ? "border-l border-neutral-200" : ""
              } ${isToday ? "bg-violet-100" : weekend ? "bg-neutral-50" : ""}`}
            >
              <button
                type="button"
                disabled={isFuture}
                onClick={() => onToggle(habit.id, d)}
                aria-pressed={isDone}
                aria-label={`${habit.name} — ${d}${isDone ? " (odhaczone)" : ""}`}
                style={hcVar(habit.color)}
                className={`flex aspect-square w-[80%] max-w-[22px] items-center justify-center rounded-[5px] border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${
                  isDone
                    ? "border-[var(--hc)] bg-[var(--hc)] text-white"
                    : isFuture
                      ? "border-neutral-100 bg-neutral-50"
                      : "border-neutral-300 bg-neutral-100 hover:border-[var(--hc)]"
                } ${isFuture ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {isDone && <Check className="h-full w-full p-[1px]" strokeWidth={3.5} />}
              </button>
            </div>
          );
        })
      )}
    </>
  );
}

// Area chart of daily completions across the month (drawn only up to the last
// elapsed day). azure = data (Design System). preserveAspectRatio="none" fills
// the width; the line keeps a constant stroke via vector-effect, and axis
// labels are HTML so they don't distort. Live: recomputed from the check Set.
function MonthActivityChart({
  counts,
  lastIdx,
  max,
  days,
}: {
  counts: number[];
  lastIdx: number;
  max: number;
  days: string[];
}) {
  const N = days.length;
  const W = 1000;
  const H = 200;
  const padY = 18;

  if (lastIdx < 0) {
    return (
      <p className="py-8 text-center text-[13px] text-neutral-500">
        Ten miesiąc jeszcze się nie zaczął — brak danych.
      </p>
    );
  }

  const xOf = (i: number) => (N > 1 ? (i / (N - 1)) * W : W / 2);
  const yOf = (v: number) => {
    const t = max > 0 ? v / max : 0;
    return H - padY - t * (H - 2 * padY);
  };

  const pts: [number, number][] = [];
  for (let i = 0; i <= lastIdx; i++) pts.push([xOf(i), yOf(counts[i])]);

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");
  const area =
    `M ${xOf(0).toFixed(1)} ${H - padY} ` +
    pts.map((p) => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ") +
    ` L ${xOf(lastIdx).toFixed(1)} ${H - padY} Z`;

  const yTop = yOf(max);
  const yMid = yOf(max / 2);
  const yBot = yOf(0);

  const labelDays = Array.from(new Set([1, 5, 10, 15, 20, 25, N].filter((d) => d >= 1 && d <= N)));

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-[170px] w-full"
          role="img"
          aria-label="Wykres wykonanych nawyków dzień po dniu"
        >
          <defs>
            <linearGradient id="habitArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--azure-500)" stopOpacity="0.38" />
              <stop offset="100%" stopColor="var(--azure-500)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1={yTop} x2={W} y2={yTop} stroke="var(--neutral-200)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line
            x1="0"
            y1={yMid}
            x2={W}
            y2={yMid}
            stroke="var(--neutral-200)"
            strokeWidth="1"
            strokeDasharray="3 4"
            vectorEffect="non-scaling-stroke"
          />
          <line x1="0" y1={yBot} x2={W} y2={yBot} stroke="var(--neutral-200)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d={area} fill="url(#habitArea)" />
          <path
            d={line}
            fill="none"
            stroke="var(--azure-500)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="pointer-events-none absolute left-0 top-0 -translate-y-1/2 text-[10px] text-neutral-400">
          {max}
        </span>
        <span className="pointer-events-none absolute bottom-0 left-0 translate-y-1/2 text-[10px] text-neutral-400">
          0
        </span>
      </div>
      <div className="relative mt-1.5 h-4">
        {labelDays.map((d) => (
          <span
            key={d}
            style={{ left: `${N > 1 ? ((d - 1) / (N - 1)) * 100 : 50}%` }}
            className="absolute -translate-x-1/2 text-[10px] text-neutral-400"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

// Adherence ring — azure (data) per the Design System.
function Ring({ pct }: { pct: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" className="shrink-0" aria-hidden>
      <circle cx="26" cy="26" r={r} fill="none" stroke="var(--neutral-200)" strokeWidth="6" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="var(--azure-500)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 26 26)"
      />
      <text
        x="26"
        y="26"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-neutral-900 text-[13px] font-semibold"
      >
        {pct}%
      </text>
    </svg>
  );
}

// Habit colour swatches — pick a checkbox colour to tell habits apart.
function ColorPicker({
  value,
  onChange,
  habitName,
}: {
  value: HabitColorKey;
  onChange: (c: HabitColorKey) => void;
  habitName: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {HABIT_COLOR_KEYS.map((key) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            aria-label={`Kolor ${HABIT_COLORS[key].label} dla ${habitName}`}
            title={HABIT_COLORS[key].label}
            style={{ backgroundColor: HABIT_COLORS[key].value }}
            className={`h-6 w-6 rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-violet-200 ${
              active
                ? "ring-2 ring-offset-1 ring-neutral-900 ring-offset-neutral-0"
                : "opacity-70 hover:scale-110 hover:opacity-100"
            }`}
          />
        );
      })}
    </div>
  );
}

// Weekly-target picker (1..7; 7 = every day). Native select, compact.
function TargetSelect({
  value,
  onChange,
  ariaLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  ariaLabel: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={ariaLabel}
      className="shrink-0 rounded-lg border border-neutral-300 bg-neutral-0 px-2 py-2 text-[13px] text-neutral-700 outline-none transition-colors hover:border-neutral-400 focus-visible:ring-2 focus-visible:ring-violet-200"
    >
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <option key={n} value={n}>
          {n === 7 ? "codziennie" : `${n}×/tydz`}
        </option>
      ))}
    </select>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card border border-dashed border-neutral-300 bg-neutral-0 p-8 text-center shadow-card">
      <p className="text-[15px] font-semibold text-neutral-900">Zacznij od nawyków</p>
      <p className="mt-1 text-[13px] text-neutral-500">
        Dodaj swój pierwszy nawyk poniżej — pojawi się w siatce na każdy dzień miesiąca, a Ty
        będziesz go odklikiwać.
      </p>
    </div>
  );
}

// Collapsible "Zarządzaj nawykami" — add, rename, reorder, archive, delete, plus
// a restore section for archived habits. Each control calls a server action that
// revalidates /nawyki, so the grid above re-renders with the new list.
function ManagePanel({ habits, archived }: { habits: Habit[]; archived: ArchivedHabit[] }) {
  const [open, setOpen] = useState(habits.length === 0);
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState(7);
  const [newColor, setNewColor] = useState<HabitColorKey>("green");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function add() {
    const name = newName.trim();
    if (!name) return;
    startTransition(async () => {
      const result = await createHabit(name, newTarget, newColor);
      if (result.ok) {
        setNewName("");
        setNewTarget(7);
        setNewColor("green");
        setError("");
      } else {
        setError(result.error);
      }
    });
  }
  function changeTarget(id: string, targetPerWeek: number) {
    startTransition(async () => {
      await setHabitTarget({ id, targetPerWeek });
    });
  }
  function changeColor(id: string, color: HabitColorKey) {
    startTransition(async () => {
      await setHabitColor({ id, color });
    });
  }
  function rename(id: string, name: string, original: string) {
    const trimmed = name.trim();
    if (!trimmed || trimmed === original) return;
    startTransition(async () => {
      await renameHabit({ id, name: trimmed });
    });
  }
  function move(id: string, direction: "up" | "down") {
    startTransition(async () => {
      await moveHabit({ id, direction });
    });
  }
  function setArchived(id: string, value: boolean) {
    startTransition(async () => {
      await setHabitArchived({ id, archived: value });
    });
  }
  function remove(id: string, name: string) {
    if (!confirm(`Usunąć nawyk „${name}” wraz z całą historią odhaczeń?`)) return;
    startTransition(async () => {
      await deleteHabit({ id });
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200"
      >
        <SlidersHorizontal aria-hidden className="h-3.5 w-3.5" />
        Zarządzaj nawykami
      </button>

      {open && (
        <div className="rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
          <div className="flex flex-wrap gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") add();
              }}
              maxLength={100}
              placeholder="Nowy nawyk (np. Siłownia, 8 szklanek wody)"
              aria-label="Nazwa nowego nawyku"
              className="min-w-[180px] flex-1"
            />
            <TargetSelect
              value={newTarget}
              onChange={setNewTarget}
              ariaLabel="Ile razy w tygodniu"
            />
            <Button onClick={add} disabled={isPending || !newName.trim()}>
              <Plus aria-hidden className="h-4 w-4" />
              Dodaj
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[12px] text-neutral-500">Kolor:</span>
            <ColorPicker value={newColor} onChange={setNewColor} habitName="nowego nawyku" />
          </div>
          <p className="mt-2 text-[12px] text-neutral-400">
            Wybierz, ile razy w tygodniu chcesz wykonywać nawyk — dni odklikujesz dowolnie.
            Możesz wykonać go częściej niż cel: licznik pokaże np. <strong>3/2</strong> i nic Cię
            nie zablokuje.
          </p>
          {error && <p className="mt-2 text-[13px] text-danger">{error}</p>}

          {habits.length > 0 && (
            <ul className="mt-4 flex flex-col gap-1.5">
              {habits.map((h, i) => (
                <li
                  key={h.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2"
                >
                  <input
                    defaultValue={h.name}
                    maxLength={100}
                    aria-label={`Nazwa nawyku: ${h.name}`}
                    onBlur={(e) => rename(h.id, e.target.value, h.name)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    className="min-w-[140px] flex-1 rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm text-neutral-900 outline-none hover:border-neutral-200 focus:border-violet-600 focus:ring-2 focus:ring-violet-100"
                  />
                  <ColorPicker
                    value={normalizeHabitColor(h.color)}
                    onChange={(c) => changeColor(h.id, c)}
                    habitName={h.name}
                  />
                  <TargetSelect
                    value={h.targetPerWeek}
                    onChange={(n) => changeTarget(h.id, n)}
                    ariaLabel={`Cel tygodniowy: ${h.name}`}
                  />
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => move(h.id, "up")}
                      disabled={i === 0 || isPending}
                      aria-label={`Przesuń wyżej: ${h.name}`}
                      title="Wyżej"
                      className="rounded p-1 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(h.id, "down")}
                      disabled={i === habits.length - 1 || isPending}
                      aria-label={`Przesuń niżej: ${h.name}`}
                      title="Niżej"
                      className="rounded p-1 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setArchived(h.id, true)}
                      disabled={isPending}
                      aria-label={`Zarchiwizuj: ${h.name}`}
                      title="Archiwizuj (zachowuje historię)"
                      className="rounded p-1 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(h.id, h.name)}
                      disabled={isPending}
                      aria-label={`Usuń: ${h.name}`}
                      title="Usuń na stałe"
                      className="rounded p-1 text-neutral-500 outline-none transition-colors hover:bg-danger-bg hover:text-danger focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {archived.length > 0 && (
            <div className="mt-5 border-t border-neutral-100 pt-4">
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-neutral-400">
                Zarchiwizowane ({archived.length})
              </p>
              <ul className="flex flex-col gap-1.5">
                {archived.map((h) => (
                  <li
                    key={h.id}
                    className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate px-1.5 text-sm text-neutral-500" title={h.name}>
                      {h.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setArchived(h.id, false)}
                      disabled={isPending}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[13px] font-medium text-violet-700 outline-none transition-colors hover:bg-violet-100 focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Przywróć
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(h.id, h.name)}
                      disabled={isPending}
                      aria-label={`Usuń na stałe: ${h.name}`}
                      title="Usuń na stałe"
                      className="rounded p-1 text-neutral-500 outline-none transition-colors hover:bg-danger-bg hover:text-danger focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-3 text-[12px] text-neutral-400">
            Archiwizacja ukrywa nawyk, ale zachowuje historię odhaczeń. Usunięcie kasuje go na stałe.
          </p>
        </div>
      )}
    </div>
  );
}
