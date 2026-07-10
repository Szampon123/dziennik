// i18n configuration. Client-safe (pure data). The active locale is stored in
// a readable cookie so both server components and client components can resolve
// it without a DB round-trip.

export const LOCALES = ["pl", "en", "de", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * English is the default for anyone without a locale cookie — a new visitor,
 * and every crawler. Polish remains a first-class locale, chosen in Settings.
 *
 * This is also the fallback the translators use for a missing key, so a key
 * added to `en` but not yet to the others degrades to English, not to Polish.
 */
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  pl: "Polski",
  en: "English",
  de: "Deutsch",
  es: "Español",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  pl: "🇵🇱",
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
};

export function normalizeLocale(value: unknown): Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
    ? (value as Locale)
    : DEFAULT_LOCALE;
}
