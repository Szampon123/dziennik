// Shared domain types and helpers for day entries and notes.
// SQLite stores these as plain strings; this module is the single source
// of truth for the allowed values.

export const NOTE_TYPES = ["log", "distraction", "idea"] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export const DAY_STATUSES = ["open", "closed"] as const;
export type DayStatus = (typeof DAY_STATUSES)[number];

export const SYNC_STATUSES = ["none", "pending", "synced", "error"] as const;
export type SyncStatus = (typeof SYNC_STATUSES)[number];

export const MAX_PRIORITIES = 3;

/** Parse the prioritiesJson column; tolerate malformed data. */
export function parsePriorities(json: string): string[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed.filter((p): p is string => typeof p === "string").slice(0, MAX_PRIORITIES);
    }
  } catch {
    // fall through
  }
  return [];
}

/**
 * Parse the prioritiesDoneJson column into flags aligned with the priorities
 * list (padded/truncated to `count`); tolerate malformed data.
 */
export function parsePrioritiesDone(json: string, count: number): boolean[] {
  let flags: boolean[] = [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      flags = parsed.map((f) => f === true);
    }
  } catch {
    // fall through
  }
  return Array.from({ length: count }, (_, i) => flags[i] ?? false);
}
