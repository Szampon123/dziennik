// Dudu companion appearance. For now the customisation is a colour palette
// (body fill + accent for cape/headband). Colours reference theme CSS vars so
// they adapt to light/dark/colorful. Client-safe (pure data).

export type DuduPalette = { label: string; body: string; accent: string };

export const DUDU_COLORS = {
  violet: { label: "Fioletowy", body: "var(--violet-100)", accent: "var(--violet-600)" },
  azure: { label: "Błękitny", body: "var(--azure-100)", accent: "var(--azure-500)" },
  green: { label: "Zielony", body: "var(--success-bg)", accent: "var(--success)" },
  amber: { label: "Bursztynowy", body: "var(--warning-bg)", accent: "var(--warning)" },
  coral: { label: "Koralowy", body: "var(--danger-bg)", accent: "var(--danger)" },
} as const satisfies Record<string, DuduPalette>;

export type DuduColor = keyof typeof DUDU_COLORS;

export const DUDU_COLOR_KEYS = Object.keys(DUDU_COLORS) as DuduColor[];

export function normalizeDuduColor(value: unknown): DuduColor {
  return typeof value === "string" && value in DUDU_COLORS ? (value as DuduColor) : "violet";
}
