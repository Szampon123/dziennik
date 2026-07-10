"use client";

import { Check } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import {
  DUDU_COLORS,
  DUDU_COLOR_KEYS,
  DUDU_SLOTS,
  DEFAULT_DUDU_CONFIG,
  DEFAULT_DUDU_NAME_KEY,
  MAX_DUDU_NAME,
  type DuduColor,
} from "@/lib/dudu";
import { useT } from "@/components/i18n/I18nProvider";
import { inputClass } from "@/components/ui/Input";

export type DuduDraft = { name: string; color: DuduColor; hat: string; item: string };

/**
 * A brand-new user is at stage 0, and CharacterAvatar draws stage 0 as an
 * unhatched egg with no face and no accessories at all. Previewing at that
 * stage would leave every control in this step doing nothing visible, so the
 * preview renders the companion as it will look once it hatches.
 */
const PREVIEW_STAGE = 3;

export function StepDudu({
  draft,
  onChange,
}: {
  draft: DuduDraft;
  onChange: (next: DuduDraft) => void;
}) {
  const t = useT();

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-[-0.5px] text-neutral-900 sm:text-3xl">
          {t("onboarding.dudu.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-relaxed text-neutral-600">
          {t("onboarding.dudu.subtitle")}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <CharacterAvatar
          stage={PREVIEW_STAGE}
          size={130}
          color={draft.color}
          // The wizard exposes two of the seven slots; the rest stay at "none".
          config={{ ...DEFAULT_DUDU_CONFIG, hat: draft.hat, item: draft.item }}
        />
        <p className="mt-3 text-sm font-semibold text-violet-700">
          {draft.name.trim() || t(DEFAULT_DUDU_NAME_KEY)}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-neutral-700">
            {t("onboarding.dudu.name")}
          </span>
          <input
            type="text"
            value={draft.name}
            maxLength={MAX_DUDU_NAME}
            placeholder={t(DEFAULT_DUDU_NAME_KEY)}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            className={inputClass}
          />
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium text-neutral-700">
            {t("onboarding.dudu.color")}
          </span>
          <div className="flex items-center gap-2.5">
            {DUDU_COLOR_KEYS.map((key) => {
              const active = key === draft.color;
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={t(DUDU_COLORS[key].labelKey)}
                  aria-pressed={active}
                  onClick={() => onChange({ ...draft, color: key })}
                  style={{ backgroundColor: DUDU_COLORS[key].accent }}
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

        <SlotRow
          label={t("onboarding.dudu.hat")}
          slot="hat"
          value={draft.hat}
          onPick={(id) => onChange({ ...draft, hat: id })}
        />
        <SlotRow
          label={t("onboarding.dudu.item")}
          slot="item"
          value={draft.item}
          onPick={(id) => onChange({ ...draft, item: id })}
        />
      </div>
    </div>
  );
}

function SlotRow({
  label,
  slot,
  value,
  onPick,
}: {
  label: string;
  slot: "hat" | "item";
  value: string;
  onPick: (id: string) => void;
}) {
  const t = useT();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-neutral-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {DUDU_SLOTS[slot].options.map((option) => {
          const active = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onPick(option.id)}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                active
                  ? "border-violet-600 bg-violet-600 font-medium text-white"
                  : "border-neutral-300 bg-neutral-0 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {t(option.labelKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
