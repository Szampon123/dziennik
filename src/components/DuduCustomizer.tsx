"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { DuduNameEditor } from "@/components/DuduNameEditor";
import { setDuduAppearance } from "@/actions/dudu";
import { useT } from "@/components/i18n/I18nProvider";
import {
  DUDU_COLORS,
  DUDU_COLOR_KEYS,
  DUDU_SLOTS,
  DUDU_SLOT_KEYS,
  type DuduColor,
  type DuduConfig,
} from "@/lib/dudu";

export function DuduCustomizer({
  initialColor,
  initialConfig,
  initialName,
  stage,
  stageName,
}: {
  initialColor: DuduColor;
  initialConfig: DuduConfig;
  initialName: string | null;
  stage: number;
  stageName: string;
}) {
  const t = useT();
  const [color, setColor] = useState<DuduColor>(initialColor);
  const [config, setConfig] = useState<DuduConfig>(initialConfig);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Show a hatched body in the preview even for low-XP users, so accessories
  // are always visible while customising.
  const previewStage = Math.max(stage, 2);

  function save(nextColor: DuduColor, nextConfig: DuduConfig, rollback: () => void) {
    setError("");
    startTransition(async () => {
      const result = await setDuduAppearance({ color: nextColor, config: nextConfig });
      if (!result.ok) {
        rollback();
        setError(result.error);
      }
    });
  }

  function pickColor(next: DuduColor) {
    if (next === color) return;
    const prev = color;
    setColor(next);
    save(next, config, () => setColor(prev));
  }

  function pickSlot(slot: keyof DuduConfig, id: string) {
    if (config[slot] === id) return;
    const prev = config;
    const next = { ...config, [slot]: id };
    setConfig(next);
    save(color, next, () => setConfig(prev));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 rounded-card bg-neutral-100 py-8">
        <CharacterAvatar
          stage={previewStage}
          size={150}
          color={color}
          config={config}
          className="dudu-breathe"
        />
        <DuduNameEditor initialName={initialName} />
        <p className="text-[12px] text-neutral-500">Forma: {stageName}</p>
      </div>

      {/* Colour */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[13px] font-medium text-neutral-700">Kolor</p>
        <div className="flex flex-wrap gap-3">
          {DUDU_COLOR_KEYS.map((key) => {
            const active = key === color;
            return (
              <button
                key={key}
                type="button"
                onClick={() => pickColor(key)}
                aria-pressed={active}
                aria-label={t(DUDU_COLORS[key].labelKey)}
                title={t(DUDU_COLORS[key].labelKey)}
                className={`flex h-10 w-10 items-center justify-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-violet-200 ${
                  active ? "ring-2 ring-offset-2 ring-neutral-900 ring-offset-neutral-0" : "hover:scale-105"
                }`}
                style={{ backgroundColor: DUDU_COLORS[key].accent }}
              >
                {active && <Check aria-hidden className="h-5 w-5 text-white" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessory slots */}
      {DUDU_SLOT_KEYS.map((slot) => (
        <div key={slot} className="flex flex-col gap-2.5">
          <p className="text-[13px] font-medium text-neutral-700">{t(DUDU_SLOTS[slot].labelKey)}</p>
          <div className="flex flex-wrap gap-2">
            {DUDU_SLOTS[slot].options.map((opt) => {
              const active = config[slot] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => pickSlot(slot, opt.id)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                    active
                      ? "border-violet-600 bg-violet-600 text-white shadow-[0_1px_4px_-1px_rgba(110,86,207,0.5)]"
                      : "border-neutral-300 bg-neutral-0 text-neutral-700 hover:border-violet-300 hover:text-violet-700"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {error && <p className="text-[13px] text-danger">{error}</p>}
      <p className="text-[12px] text-neutral-500">
        {isPending ? t("common.saving") : t("dudu.autosaveHint")}
      </p>
    </div>
  );
}
