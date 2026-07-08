"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import {
  LOCALES,
  LOCALE_LABELS,
  LOCALE_FLAGS,
  LOCALE_COOKIE,
  type Locale,
} from "@/lib/i18n/config";
import { useLocale } from "@/components/i18n/I18nProvider";

// Persist the locale in a readable cookie (module-scope side effect).
function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

// Language picker. Stores the choice in a readable cookie and refreshes so
// server components re-render in the new locale.
export function LocaleSwitcher() {
  const current = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function pick(locale: Locale) {
    if (locale === current) return;
    persistLocale(locale);
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-wrap gap-2" aria-busy={isPending}>
      {LOCALES.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => pick(locale)}
            aria-pressed={active}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
              active
                ? "border-violet-600 bg-violet-100 text-violet-700"
                : "border-neutral-300 bg-neutral-0 text-neutral-700 hover:border-violet-300"
            }`}
          >
            <span aria-hidden className="text-base leading-none">
              {LOCALE_FLAGS[locale]}
            </span>
            {LOCALE_LABELS[locale]}
            {active && <Check aria-hidden className="h-4 w-4" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}
