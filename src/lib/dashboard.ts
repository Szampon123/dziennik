// Personalisation of the "Dziś" dashboard. Each section is a widget the user
// can show/hide and reorder. Default = every widget visible in this order, so
// customising is optional — a user who never touches it sees the full view.
// Client-safe (pure data); the config is stored per user as JSON on User.

export type DashboardWidget = { id: string; label: string; description: string };

export const DASHBOARD_WIDGETS: DashboardWidget[] = [
  { id: "quote", label: "Cytat na dziś", description: "Codzienna inspiracja" },
  { id: "dayOverview", label: "Przegląd dnia", description: "Postęp, oceny, seria, trend" },
  {
    id: "nowNext",
    label: "Teraz / Następne wydarzenie",
    description: "Bieżące i najbliższe wydarzenie",
  },
  { id: "calendar", label: "Kalendarz", description: "Tydzień i wydarzenia z Google Calendar" },
  { id: "morning", label: "Poranek", description: "Intencja i priorytety" },
  { id: "notes", label: "Notatki z dnia", description: "Szybkie zapiski" },
  { id: "close", label: "Zamknięcie dnia", description: "Refleksja i oceny" },
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
