// Per-day to-do checklist stored as JSON on DayEntry.todosJson.
// Separate from morning priorities (capped at 3) — this is an unlimited,
// lightweight list of small tasks (e.g. "zakupy", "pranie") with an optional
// time. Client-safe: parsing/validation lives here, used by the action and UI.

export const MAX_TODOS = 30;
export const MAX_TODO_TITLE = 120;

export type Todo = {
  id: string;
  title: string;
  time: string | null; // "HH:MM" (24h) or null
  done: boolean;
};

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** True for a valid "HH:MM" 24-hour time string. */
export function isValidTime(t: string): boolean {
  return TIME_RE.test(t);
}

/** Parse the todosJson column; tolerant of null/garbage. */
export function parseTodos(json: string | null | undefined): Todo[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((t): t is Record<string, unknown> => Boolean(t) && typeof t === "object")
      .map((t) => ({
        id: typeof t.id === "string" ? t.id : "",
        title: typeof t.title === "string" ? t.title.slice(0, MAX_TODO_TITLE) : "",
        time: typeof t.time === "string" && isValidTime(t.time) ? t.time : null,
        done: t.done === true,
      }))
      .filter((t) => t.id !== "" && t.title !== "")
      .slice(0, MAX_TODOS);
  } catch {
    return [];
  }
}

/** Serialise for storage. */
export function serializeTodos(todos: Todo[]): string {
  return JSON.stringify(todos);
}

/**
 * Order for display: timed items first (chronologically), untimed after.
 * Stable within each group (keeps insertion order for ties).
 */
export function sortTodosForDisplay(todos: Todo[]): Todo[] {
  return todos
    .map((t, i) => ({ t, i }))
    .sort((a, b) => {
      if (a.t.time && b.t.time) return a.t.time.localeCompare(b.t.time) || a.i - b.i;
      if (a.t.time) return -1;
      if (b.t.time) return 1;
      return a.i - b.i;
    })
    .map(({ t }) => t);
}
