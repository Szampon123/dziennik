// Per-habit checkbox colours. Client-safe (pure data). Values are theme CSS
// vars so they adapt to light/dark/colorful. The check mark is always white,
// so every colour here is dark enough for contrast.

export type HabitColor = { label: string; value: string };

export const HABIT_COLORS = {
  green: { label: "Zielony", value: "var(--success)" },
  violet: { label: "Fioletowy", value: "var(--violet-600)" },
  azure: { label: "Błękitny", value: "var(--azure-500)" },
  amber: { label: "Bursztynowy", value: "var(--warning)" },
  rose: { label: "Koralowy", value: "var(--danger)" },
  graphite: { label: "Grafitowy", value: "var(--neutral-900)" },
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
