"use client";

import { useState, useTransition } from "react";
import {
  saveOnboardingActivities,
  saveOnboardingHabit,
  saveOnboardingDudu,
  completeOnboarding,
} from "@/actions/onboarding";
import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";
import { OnboardingProgress } from "./OnboardingProgress";
import { StepWelcome } from "./StepWelcome";
import { StepActivities, type OnboardingActivity } from "./StepActivities";
import { StepHabit, type HabitDraft } from "./StepHabit";
import { StepDudu, type DuduDraft } from "./StepDudu";
import { StepDone, type OnboardingSummary } from "./StepDone";

const TOTAL_STEPS = 5;

export type OnboardingInitialState = {
  displayName: string;
  activities: OnboardingActivity[];
  selectedSlugs: string[];
  habit: HabitDraft | null;
  dudu: DuduDraft;
  /** A habit already exists (from a previous, abandoned run of the wizard). */
  existingHabitName: string | null;
};

/**
 * Step state lives in useState, not the URL — the browser Back button should
 * leave the wizard, not walk backwards through it.
 *
 * Every step persists as you leave it, so closing the tab at step 3 keeps the
 * activities picked at step 2. `onboardingComplete` stays false until the very
 * end, so a returning user re-enters here and the server repopulates the drafts.
 */
export function OnboardingWizard({ initial }: { initial: OnboardingInitialState }) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const [selected, setSelected] = useState<Set<string>>(new Set(initial.selectedSlugs));
  const [habit, setHabit] = useState<HabitDraft>(
    initial.habit ?? { name: "Morning meditation", targetPerWeek: 5, color: "violet" }
  );
  const [dudu, setDudu] = useState<DuduDraft>(initial.dudu);

  // What actually got *saved*, for the summary on the last step. Tracked apart
  // from the drafts: picking three activities and then hitting "Skip" persists
  // nothing, and the summary must not claim otherwise. Seeded from what a
  // previous, abandoned run already wrote.
  const [savedActivities, setSavedActivities] = useState(initial.selectedSlugs.length);
  const [habitName, setHabitName] = useState<string | null>(initial.existingHabitName);
  const [duduName, setDuduName] = useState<string | null>(
    initial.dudu.name.trim() ? initial.dudu.name.trim() : null
  );

  const toggle = (slug: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });

  /** Run a save, advance on success, surface the error otherwise. */
  function advance(save?: () => Promise<{ ok: boolean; error?: string }>) {
    setError("");
    if (!save) {
      setStep((s) => s + 1);
      return;
    }
    startTransition(async () => {
      const res = await save();
      if (res.ok) setStep((s) => s + 1);
      else setError(res.error ?? t("onboarding.saveFailed"));
    });
  }

  function finish() {
    setError("");
    startTransition(async () => {
      const res = await completeOnboarding();
      if (!res.ok) {
        setError(res.error ?? t("onboarding.saveFailed"));
        return;
      }
      // Hard navigation: the root layout gates on onboardingComplete, and a
      // client-side push would race the RSC cache and bounce straight back here.
      window.location.href = "/dzis";
    });
  }

  const summary: OnboardingSummary = {
    activityCount: savedActivities,
    habitName,
    duduName,
  };

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col px-6 py-10 sm:py-14">
      {/* Equal 1fr side columns keep the dots optically centred. A fixed-width
          spacer does not: "Skip setup" is wider than it, and pushes the dots
          left — visible at 375px. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-4">
        <div />
        {step < TOTAL_STEPS - 1 ? (
          <OnboardingProgress current={step} total={TOTAL_STEPS} />
        ) : (
          <div className="h-[46px]" />
        )}
        <div className="flex justify-end">
          {step < TOTAL_STEPS - 1 && (
            <button
              type="button"
              onClick={finish}
              disabled={pending}
              className="text-[13px] text-neutral-500 transition-colors hover:text-neutral-800 disabled:opacity-50"
            >
              {t("onboarding.skipAll")}
            </button>
          )}
        </div>
      </div>

      {/* `key` restarts the entrance animation on every step change. */}
      <div key={step} className="onboarding-step mt-10 flex-1">
        {step === 0 && <StepWelcome name={initial.displayName} onNext={() => advance()} />}

        {step === 1 && (
          <StepActivities activities={initial.activities} selected={selected} onToggle={toggle} />
        )}

        {step === 2 && <StepHabit draft={habit} onChange={setHabit} />}

        {step === 3 && <StepDudu draft={dudu} onChange={setDudu} />}

        {step === 4 && <StepDone summary={summary} onFinish={finish} pending={pending} />}
      </div>

      {error && <p className="mt-6 text-center text-[13px] text-danger">{error}</p>}

      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex w-full items-center gap-3">
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              disabled={pending}
              className={buttonClass("secondary", "flex-1")}
            >
              {t("onboarding.back")}
            </button>
            <button
              type="button"
              disabled={pending || (step === 2 && !habit.name.trim())}
              onClick={() => {
                if (step === 1)
                  advance(async () => {
                    const res = await saveOnboardingActivities([...selected]);
                    if (res.ok) setSavedActivities(selected.size);
                    return res;
                  });
                else if (step === 2)
                  advance(async () => {
                    const res = await saveOnboardingHabit(habit);
                    if (res.ok) setHabitName(habit.name.trim());
                    return res;
                  });
                else
                  advance(async () => {
                    const trimmed = dudu.name.trim();
                    const res = await saveOnboardingDudu({
                      name: trimmed,
                      color: dudu.color,
                      config: { hat: dudu.hat, item: dudu.item },
                    });
                    if (res.ok) setDuduName(trimmed || null);
                    return res;
                  });
              }}
              className={buttonClass("primary", "flex-[2]")}
            >
              {pending ? t("common.saving") : t("onboarding.continue")}
            </button>
          </div>

          {/* Skipping a step advances without persisting it. Anything saved on a
              previous visit stays; the summary only credits what this run wrote. */}
          <button
            type="button"
            onClick={() => advance()}
            disabled={pending}
            className="text-[13px] text-neutral-500 transition-colors hover:text-neutral-800 disabled:opacity-50"
          >
            {step === 1
              ? t("onboarding.activities.skip")
              : step === 2
                ? t("onboarding.habit.skip")
                : t("onboarding.dudu.skip")}
          </button>
        </div>
      )}
    </div>
  );
}
