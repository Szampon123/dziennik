// Per-habit checkbox colours. Client-safe (pure data). Values are theme CSS
// vars so they adapt to light/dark/colorful. The check mark is always white,
// so every colour here is dark enough for contrast.

// `labelKey` rather than a literal label: the picker renders these in whatever
// locale the user chose, and MessageKey makes a typo a compile error.
import type { MessageKey } from "@/lib/i18n/messages";

export type HabitColor = { labelKey: MessageKey; value: string };

export const HABIT_COLORS = {
  green: { labelKey: "habitColor.green", value: "var(--success)" },
  violet: { labelKey: "habitColor.violet", value: "var(--violet-600)" },
  azure: { labelKey: "habitColor.azure", value: "var(--azure-500)" },
  amber: { labelKey: "habitColor.amber", value: "var(--warning)" },
  rose: { labelKey: "habitColor.rose", value: "var(--danger)" },
  graphite: { labelKey: "habitColor.graphite", value: "var(--neutral-900)" },
} as const satisfies Record<string, HabitColor>;

export type HabitColorKey = keyof typeof HABIT_COLORS;
export const HABIT_COLOR_KEYS = Object.keys(HABIT_COLORS) as HabitColorKey[];
export const DEFAULT_HABIT_COLOR: HabitColorKey = "green";

export function normalizeHabitColor(value: unknown): HabitColorKey {
  return typeof value === "string" && value in HABIT_COLORS
    ? (value as HabitColorKey)
    : DEFAULT_HABIT_COLOR;
}

/** The CSS colour value for a habit's stored colour key. */
export function habitColorValue(value: unknown): string {
  return HABIT_COLORS[normalizeHabitColor(value)].value;
}
