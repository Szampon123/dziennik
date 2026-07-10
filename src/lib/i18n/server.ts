// Server-side i18n: resolve the active locale from the cookie and translate.
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, normalizeLocale, type Locale } from "./config";
import { MESSAGES, type MessageKey } from "./messages";

export type TFunc = (key: MessageKey, params?: Record<string, string | number>) => string;

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>
): string {
  return interpolate(MESSAGES[locale][key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key, params);
}

/** The active locale from the request cookie (defaults to DEFAULT_LOCALE). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}

/** Server-component translator: `const { t } = await getT();`. */
export async function getT(): Promise<{ locale: Locale; t: TFunc }> {
  const locale = await getLocale();
  return { locale, t: (key, params) => translate(locale, key, params) };
}
