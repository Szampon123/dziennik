"use client";

import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";

export function StepWelcome({ name, onNext }: { name: string; onNext: () => void }) {
  const t = useT();

  return (
    <div className="flex flex-col items-center text-center">
      <span
        aria-hidden
        className="h-3 w-3 rounded-full bg-gradient-to-br from-violet-600 to-azure-500"
      />
      <h1 className="mt-6 text-balance text-3xl font-bold tracking-[-0.8px] text-neutral-900 sm:text-4xl">
        {t("onboarding.welcome.title", { name })}
      </h1>
      <p className="mt-4 max-w-[440px] text-pretty text-[15px] leading-relaxed text-neutral-600">
        {t("onboarding.welcome.subtitle")}
      </p>
      <button type="button" onClick={onNext} className={buttonClass("primary", "mt-10 px-8")}>
        {t("onboarding.welcome.cta")}
      </button>
    </div>
  );
}
