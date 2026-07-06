// Theme system. Everything is driven by CSS variables (see globals.css), so a
// theme is just a set of variable values:
//  - light / dark: toggle the `.dark` class (dark swaps the palette)
//  - system: follow prefers-color-scheme
//  - colorful: a vibrant preset via [data-theme="colorful"]
//  - custom: user-picked colours applied as inline CSS vars on <html>
// The pre-paint inline script in layout.tsx mirrors applyTheme() to avoid a
// flash of the wrong theme; keep the two in sync.

export type ThemeId = "light" | "dark" | "system" | "colorful" | "custom";

export type CustomVars = Record<string, string>;

export const THEME_OPTIONS: { id: ThemeId; label: string }[] = [
  { id: "light", label: "Jasny" },
  { id: "dark", label: "Ciemny" },
  { id: "system", label: "System" },
  { id: "colorful", label: "Kolorowy" },
  { id: "custom", label: "Custom" },
];

export type CustomToken = {
  cssVar: string;
  label: string;
  group: string;
  default: string; // light-theme value — shown initially and on reset
};

// A curated, understandable subset of the palette the user can recolour.
// (The full palette has ~40 vars; these are the ones with visible impact.)
export const CUSTOM_TOKENS: CustomToken[] = [
  { cssVar: "--neutral-50", label: "Tło strony", group: "Tło i tekst", default: "#fafafc" },
  { cssVar: "--neutral-0", label: "Tło kart", group: "Tło i tekst", default: "#ffffff" },
  { cssVar: "--neutral-200", label: "Obramowania", group: "Tło i tekst", default: "#e8e8ee" },
  { cssVar: "--neutral-900", label: "Tekst główny", group: "Tło i tekst", default: "#17171d" },
  { cssVar: "--neutral-600", label: "Tekst drugorzędny", group: "Tło i tekst", default: "#5c5c68" },
  { cssVar: "--violet-600", label: "Akcent / przyciski", group: "Akcenty", default: "#6e56cf" },
  { cssVar: "--violet-100", label: "Akcent — tło aktywne", group: "Akcenty", default: "#f1edfd" },
  { cssVar: "--azure-500", label: "Dane / wykresy", group: "Akcenty", default: "#0ea5e9" },
  { cssVar: "--success", label: "Ukończenie", group: "Akcenty", default: "#16a34a" },
];

const THEME_KEY = "theme";
const CUSTOM_KEY = "customTheme";
export const THEME_CHANGE_EVENT = "dziennik:themechange";

export function readTheme(): ThemeId {
  const t = localStorage.getItem(THEME_KEY);
  if (t === "dark" || t === "light" || t === "colorful" || t === "custom") return t;
  return "system";
}

export function readCustom(): CustomVars {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCustom(vars: CustomVars) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(vars));
}

function clearCustomInline(root: HTMLElement) {
  for (const t of CUSTOM_TOKENS) root.style.removeProperty(t.cssVar);
}

/** Apply the custom colour overrides (used live while editing and on load). */
export function applyCustomVars(vars: CustomVars) {
  const root = document.documentElement;
  clearCustomInline(root);
  for (const t of CUSTOM_TOKENS) {
    const value = vars[t.cssVar];
    if (value) root.style.setProperty(t.cssVar, value);
  }
}

export function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  root.classList.remove("dark");
  root.removeAttribute("data-theme");
  clearCustomInline(root);

  if (id === "dark") {
    root.classList.add("dark");
    localStorage.setItem(THEME_KEY, "dark");
  } else if (id === "light") {
    localStorage.setItem(THEME_KEY, "light");
  } else if (id === "colorful") {
    root.setAttribute("data-theme", "colorful");
    localStorage.setItem(THEME_KEY, "colorful");
  } else if (id === "custom") {
    root.setAttribute("data-theme", "custom");
    applyCustomVars(readCustom());
    localStorage.setItem(THEME_KEY, "custom");
  } else {
    localStorage.removeItem(THEME_KEY);
    root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
