import type { MessageKey } from "@/lib/i18n/messages";

// Dudu companion appearance. For now the customisation is a colour palette
// (body fill + accent for cape/headband). Colours reference theme CSS vars so
// they adapt to light/dark/colorful. Client-safe (pure data).
//
// Labels are message keys, not literals: the customiser renders them in the
// user's locale, and MessageKey turns a typo into a compile error.

export type DuduPalette = { labelKey: MessageKey; body: string; accent: string };

export const DUDU_COLORS = {
  violet: { labelKey: "dudu.color.violet", body: "var(--violet-100)", accent: "var(--violet-600)" },
  azure: { labelKey: "dudu.color.azure", body: "var(--azure-100)", accent: "var(--azure-500)" },
  green: { labelKey: "dudu.color.green", body: "var(--success-bg)", accent: "var(--success)" },
  amber: { labelKey: "dudu.color.amber", body: "var(--warning-bg)", accent: "var(--warning)" },
  coral: { labelKey: "dudu.color.coral", body: "var(--danger-bg)", accent: "var(--danger)" },
} as const satisfies Record<string, DuduPalette>;

export type DuduColor = keyof typeof DUDU_COLORS;

export const DUDU_COLOR_KEYS = Object.keys(DUDU_COLORS) as DuduColor[];

export function normalizeDuduColor(value: unknown): DuduColor {
  return typeof value === "string" && value in DUDU_COLORS ? (value as DuduColor) : "violet";
}

// ---------- Accessory slots (7 more categories → 8 total with colour) ----------
// Each slot has an ordered option list; "none" is always first. The
// avatar (CharacterAvatar.tsx) draws the chosen option as an SVG layer.

export type DuduOption = { id: string; labelKey: MessageKey };

export const DUDU_SLOTS = {
  hat: {
    labelKey: "dudu.slot.hat",
    options: [
      { id: "none", labelKey: "dudu.opt.none" },
      { id: "beanie", labelKey: "dudu.opt.beanie" },
      { id: "tophat", labelKey: "dudu.opt.tophat" },
      { id: "straw", labelKey: "dudu.opt.straw" },
      { id: "wizard", labelKey: "dudu.opt.wizard" },
      { id: "party", labelKey: "dudu.opt.party" },
    ],
  },
  glasses: {
    labelKey: "dudu.slot.glasses",
    options: [
      { id: "none", labelKey: "dudu.opt.none" },
      { id: "round", labelKey: "dudu.opt.round" },
      { id: "sun", labelKey: "dudu.opt.sun" },
      { id: "nerd", labelKey: "dudu.opt.nerd" },
    ],
  },
  outfit: {
    labelKey: "dudu.slot.outfit",
    options: [
      { id: "none", labelKey: "dudu.opt.none" },
      { id: "shirt", labelKey: "dudu.opt.shirt" },
      { id: "tie", labelKey: "dudu.opt.tie" },
      { id: "bowtie", labelKey: "dudu.opt.bowtie" },
      { id: "scarf", labelKey: "dudu.opt.scarf" },
    ],
  },
  pants: {
    labelKey: "dudu.slot.pants",
    options: [
      { id: "none", labelKey: "dudu.opt.none" },
      { id: "shorts", labelKey: "dudu.opt.shorts" },
      { id: "long", labelKey: "dudu.opt.long" },
      { id: "jeans", labelKey: "dudu.opt.jeans" },
    ],
  },
  shoes: {
    labelKey: "dudu.slot.shoes",
    options: [
      { id: "none", labelKey: "dudu.opt.none" },
      { id: "sneakers", labelKey: "dudu.opt.sneakers" },
      { id: "boots", labelKey: "dudu.opt.boots" },
    ],
  },
  item: {
    labelKey: "dudu.slot.item",
    options: [
      { id: "none", labelKey: "dudu.opt.none" },
      { id: "book", labelKey: "dudu.opt.book" },
      { id: "dumbbell", labelKey: "dudu.opt.dumbbell" },
      { id: "brush", labelKey: "dudu.opt.brush" },
      { id: "balloon", labelKey: "dudu.opt.balloon" },
    ],
  },
  background: {
    labelKey: "dudu.slot.background",
    options: [
      { id: "none", labelKey: "dudu.opt.none" },
      { id: "dots", labelKey: "dudu.opt.dots" },
      { id: "rays", labelKey: "dudu.opt.rays" },
      { id: "stars", labelKey: "dudu.opt.stars" },
    ],
  },
} as const satisfies Record<string, { labelKey: MessageKey; options: DuduOption[] }>;

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
/** Rendered when the user hasn't named their companion. A key, not a
 *  literal — the placeholder follows the reader's locale. */
export const DEFAULT_DUDU_NAME_KEY: MessageKey = "dudu.defaultName";

/** Trim + cap a chosen name; empty → null (renders DEFAULT_DUDU_NAME_KEY). */
export function normalizeDuduName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, MAX_DUDU_NAME);
  return trimmed.length > 0 ? trimmed : null;
}
