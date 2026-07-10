// Personalisation of the "Dziś" dashboard. Each section is a widget the user
// can show/hide and reorder. Default = every widget visible in this order, so
// customising is optional — a user who never touches it sees the full view.
// Client-safe (pure data); the config is stored per user as JSON on User.

import type { MessageKey } from "@/lib/i18n/messages";

export type DashboardWidget = { id: string; labelKey: MessageKey; descriptionKey: MessageKey };

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  { id: "quote", labelKey: "dashboard.widget.quote.label", descriptionKey: "dashboard.widget.quote.description" },
  { id: "dayOverview", labelKey: "dashboard.widget.dayOverview.label", descriptionKey: "dashboard.widget.dayOverview.description" },
  { id: "nowNext", labelKey: "dashboard.widget.nowNext.label", descriptionKey: "dashboard.widget.nowNext.description" },
  { id: "calendar", labelKey: "dashboard.widget.calendar.label", descriptionKey: "dashboard.widget.calendar.description" },
  { id: "morning", labelKey: "dashboard.widget.morning.label", descriptionKey: "dashboard.widget.morning.description" },
  { id: "todos", labelKey: "dashboard.widget.todos.label", descriptionKey: "dashboard.widget.todos.description" },
  { id: "notes", labelKey: "dashboard.widget.notes.label", descriptionKey: "dashboard.widget.notes.description" },
  { id: "close", labelKey: "dashboard.widget.close.label", descriptionKey: "dashboard.widget.close.description" },
];

export const DASHBOARD_WIDGET_IDS = DASHBOARD_WIDGETS.map((w) => w.id);
const KNOWN = new Set(DASHBOARD_WIDGET_IDS);

// Legacy ids → the widgets that replaced them. The old single "overview" widget
// (Przegląd dnia + Teraz/Następne + Kalendarz) was split into three; expanding
// keeps a returning user's saved order/visibility sensible instead of dropping it.
const LEGACY_SPLIT: Record<string, string[]> = {
  overview: ["dayOverview", "nowNext", "calendar"],
};

function expandLegacy(ids: string[]): string[] {
  const out: string[] = [];
  for (const id of ids) {
    if (LEGACY_SPLIT[id]) out.push(...LEGACY_SPLIT[id]);
    else out.push(id);
  }
  return out;
}

/**
 * Turn the stored JSON into a usable layout. Robust to null/garbage and to
 * widgets added later: unknown ids are dropped, missing (new) widgets are
 * appended and shown by default.
 */
export function resolveDashboard(json: string | null | undefined): {
  order: string[];
  hidden: Set<string>;
} {
  let order: string[] = [];
  let hidden: string[] = [];
  if (json) {
    try {
      const parsed = JSON.parse(json) as { order?: unknown; hidden?: unknown };
      if (Array.isArray(parsed.order))
        order = expandLegacy(parsed.order.filter((id): id is string => typeof id === "string")).filter(
          (id) => KNOWN.has(id)
        );
      if (Array.isArray(parsed.hidden))
        hidden = expandLegacy(
          parsed.hidden.filter((id): id is string => typeof id === "string")
        ).filter((id) => KNOWN.has(id));
    } catch {
      // fall through to defaults
    }
  }
  for (const id of DASHBOARD_WIDGET_IDS) if (!order.includes(id)) order.push(id);
  return { order, hidden: new Set(hidden) };
}

/** Normalise an edited layout into the stored JSON string. */
export function serializeDashboard(order: string[], hidden: string[]): string {
  const clean = order.filter((id) => KNOWN.has(id));
  for (const id of DASHBOARD_WIDGET_IDS) if (!clean.includes(id)) clean.push(id);
  return JSON.stringify({ order: clean, hidden: hidden.filter((id) => KNOWN.has(id)) });
}
