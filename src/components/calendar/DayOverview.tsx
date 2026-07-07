"use client";

import Link from "next/link";
import { Star, Zap, Flame } from "lucide-react";
import { Card } from "@/components/Card";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { formatDayShort, dayKeyDaysAgo } from "@/lib/dates";
import { useCalendar } from "./CalendarProvider";

// "Przegląd dnia" — hero: a progress ring (share of the day's tasks done), the
// mini Dudu companion, and metric tiles (rating, energy, streak), with the
// 7-day calendar trend below. Ring/breakdown use the shared calendar context;
// ratings/streak/priorities and the character come from server props.
export function DayOverview({
  weekChecks,
  dayRating,
  energyLevel,
  streak,
  prioritiesTotal,
  prioritiesDone,
  characterStage,
  characterStageName,
  characterXp,
  characterColor,
  characterConfig,
}: {
  weekChecks: { eventId: string; dayKey: string }[];
  dayRating: number | null;
  energyLevel: number | null;
  streak: number;
  prioritiesTotal: number;
  prioritiesDone: number;
  characterStage: number;
  characterStageName: string;
  characterXp: number;
  characterColor?: string;
  characterConfig?: string | null;
}) {
  const { state, events, today, checked } = useCalendar();

  const todayEvents = events.filter((e) => e.dayKey === today);
  const calDone = todayEvents.filter((e) => checked.has(e.id)).length;

  const combinedTotal = todayEvents.length + prioritiesTotal;
  const combinedDone = calDone + prioritiesDone;
  const hasTasks = state.phase === "ok" && combinedTotal > 0;
  const dayPct = combinedTotal > 0 ? Math.round((combinedDone / combinedTotal) * 100) : null;

  // Ring geometry (r = 42 → circumference ≈ 264).
  const C = 2 * Math.PI * 42;
  const dash = dayPct === null ? 0 : (dayPct / 100) * C;

  const breakdown = hasTasks
    ? [
        todayEvents.length > 0 ? `kalendarz ${calDone}/${todayEvents.length}` : null,
        prioritiesTotal > 0 ? `priorytety ${prioritiesDone}/${prioritiesTotal}` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : state.phase === "loading"
      ? "Ładowanie wydarzeń…"
      : prioritiesTotal > 0
        ? `priorytety ${prioritiesDone}/${prioritiesTotal}`
        : state.phase === "ok"
          ? "Brak zadań na dziś"
          : "Kalendarz niepołączony";

  const trendDays = Array.from({ length: 7 }, (_, i) => dayKeyDaysAgo(6 - i));
  const trend = trendDays.map((dayKey) => {
    const dayEvents = events.filter((e) => e.dayKey === dayKey);
    const ids = new Set(dayEvents.map((e) => e.id));
    const done =
      dayKey === today
        ? calDone
        : weekChecks.filter((c) => c.dayKey === dayKey && ids.has(c.eventId)).length;
    return {
      dayKey,
      total: dayEvents.length,
      pct: dayEvents.length > 0 ? Math.round((done / dayEvents.length) * 100) : null,
    };
  });
  const hasTrend = state.phase === "ok" && trend.some((t) => t.total > 0);

  return (
    <Card title="Przegląd dnia" subtitle="Postęp dnia, oceny, seria i trend z kalendarza">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-5">
          {/* Progress ring — share of today's tasks done */}
          <div className="relative h-[108px] w-[108px] shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="9"
                className="text-neutral-200"
                stroke="currentColor"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                className="text-violet-600 transition-all duration-500"
                stroke="currentColor"
                strokeDasharray={C}
                strokeDashoffset={C - dash}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[23px] font-semibold tabular-nums text-neutral-900">
                {dayPct === null ? "—" : `${dayPct}%`}
              </span>
              <span className="text-[11px] text-neutral-500">dnia</span>
            </div>
          </div>

          {/* Mini Dudu companion → zakładka Dudu */}
          <Link
            href="/dudu"
            aria-label={`Twój towarzysz: ${characterStageName}. Zaliczone poziomy: ${characterXp}. Przejdź do zakładki Dudu.`}
            className="flex shrink-0 flex-col items-center gap-1 rounded-xl px-2 py-1 outline-none transition-colors hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            <CharacterAvatar
              stage={characterStage}
              size={52}
              color={characterColor}
              config={characterConfig}
              className="dudu-breathe"
            />
            <span className="text-[11px] font-medium text-violet-700">{characterStageName}</span>
          </Link>

          {/* Metric tiles */}
          <div className="grid min-w-[220px] flex-1 grid-cols-3 gap-3">
            <div className="rounded-xl bg-neutral-100 p-3">
              <p className="text-[12px] text-neutral-500">Ocena dnia</p>
              {dayRating !== null ? (
                <div className="mt-1.5 flex gap-0.5 text-warning">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-4 w-4 ${n <= dayRating ? "text-warning" : "text-neutral-300"}`}
                      fill={n <= dayRating ? "currentColor" : "none"}
                      strokeWidth={n <= dayRating ? 0 : 1.5}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-[22px] font-semibold text-neutral-400">—</p>
              )}
            </div>
            <div className="rounded-xl bg-neutral-100 p-3">
              <p className="text-[12px] text-neutral-500">Energia</p>
              {energyLevel !== null ? (
                <p className="mt-1 flex items-center gap-1 text-[22px] font-semibold text-azure-700">
                  <Zap aria-hidden className="h-[18px] w-[18px]" />
                  {energyLevel}
                  <span className="text-sm font-normal text-neutral-500">/5</span>
                </p>
              ) : (
                <p className="mt-1 text-[22px] font-semibold text-neutral-400">—</p>
              )}
            </div>
            <div className="rounded-xl bg-neutral-100 p-3">
              <p className="text-[12px] text-neutral-500">Seria</p>
              <p
                className={`mt-1 flex items-center gap-1 text-[22px] font-semibold ${
                  streak > 0 ? "text-warning" : "text-neutral-400"
                }`}
              >
                <Flame aria-hidden className="h-[18px] w-[18px]" />
                {streak}
                <span className="text-sm font-normal text-neutral-500">
                  {streak === 1 ? "dzień" : "dni"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-[13px] text-neutral-500">{breakdown}</p>

        {hasTrend && (
          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-4">
            <p className="text-[13px] text-neutral-500">Trend 7 dni · % zadań z kalendarza</p>
            <div className="flex items-end gap-2">
              {trend.map((t) => (
                <div key={t.dayKey} className="flex flex-1 flex-col items-center gap-1">
                  <span
                    className={`text-[11px] font-semibold tabular-nums ${
                      t.pct === null
                        ? "text-neutral-400"
                        : t.dayKey === today
                          ? "text-azure-700"
                          : "text-neutral-600"
                    }`}
                  >
                    {t.pct === null ? "—" : `${t.pct}%`}
                  </span>
                  <div
                    className="relative h-14 w-full max-w-9 overflow-hidden rounded-md bg-neutral-100"
                    title={
                      t.pct === null
                        ? `${formatDayShort(t.dayKey)}: brak wydarzeń`
                        : `${formatDayShort(t.dayKey)}: ${t.pct}% (${t.total} ${
                            t.total === 1 ? "wydarzenie" : "wydarzeń"
                          })`
                    }
                  >
                    {t.pct !== null && (
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-md bg-azure-500 transition-all"
                        style={{ height: `${Math.max(t.pct, t.pct > 0 ? 8 : 0)}%` }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] ${
                      t.dayKey === today ? "font-semibold text-neutral-900" : "text-neutral-500"
                    }`}
                  >
                    {formatDayShort(t.dayKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
