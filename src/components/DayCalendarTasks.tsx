"use client";

import { useState, useTransition } from "react";
import { setPastDayEventCheck } from "@/actions/event-check";
import { Progress } from "@/components/ui/Progress";
import { formatTime } from "@/lib/dates";

type EventItem = {
  id: string;
  summary: string;
  start: string;
  end: string;
  allDay: boolean;
  dayKey: string;
};

// History day-detail: read that day's real Google Calendar events (like the
// Dziś screen does) so the user can see how many tasks there were and verify
// which ones got done. Checking a box updates the checkpoint and the day's
// task snapshot (tasksDone/tasksTotal) used by the History badges and chart.
export function DayCalendarTasks({
  date,
  events,
  initialCheckedIds,
}: {
  date: string;
  events: EventItem[];
  initialCheckedIds: string[];
}) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set(initialCheckedIds));
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const eventIds = events.map((e) => e.id);
  const done = events.filter((e) => checked.has(e.id)).length;

  const allDay = events.filter((e) => e.allDay);
  const timed = events.filter((e) => !e.allDay);

  function toggle(e: EventItem) {
    const next = !checked.has(e.id);
    setChecked((prev) => {
      const set = new Set(prev);
      if (next) set.add(e.id);
      else set.delete(e.id);
      return set;
    });
    startTransition(async () => {
      const result = await setPastDayEventCheck({
        date,
        eventId: e.id,
        checked: next,
        eventIds,
      });
      if (!result.ok) {
        setError(result.error);
        setChecked((prev) => {
          const set = new Set(prev);
          if (next) set.delete(e.id);
          else set.add(e.id);
          return set;
        });
      } else {
        setError("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] font-semibold text-neutral-900">
          {done}
          <span className="text-sm font-normal text-neutral-500">
            /{events.length} wykonanych
          </span>
        </p>
        <Progress value={done} max={events.length} />
      </div>

      <div className="flex flex-col gap-1">
        {allDay.map((e) => {
          const isDone = checked.has(e.id);
          return (
            <label
              key={e.id}
              className="flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5 hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => toggle(e)}
                aria-label={`Wykonane: ${e.summary}`}
                className="h-4 w-4 shrink-0 accent-[var(--violet-600)]"
              />
              <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                Cały dzień
              </span>
              <span
                className={`text-[15px] ${
                  isDone ? "text-neutral-400 line-through decoration-neutral-300" : "text-neutral-800"
                }`}
              >
                {e.summary}
              </span>
            </label>
          );
        })}
        {timed.map((e) => {
          const isDone = checked.has(e.id);
          return (
            <label
              key={e.id}
              className="flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2.5 hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => toggle(e)}
                aria-label={`Wykonane: ${e.summary}`}
                className="h-4 w-4 shrink-0 accent-[var(--violet-600)]"
              />
              <span
                className={`w-24 shrink-0 font-mono text-[13px] ${
                  isDone ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {formatTime(new Date(e.start))}–{formatTime(new Date(e.end))}
              </span>
              <span
                className={`truncate text-[15px] ${
                  isDone ? "text-neutral-400 line-through decoration-neutral-300" : "text-neutral-800"
                }`}
              >
                {e.summary}
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="text-[13px] text-danger">{error}</p>}
    </div>
  );
}
