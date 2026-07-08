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

/** Client-component translator: `const t = useT(); t("nav.today")`. */
export function useT(): (key: MessageKey) => string {
  const locale = useContext(LocaleContext);
  return (key: MessageKey) => MESSAGES[locale][key] ?? MESSAGES.pl[key] ?? key;
}
