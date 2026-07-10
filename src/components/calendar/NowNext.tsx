"use client";

import { formatTime, formatDayShort } from "@/lib/dates";
import { useCalendar, type EventItem } from "./CalendarProvider";
import { useT, useLocale } from "@/components/i18n/I18nProvider";

// "Teraz / Następne wydarzenie" — the current timed event (if any) and the next
// upcoming one, today-centric. Renders nothing when there's neither (same as
// before the split), so a disconnected calendar simply shows no bar.
export function NowNext() {
  const { state, events, today, now } = useCalendar();
  const t = useT();
  const locale = useLocale();
  if (state.phase !== "ok") return null;

  const todayEvents = events.filter((e) => e.dayKey === today);
  const upcoming = events.filter((e) => e.dayKey > today);
  const timedToday = todayEvents.filter((e) => !e.allDay);
  const isCurrent = (e: EventItem) =>
    new Date(e.start).getTime() <= now && now <= new Date(e.end).getTime();
  const currentEvent = timedToday.find(isCurrent) ?? null;
  const nextEvent =
    timedToday.find((e) => new Date(e.start).getTime() > now) ??
    upcoming.find((e) => !e.allDay) ??
    null;

  if (!currentEvent && !nextEvent) return null;

  return (
    <section className="flex items-center gap-4 rounded-card border border-violet-200 bg-neutral-0 p-5 shadow-card">
      {currentEvent ? (
        <>
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-violet-600" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-violet-700">
              {t("nownext.now", { time: formatTime(new Date(currentEvent.end), locale) })}
            </p>
            <p className="truncate text-[15px] font-semibold text-neutral-900">
              {currentEvent.summary}
            </p>
          </div>
        </>
      ) : (
        <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-neutral-300" />
      )}
      {nextEvent && (
        <div className={`min-w-0 ${currentEvent ? "text-right" : "flex-1"}`}>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {t("nownext.next", {
              when:
                nextEvent.dayKey === today
                  ? formatTime(new Date(nextEvent.start), locale)
                  : formatDayShort(nextEvent.dayKey, locale),
            })}
          </p>
          <p className="truncate text-sm text-neutral-600">{nextEvent.summary}</p>
        </div>
      )}
    </section>
  );
}
