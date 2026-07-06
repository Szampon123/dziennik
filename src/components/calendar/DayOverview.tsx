"use client";

import { Flame } from "lucide-react";
import { Card } from "@/components/Card";
import { Progress } from "@/components/ui/Progress";
import { formatDayShort, dayKeyDaysAgo } from "@/lib/dates";
import { useCalendar } from "./CalendarProvider";

// "Przegląd dnia": task progress (calendar checkpoints + priorities), day
// ratings, closed-day streak and a 7-day trend. Server props carry the ratings/
// streak/priorities; live event data comes from the shared calendar context.
export function DayOverview({
  weekChecks,
  dayRating,
  energyLevel,
  streak,
  prioritiesTotal,
  prioritiesDone,
}: {
  weekChecks: { eventId: string; dayKey: string }[];
  dayRating: number | null;
  energyLevel: number | null;
  streak: number;
  prioritiesTotal: number;
  prioritiesDone: number;
}) {
  const { state, events, today, checked } = useCalendar();

  const todayEvents = events.filter((e) => e.dayKey === today);
  const calDone = todayEvents.filter((e) => checked.has(e.id)).length;

  const combinedTotal = todayEvents.length + prioritiesTotal;
  const combinedDone = calDone + prioritiesDone;
  const hasTasks = state.phase === "ok" && combinedTotal > 0;

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
    <Card title="Przegląd dnia" subtitle="Checkpointy z kalendarza i priorytetów, oceny, seria">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] text-neutral-500">Zadania dnia</p>
            {hasTasks ? (
              <>
                <p className="text-2xl font-semibold text-neutral-900">
                  {combinedDone}
                  <span className="text-sm font-normal text-neutral-500">/{combinedTotal}</span>
                </p>
                <Progress value={combinedDone} max={combinedTotal} />
                <p className="text-[13px] text-neutral-500">
                  {todayEvents.length > 0 && `kalendarz ${calDone}/${todayEvents.length}`}
                  {todayEvents.length > 0 && prioritiesTotal > 0 && " · "}
                  {prioritiesTotal > 0 && `priorytety ${prioritiesDone}/${prioritiesTotal}`}
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold text-neutral-400">—</p>
                <p className="text-[13px] text-neutral-500">
                  {state.phase === "loading"
                    ? "Ładowanie wydarzeń…"
                    : state.phase === "ok"
                      ? "Brak zadań dziś"
                      : prioritiesTotal > 0
                        ? `priorytety ${prioritiesDone}/${prioritiesTotal}`
                        : "Kalendarz niepołączony"}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] text-neutral-500">Ocena dnia</p>
            {dayRating !== null ? (
              <p className="text-2xl font-semibold text-violet-700">
                ★ {dayRating}
                <span className="text-sm font-normal text-neutral-500">/5</span>
              </p>
            ) : (
              <>
                <p className="text-2xl font-semibold text-neutral-400">—</p>
                <p className="text-[13px] text-neutral-500">przy zamknięciu dnia</p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] text-neutral-500">Poziom energii</p>
            {energyLevel !== null ? (
              <p className="text-2xl font-semibold text-azure-700">
                ⚡ {energyLevel}
                <span className="text-sm font-normal text-neutral-500">/5</span>
              </p>
            ) : (
              <>
                <p className="text-2xl font-semibold text-neutral-400">—</p>
                <p className="text-[13px] text-neutral-500">przy zamknięciu dnia</p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] text-neutral-500">Seria dni</p>
            <p
              className={`flex items-center gap-1.5 text-2xl font-semibold ${
                streak > 0 ? "text-warning" : "text-neutral-400"
              }`}
            >
              <Flame aria-hidden className="h-5 w-5" />
              {streak}
            </p>
            <p className="text-[13px] text-neutral-500">
              {streak === 1 ? "zamknięty dzień z rzędu" : "zamkniętych dni z rzędu"}
            </p>
          </div>
        </div>

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
                    className="relative h-14 w-full max-w-9 overflow-hidden rounded bg-neutral-100"
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
                        className="absolute bottom-0 left-0 right-0 rounded bg-azure-500 transition-all"
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
