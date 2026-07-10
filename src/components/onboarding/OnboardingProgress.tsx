"use client";

import { useT } from "@/components/i18n/I18nProvider";

/** Dots: filled for done, larger and violet for current, outlined ahead. */
export function OnboardingProgress({ current, total }: { current: number; total: number }) {
  const t = useT();

  return (
    <div className="flex flex-col items-center gap-3">
      <ol className="flex items-center gap-2.5">
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === current;
          const isDone = i < current;
          return (
            <li
              key={i}
              aria-current={isCurrent ? "step" : undefined}
              className={`rounded-full transition-all duration-300 ${
                isCurrent
                  ? "h-2.5 w-6 bg-violet-600"
                  : isDone
                    ? "h-2.5 w-2.5 bg-violet-600"
                    : "h-2.5 w-2.5 border border-neutral-300 bg-neutral-0"
              }`}
            />
          );
        })}
      </ol>
      <p className="text-[13px] text-neutral-500">
        {t("onboarding.step", { current: current + 1, total })}
      </p>
    </div>
  );
}
