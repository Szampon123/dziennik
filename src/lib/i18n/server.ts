// Server-side i18n: resolve the active locale from the cookie and translate.
import { cookies } from "next/headers";
import { LOCALE_COOKIE, normalizeLocale, type Locale } from "./config";
import { MESSAGES, type MessageKey } from "./messages";

export function translate(locale: Locale, key: MessageKey): string {
  return MESSAGES[locale][key] ?? MESSAGES.pl[key] ?? key;
}

/** The active locale from the request cookie (defaults to pl). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}

/** Server-component translator: `const { t } = await getT();`. */
export async function getT(): Promise<{ locale: Locale; t: (key: MessageKey) => string }> {
  const locale = await getLocale();
  return { locale, t: (key: MessageKey) => translate(locale, key) };
}
