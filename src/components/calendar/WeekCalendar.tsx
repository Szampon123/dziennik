"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Checkbox } from "@/components/ui/Checkbox";
import { buttonClass } from "@/components/ui/Button";
import {
  formatTime,
  formatDayLong,
  formatWeekdayShort,
  formatMonthYear,
  dayKeyDaysAgo,
  dayKeyToDate,
  addDays,
  startOfWeek,
} from "@/lib/dates";
import { useCalendar, PAST_DAYS, FUTURE_DAYS, type EventItem } from "./CalendarProvider";
import { useT, useLocale } from "@/components/i18n/I18nProvider";

// "Kalendarz": a week navigator (flip through the loaded window) + the selected
// day's Google events. Today is interactive (checkpoints); other days are a
// read-only preview. Also owns the not-connected / error empty states.
export function WeekCalendar() {
  const { state, events, today, now, selectedDay, setSelectedDay, checked, toggleCheck, reload } =
    useCalendar();
  const t = useT();
  const locale = useLocale();

  if (state.phase !== "ok") {
    return (
      <Card title={t("cal.title")} subtitle="Google Calendar">
        {state.phase === "loading" && (
          <p className="py-4 text-sm text-neutral-500">{t("overview.loadingEvents")}</p>
        )}
        {(state.phase === "not_configured" || state.phase === "not_connected") && (
          <EmptyState
            title={
              state.phase === "not_configured" ? t("cal.notConfigured") : t("cal.notConnected")
            }
            hint={
              state.phase === "not_configured"
                ? t("cal.notConfiguredHint")
                : t("cal.notConnectedHint")
            }
            action={
              state.phase === "not_connected" ? (
                // Plain <a>, not <Link>: /api/auth/google is a route handler that
                // mints a CSRF state cookie and 307s to Google. A <Link> would
                // prefetch it on hover and start the flow behind the user's back.
                <div className="flex flex-col items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a href="/api/auth/google" className={buttonClass("primary", "text-sm")}>
                    {t("cal.connectGoogle")}
                  </a>
                  <Link
                    href="/settings"
                    className="text-[13px] font-medium text-azure-700 hover:underline"
                  >
                    {t("cal.goSettings")}
                  </Link>
                </div>
              ) : (
                <Link
                  href="/settings"
                  className="text-[13px] font-medium text-azure-700 hover:underline"
                >
                  {t("cal.goSettings")}
                </Link>
              )
            }
          />
        )}
        {state.phase === "error" && (
          <EmptyState
            title={t("cal.error")}
            hint={state.message}
            action={
              <button
                type="button"
                onClick={() => reload(true)}
                className="text-[13px] font-medium text-azure-700 hover:underline"
              >
                {t("cal.tryAgain")}
              </button>
            }
          />
        )}
      </Card>
    );
  }

  const isPast = (e: EventItem) => new Date(e.end).getTime() < now;
  const isCurrent = (e: EventItem) =>
    new Date(e.start).getTime() <= now && now <= new Date(e.end).getTime();

  const windowStart = dayKeyDaysAgo(PAST_DAYS);
  const windowEnd = addDays(today, FUTURE_DAYS);
  const weekStart = startOfWeek(selectedDay);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const canPrev = addDays(weekStart, -1) >= windowStart;
  const canNext = addDays(weekStart, 7) <= windowEnd;
  const clampDay = (d: string) => (d < windowStart ? windowStart : d > windowEnd ? windowEnd : d);

  const selectedEvents = events.filter((e) => e.dayKey === selectedDay);
  const selectedAllDay = selectedEvents.filter((e) => e.allDay);
  const selectedTimed = selectedEvents.filter((e) => !e.allDay);
  const interactive = selectedDay === today;

  return (
    <Card
      title={t("cal.title")}
      subtitle={t("cal.subtitle")}
      action={
        selectedDay !== today ? (
          <button
            type="button"
            onClick={() => setSelectedDay(today)}
            className="shrink-0 text-[13px] font-medium text-azure-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            {t("cal.today")}
          </button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        {/* Week navigator */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedDay((d) => clampDay(addDays(d, -7)))}
              disabled={!canPrev}
              aria-label={t("cal.prevWeek")}
              className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[13px] font-medium capitalize text-neutral-700">
              {formatMonthYear(selectedDay, locale)}
            </span>
            <button
              type="button"
              onClick={() => setSelectedDay((d) => clampDay(addDays(d, 7)))}
              disabled={!canNext}
              aria-label={t("cal.nextWeek")}
              className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => {
              const isToday = day === today;
              const isSelected = day === selectedDay;
              const outside = day < windowStart || day > windowEnd;
              const hasEv = events.some((e) => e.dayKey === day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={outside}
                  onClick={() => setSelectedDay(day)}
                  aria-label={formatDayLong(day, locale)}
                  aria-pressed={isSelected}
                  className={`flex flex-col items-center gap-0.5 rounded-lg py-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30 ${
                    isSelected
                      ? "bg-violet-600 text-neutral-0"
                      : isToday
                        ? "text-neutral-900 ring-1 ring-inset ring-violet-300 hover:bg-neutral-100"
                        : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase ${
                      isSelected ? "text-violet-100" : "text-neutral-400"
                    }`}
                  >
                    {formatWeekdayShort(day, locale)}
                  </span>
                  <span className="text-[15px] font-semibold tabular-nums">
                    {dayKeyToDate(day).getDate()}
                  </span>
                  <span
                    aria-hidden
                    className={`h-1 w-1 rounded-full ${
                      hasEv ? (isSelected ? "bg-neutral-0" : "bg-azure-500") : "bg-transparent"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day's events */}
        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-4">
          <p className="text-[13px] font-medium capitalize text-neutral-700">
            {formatDayLong(selectedDay, locale)}
            {interactive && (
              <span className="ml-1.5 font-normal text-neutral-400">· {t("cal.todaySuffix")}</span>
            )}
          </p>

          {selectedEvents.length === 0 ? (
            <EmptyState
              title={t("cal.noEvents")}
              hint={interactive ? t("cal.noEventsTodayHint") : t("cal.noEventsHint")}
            />
          ) : (
            <div className="flex flex-col gap-1">
              {selectedAllDay.map((e) => {
                const done = interactive && checked.has(e.id);
                return (
                  <div key={e.id} className="flex items-center gap-4 rounded-lg px-3 py-2.5">
                    {interactive && (
                      <Checkbox
                        checked={done}
                        onChange={() => toggleCheck(e)}
                        size="sm"
                        aria-label={t("cal.doneAria", { summary: e.summary })}
                        title={t("cal.markDone")}
                      />
                    )}
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                      {t("cal.allDay")}
                    </span>
                    <span
                      className={`text-[15px] ${
                        done ? "text-neutral-400 line-through decoration-neutral-300" : "text-neutral-800"
                      }`}
                    >
                      {e.summary}
                    </span>
                  </div>
                );
              })}
              {selectedTimed.map((e) => {
                const past = interactive && isPast(e);
                const current = interactive && isCurrent(e);
                const done = interactive && checked.has(e.id);
                return (
                  <div
                    key={e.id}
                    className={`flex items-center gap-4 rounded-lg px-3 py-2.5 ${
                      current && !done ? "bg-violet-100" : ""
                    }`}
                  >
                    {interactive && (
                      <Checkbox
                        checked={done}
                        onChange={() => toggleCheck(e)}
                        size="sm"
                        aria-label={t("cal.doneAria", { summary: e.summary })}
                        title={t("cal.markDone")}
                      />
                    )}
                    <span
                      className={`w-24 shrink-0 font-mono text-[13px] ${
                        done
                          ? "text-neutral-400"
                          : current
                            ? "font-medium text-violet-700"
                            : past
                              ? "text-neutral-400"
                              : "text-neutral-500"
                      }`}
                    >
                      {formatTime(new Date(e.start), locale)}–{formatTime(new Date(e.end), locale)}
                    </span>
                    {current && !done && (
                      <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-violet-600" />
                    )}
                    <span
                      className={`truncate text-[15px] ${
                        done
                          ? "text-neutral-400 line-through decoration-neutral-300"
                          : current
                            ? "font-medium text-neutral-900"
                            : past
                              ? "text-neutral-500"
                              : "text-neutral-800"
                      }`}
                    >
                      {e.summary}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
