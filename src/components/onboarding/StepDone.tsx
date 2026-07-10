"use client";

import { Check } from "lucide-react";
import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";

export type OnboardingSummary = {
  activityCount: number;
  habitName: string | null;
  duduName: string | null;
};

// Fixed offsets, not Math.random(): a server-rendered random would mismatch on
// hydration, and the pattern reads as deliberate rather than noisy.
const CONFETTI = [
  { left: "8%", delay: "0s", color: "var(--violet-600)" },
  { left: "20%", delay: "0.18s", color: "var(--azure-500)" },
  { left: "33%", delay: "0.05s", color: "var(--success)" },
  { left: "46%", delay: "0.28s", color: "var(--warning)" },
  { left: "59%", delay: "0.12s", color: "var(--violet-400)" },
  { left: "72%", delay: "0.34s", color: "var(--azure-300)" },
  { left: "85%", delay: "0.08s", color: "var(--violet-600)" },
  { left: "94%", delay: "0.24s", color: "var(--success)" },
];

export function StepDone({
  summary,
  onFinish,
  pending,
}: {
  summary: OnboardingSummary;
  onFinish: () => void;
  pending: boolean;
}) {
  const t = useT();

  const lines = [
    summary.activityCount > 0 &&
      t("onboarding.done.activitiesSelected", { count: summary.activityCount }),
    summary.habitName && t("onboarding.done.habitCreated", { name: summary.habitName }),
    summary.duduName && t("onboarding.done.duduNamed", { name: summary.duduName }),
  ].filter((line): line is string => Boolean(line));

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Confetti. Pure CSS — the animation carries its own reduced-motion
          opt-out in globals.css, where it simply does not fall. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-6 h-40 overflow-hidden">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="onboarding-confetti"
            style={{ left: c.left, animationDelay: c.delay, backgroundColor: c.color }}
          />
        ))}
      </div>

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white">
        <Check className="h-7 w-7" strokeWidth={3} />
      </span>

      <h1 className="mt-6 text-2xl font-bold tracking-[-0.5px] text-neutral-900 sm:text-3xl">
        {t("onboarding.done.title")}
      </h1>
      <p className="mt-3 text-[15px] text-neutral-600">{t("onboarding.done.subtitle")}</p>

      <div className="mt-7 w-full rounded-2xl border border-neutral-200 bg-neutral-0 p-5 text-left shadow-card">
        {lines.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {lines.map((line) => (
              <li key={line} className="flex items-center gap-3 text-sm text-neutral-800">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {line}
              </li>
            ))}
          </ul>
        ) : (
          // Every step was skipped. Say so plainly rather than showing an
          // empty card that looks broken.
          <p className="text-sm text-neutral-600">{t("onboarding.done.nothing")}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onFinish}
        disabled={pending}
        className={buttonClass("primary", "mt-8 px-8")}
      >
        {pending ? t("common.saving") : t("onboarding.done.cta")}
      </button>
    </div>
  );
}
