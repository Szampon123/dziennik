// Display helpers for seed content that lives in the database.
//
// Polish is the source language. `name` / `title` / `detail` are human-written
// and always present; the *En/*De/*Es columns hold machine translations that
// may be NULL (never backfilled, or added after the row was written).
//
// The fallback chain is deliberately asymmetric:
//
//   pl → the Polish column. Always populated, so it never falls back.
//   en → English, else Polish.
//   de → German, else English, else Polish.
//   es → Spanish, else English, else Polish.
//
// German and Spanish route through English rather than straight to Polish: a
// reader who picked `de` is far likelier to read English than Polish, and the
// English column is the one most likely to be filled. Polish is the last
// resort, guaranteed non-null by the schema.
import type { Locale } from "./config";

/** A row carrying the Polish source plus optional per-locale translations. */
type Translatable = {
  en?: string | null;
  de?: string | null;
  es?: string | null;
};

/**
 * Pick the best available string for `locale`.
 *
 * `pl` is the canonical value and must be non-null for a required column
 * (Activity.name, Milestone.title). For a nullable source (Milestone.detail)
 * pass `null` and expect `null` back when nothing is available.
 */
export function getLocalizedField<T extends string | null>(
  pl: T,
  translations: Translatable,
  locale: Locale
): T {
  if (locale === "pl") return pl;

  const en = translations.en || null;
  if (locale === "en") return (en ?? pl) as T;

  const own = locale === "de" ? translations.de : translations.es;
  return ((own || null) ?? en ?? pl) as T;
}

/** Activity display name. `name` is NOT NULL, so this always returns a string. */
export function getActivityName(
  activity: { name: string; nameEn?: string | null; nameDe?: string | null; nameEs?: string | null },
  locale: Locale
): string {
  return getLocalizedField(
    activity.name,
    { en: activity.nameEn, de: activity.nameDe, es: activity.nameEs },
    locale
  );
}

/** Milestone display title. `title` is NOT NULL, so this always returns a string. */
export function getMilestoneTitle(
  milestone: {
    title: string;
    titleEn?: string | null;
    titleDe?: string | null;
    titleEs?: string | null;
  },
  locale: Locale
): string {
  return getLocalizedField(
    milestone.title,
    { en: milestone.titleEn, de: milestone.titleDe, es: milestone.titleEs },
    locale
  );
}

/** Milestone detail. Nullable at the source, so the result is nullable too. */
export function getMilestoneDetail(
  milestone: {
    detail: string | null;
    detailEn?: string | null;
    detailDe?: string | null;
    detailEs?: string | null;
  },
  locale: Locale
): string | null {
  return getLocalizedField(
    milestone.detail,
    { en: milestone.detailEn, de: milestone.detailDe, es: milestone.detailEs },
    locale
  );
}
