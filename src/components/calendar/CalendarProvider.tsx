"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { setEventCheck } from "@/actions/event-check";
import { todayKey } from "@/lib/dates";
import { useT } from "@/components/i18n/I18nProvider";

export type EventItem = {
  id: string;
  summary: string;
  start: string;
  end: string;
  allDay: boolean;
  dayKey: string;
};

export type FetchState =
  | { phase: "loading" }
  | { phase: "not_configured" }
  | { phase: "not_connected" }
  | { phase: "error"; message: string }
  | { phase: "ok"; events: EventItem[] };

// Window loaded around today (bounds how far the week navigator can flip).
export const PAST_DAYS = 21;
export const FUTURE_DAYS = 28;

type CalendarContextValue = {
  state: FetchState;
  events: EventItem[];
  today: string;
  now: number;
  selectedDay: string;
  setSelectedDay: (updater: string | ((prev: string) => string)) => void;
  checked: Set<string>;
  toggleCheck: (e: EventItem) => void;
  reload: (fresh?: boolean) => void;
};

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendar(): CalendarContextValue {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within a CalendarProvider");
  return ctx;
}

// Shared calendar state for the Dziś dashboard: fetches the Google events window
// once and exposes it (plus the minute tick, selected day and checkpoint set) to
// the three calendar widgets (day overview, now bar, week calendar) so they can
// be reordered independently while still sharing one fetch + one state.
export function CalendarProvider({
  initialCheckedIds,
  children,
}: {
  initialCheckedIds: string[];
  children: ReactNode;
}) {
  const today = todayKey();
  const [state, setState] = useState<FetchState>({ phase: "loading" });
  const t = useT();
  const [selectedDay, setSelectedDay] = useState(today);
  const [now, setNow] = useState(() => Date.now());
  const [checked, setChecked] = useState<Set<string>>(() => new Set(initialCheckedIds));
  const [, startTransition] = useTransition();

  const reload = useCallback(async (fresh = false) => {
    try {
      const res = await fetch(
        `/api/calendar/events?days=${FUTURE_DAYS}&past=${PAST_DAYS}${fresh ? "&fresh=1" : ""}`
      );
      const data = await res.json();
      if (data.status === "ok") {
        setState({ phase: "ok", events: data.events });
      } else if (data.status === "not_configured" || data.status === "not_connected") {
        setState({ phase: data.status });
      } else if (data.status === "unauthorized") {
        setState({ phase: "error", message: t("calendar.sessionExpired") });
      } else {
        setState({ phase: "error", message: data.error ?? t("calendar.unknownError") });
      }
    } catch {
      setState({ phase: "error", message: t("calendar.connectFailed") });
    }
  }, [t]);

  useEffect(() => {
    // Fetch-on-mount: reload() only calls setState after awaiting the network.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void reload();
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, [reload]);

  function toggleCheck(e: EventItem) {
    const next = !checked.has(e.id);
    setChecked((prev) => {
      const set = new Set(prev);
      if (next) set.add(e.id);
      else set.delete(e.id);
      return set;
    });
    startTransition(async () => {
      const result = await setEventCheck({ eventId: e.id, dayKey: e.dayKey, checked: next });
      if (!result.ok) {
        setChecked((prev) => {
          const set = new Set(prev);
          if (next) set.delete(e.id);
          else set.add(e.id);
          return set;
        });
      }
    });
  }

  const events = state.phase === "ok" ? state.events : [];

  return (
    <CalendarContext.Provider
      value={{ state, events, today, now, selectedDay, setSelectedDay, checked, toggleCheck, reload }}
    >
      {children}
    </CalendarContext.Provider>
  );
}
