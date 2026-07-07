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

// ---------- Accessory slots (7 more categories → 8 total with colour) ----------
// Each slot has an ordered option list; "none" ("Brak") is always first. The
// avatar (CharacterAvatar.tsx) draws the chosen option as an SVG layer.

export type DuduOption = { id: string; label: string };

export const DUDU_SLOTS = {
  hat: {
    label: "Kapelusz",
    options: [
      { id: "none", label: "Brak" },
      { id: "beanie", label: "Czapka" },
      { id: "tophat", label: "Cylinder" },
      { id: "straw", label: "Słomkowy" },
      { id: "wizard", label: "Czarodziej" },
      { id: "party", label: "Imprezowy" },
    ],
  },
  glasses: {
    label: "Okulary",
    options: [
      { id: "none", label: "Brak" },
      { id: "round", label: "Okrągłe" },
      { id: "sun", label: "Przeciwsłoneczne" },
      { id: "nerd", label: "Kujon" },
    ],
  },
  outfit: {
    label: "Ubranie",
    options: [
      { id: "none", label: "Brak" },
      { id: "shirt", label: "Koszulka" },
      { id: "tie", label: "Krawat" },
      { id: "bowtie", label: "Muszka" },
      { id: "scarf", label: "Szalik" },
    ],
  },
  pants: {
    label: "Spodnie",
    options: [
      { id: "none", label: "Brak" },
      { id: "shorts", label: "Krótkie" },
      { id: "long", label: "Długie" },
      { id: "jeans", label: "Dżinsy" },
    ],
  },
  shoes: {
    label: "Buty",
    options: [
      { id: "none", label: "Brak" },
      { id: "sneakers", label: "Trampki" },
      { id: "boots", label: "Kozaki" },
    ],
  },
  item: {
    label: "Przedmiot",
    options: [
      { id: "none", label: "Brak" },
      { id: "book", label: "Książka" },
      { id: "dumbbell", label: "Hantel" },
      { id: "brush", label: "Pędzel" },
      { id: "balloon", label: "Balonik" },
    ],
  },
  background: {
    label: "Tło",
    options: [
      { id: "none", label: "Brak" },
      { id: "dots", label: "Kropki" },
      { id: "rays", label: "Promienie" },
      { id: "stars", label: "Gwiazdki" },
    ],
  },
} as const satisfies Record<string, { label: string; options: DuduOption[] }>;

export type DuduSlot = keyof typeof DUDU_SLOTS;
export const DUDU_SLOT_KEYS = Object.keys(DUDU_SLOTS) as DuduSlot[];

export type DuduConfig = Record<DuduSlot, string>;

export const DEFAULT_DUDU_CONFIG: DuduConfig = DUDU_SLOT_KEYS.reduce((acc, slot) => {
  acc[slot] = "none";
  return acc;
}, {} as DuduConfig);

function isValidOption(slot: DuduSlot, id: unknown): boolean {
  return typeof id === "string" && DUDU_SLOTS[slot].options.some((o) => o.id === id);
}

/** Parse stored config (JSON string or object) into a validated DuduConfig. */
export function normalizeDuduConfig(raw: unknown): DuduConfig {
  let obj: Record<string, unknown> = {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") obj = parsed as Record<string, unknown>;
    } catch {
      // fall through to defaults
    }
  } else if (raw && typeof raw === "object") {
    obj = raw as Record<string, unknown>;
  }
  const out: DuduConfig = { ...DEFAULT_DUDU_CONFIG };
  for (const slot of DUDU_SLOT_KEYS) {
    if (isValidOption(slot, obj[slot])) out[slot] = obj[slot] as string;
  }
  return out;
}

export function serializeDuduConfig(config: DuduConfig): string {
  return JSON.stringify(normalizeDuduConfig(config));
}

// ---------- Companion name ----------

export const MAX_DUDU_NAME = 24;
export const DEFAULT_DUDU_NAME = "Postać";

/** Trim + cap a chosen name; empty → null (falls back to the default label). */
export function normalizeDuduName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, MAX_DUDU_NAME);
  return trimmed.length > 0 ? trimmed : null;
}

/** Display name for the companion (custom name, or the default label). */
export function duduDisplayName(name: unknown): string {
  return normalizeDuduName(name) ?? DEFAULT_DUDU_NAME;
}
