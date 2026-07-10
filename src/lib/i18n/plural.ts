// Count-aware message selection.
//
// The message catalogue is a flat dict with {param} interpolation — no plural
// support. This adds it the small way: a pluralised string is stored as a base
// with per-category suffixes (`.one`, `.few`, `.many`, `.other`), and this
// picks the category with Intl.PluralRules for the active locale.
//
// Polish needs one/few/many; English, German and Spanish only one/other. Every
// base defines all four categories in every locale anyway (the `Dict` type
// requires it — keys are keyed off the Polish block), so the lookup never
// misses; the unused categories just repeat the `other` text.
import { MESSAGES, type MessageKey } from "./messages";
import { DEFAULT_LOCALE, type Locale } from "./config";

const INTL_TAG: Record<Locale, string> = { pl: "pl", en: "en", de: "de", es: "es" };

// One rules object per locale, reused across calls.
const RULES: Partial<Record<Locale, Intl.PluralRules>> = {};
function rulesFor(locale: Locale): Intl.PluralRules {
  return (RULES[locale] ??= new Intl.PluralRules(INTL_TAG[locale]));
}

function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

/**
 * Resolve a pluralised message. `base` is the key stem; the actual key is
 * `${base}.${category}`. `count` is available to the template as {count}, plus
 * anything in `params`.
 */
export function plural(
  locale: Locale,
  base: string,
  count: number,
  params: Record<string, string | number> = {}
): string {
  const category = rulesFor(locale).select(count);
  const dict = MESSAGES[locale];
  const key = `${base}.${category}` as MessageKey;
  const template =
    dict[key] ??
    dict[`${base}.other` as MessageKey] ??
    MESSAGES[DEFAULT_LOCALE][`${base}.other` as MessageKey] ??
    base;
  return interpolate(template, { count, ...params });
}
