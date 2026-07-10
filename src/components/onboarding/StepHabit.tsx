"use client";

import { Check } from "lucide-react";
import { HABIT_COLORS, HABIT_COLOR_KEYS, type HabitColorKey } from "@/lib/habit-colors";
import { useT, useLocale } from "@/components/i18n/I18nProvider";
import { formatWeekdayShort } from "@/lib/dates";
import { inputClass } from "@/components/ui/Input";

export type HabitDraft = { name: string; targetPerWeek: number; color: HabitColorKey };

// An arbitrary Mon–Sun week (2024-01-01 was a Monday) used purely to source
// weekday names from Intl. The preview isn't tied to real dates, but the
// labels still have to be in the reader's language.
const PREVIEW_WEEK = [
  "2024-01-01",
  "2024-01-02",
  "2024-01-03",
  "2024-01-04",
  "2024-01-05",
  "2024-01-06",
  "2024-01-07",
];

export function StepHabit({
  draft,
  onChange,
}: {
  draft: HabitDraft;
  onChange: (next: HabitDraft) => void;
}) {
  const t = useT();
  const locale = useLocale();
  const swatch = HABIT_COLORS[draft.color].value;

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-[-0.5px] text-neutral-900 sm:text-3xl">
          {t("onboarding.habit.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-relaxed text-neutral-600">
          {t("onboarding.habit.subtitle")}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-neutral-700">
            {t("onboarding.habit.name")}
          </span>
          <input
            type="text"
            value={draft.name}
            maxLength={100}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            className={inputClass}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-neutral-700">
            {t("onboarding.habit.target")}
          </span>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={draft.targetPerWeek}
              onChange={(e) => onChange({ ...draft, targetPerWeek: Number(e.target.value) })}
              aria-label={t("onboarding.habit.target")}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 accent-violet-600"
            />
            <span className="w-16 shrink-0 text-right text-sm font-semibold text-neutral-900">
              {t("habits.timesPerWeek", { n: draft.targetPerWeek })}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-neutral-700">
            {t("onboarding.habit.color")}
          </span>
          <div className="flex items-center gap-2.5">
            {HABIT_COLOR_KEYS.map((key) => {
              const active = key === draft.color;
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={t(HABIT_COLORS[key].labelKey)}
                  aria-pressed={active}
                  onClick={() => onChange({ ...draft, color: key })}
                  style={{ backgroundColor: HABIT_COLORS[key].value }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                    active ? "scale-110 ring-2 ring-neutral-900 ring-offset-2" : "hover:scale-105"
                  }`}
                >
                  {active && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview of the tracker row this habit will produce. The first
            `targetPerWeek` days are filled — the real grid lets you tick any
            days you like, this only conveys "how many". */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[12px] font-medium text-neutral-500">
            {t("onboarding.habit.preview")}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {PREVIEW_WEEK.map((dayKey, i) => {
              const filled = i < draft.targetPerWeek;
              return (
                <div key={dayKey} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400">
                    {formatWeekdayShort(dayKey, locale)}
                  </span>
                  <span
                    aria-hidden
                    style={filled ? { backgroundColor: swatch } : undefined}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      filled ? "" : "border border-neutral-200 bg-neutral-0"
                    }`}
                  >
                    {filled && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
