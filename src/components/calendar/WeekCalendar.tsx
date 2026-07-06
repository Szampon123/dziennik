"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
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

// "Kalendarz": a week navigator (flip through the loaded window) + the selected
// day's Google events. Today is interactive (checkpoints); other days are a
// read-only preview. Also owns the not-connected / error empty states.
export function WeekCalendar() {
  const { state, events, today, now, selectedDay, setSelectedDay, checked, toggleCheck, reload } =
    useCalendar();

  if (state.phase !== "ok") {
    return (
      <Card title="Kalendarz" subtitle="Google Calendar">
        {state.phase === "loading" && (
          <p className="py-4 text-sm text-neutral-500">Ładowanie wydarzeń…</p>
        )}
        {(state.phase === "not_configured" || state.phase === "not_connected") && (
          <EmptyState
            title={
              state.phase === "not_configured"
                ? "Integracja Google nieskonfigurowana"
                : "Kalendarz niepołączony"
            }
            hint={
              state.phase === "not_configured"
                ? "Uzupełnij klucze w .env.local — instrukcja w README."
                : "Połącz Google Calendar, aby zobaczyć tu dzisiejsze wydarzenia."
            }
            action={
              <Link href="/settings" className="text-[13px] font-medium text-azure-700 hover:underline">
                Przejdź do Ustawień →
              </Link>
            }
          />
        )}
        {state.phase === "error" && (
          <EmptyState
            title="Błąd pobierania wydarzeń"
            hint={state.message}
            action={
              <button
                type="button"
                onClick={() => reload(true)}
                className="text-[13px] font-medium text-azure-700 hover:underline"
              >
                Spróbuj ponownie
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
      title="Kalendarz"
      subtitle="Google Calendar — wybierz dzień, aby zobaczyć jego wydarzenia"
      action={
        selectedDay !== today ? (
          <button
            type="button"
            onClick={() => setSelectedDay(today)}
            className="shrink-0 text-[13px] font-medium text-azure-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            Dziś →
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
              aria-label="Poprzedni tydzień"
              className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[13px] font-medium capitalize text-neutral-700">
              {formatMonthYear(selectedDay)}
            </span>
            <button
              type="button"
              onClick={() => setSelectedDay((d) => clampDay(addDays(d, 7)))}
              disabled={!canNext}
              aria-label="Następny tydzień"
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
                  aria-label={formatDayLong(day)}
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
                    {formatWeekdayShort(day)}
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
            {formatDayLong(selectedDay)}
            {interactive && <span className="ml-1.5 font-normal text-neutral-400">· dziś</span>}
          </p>

          {selectedEvents.length === 0 ? (
            <EmptyState
              title="Brak wydarzeń"
              hint={
                interactive
                  ? "Czysty kalendarz — dzień należy do Ciebie."
                  : "Ten dzień jest wolny w Twoim kalendarzu."
              }
            />
          ) : (
            <div className="flex flex-col gap-1">
              {selectedAllDay.map((e) => {
                const done = interactive && checked.has(e.id);
                return (
                  <div key={e.id} className="flex items-center gap-4 rounded-lg px-3 py-2.5">
                    {interactive && (
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleCheck(e)}
                        aria-label={`Wykonane: ${e.summary}`}
                        title="Oznacz jako wykonane"
                        className="h-4 w-4 shrink-0 accent-[var(--violet-600)]"
                      />
                    )}
                    <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                      Cały dzień
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
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggleCheck(e)}
                        aria-label={`Wykonane: ${e.summary}`}
                        title="Oznacz jako wykonane"
                        className="h-4 w-4 shrink-0 accent-[var(--violet-600)]"
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
                      {formatTime(new Date(e.start))}–{formatTime(new Date(e.end))}
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
