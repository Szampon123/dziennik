"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { MESSAGES, type MessageKey } from "@/lib/i18n/messages";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

// Provides the active locale to client components. The layout resolves the
// locale server-side (from the cookie) and passes it here so useT() works
// without any extra network round-trip.
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export type TFunc = (key: MessageKey, params?: Record<string, string | number>) => string;

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m));
}

/** Client-component translator: `const t = useT(); t("nav.today")`. */
export function useT(): TFunc {
  const locale = useContext(LocaleContext);
  return (key, params) =>
    interpolate(MESSAGES[locale][key] ?? MESSAGES[DEFAULT_LOCALE][key] ?? key, params);
}
