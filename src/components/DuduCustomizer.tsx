"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { CharacterAvatar } from "@/components/CharacterAvatar";
import { setDuduColor } from "@/actions/dudu";
import { DUDU_COLORS, DUDU_COLOR_KEYS, type DuduColor } from "@/lib/dudu";

export function DuduCustomizer({
  initialColor,
  stage,
  stageName,
}: {
  initialColor: DuduColor;
  stage: number;
  stageName: string;
}) {
  const [color, setColor] = useState<DuduColor>(initialColor);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function pick(next: DuduColor) {
    if (next === color) return;
    const previous = color;
    setColor(next); // optimistic
    setError("");
    startTransition(async () => {
      const result = await setDuduColor(next);
      if (!result.ok) {
        setColor(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 rounded-card bg-neutral-100 py-8">
        <CharacterAvatar stage={stage} size={140} color={color} className="dudu-breathe" />
        <p className="text-[15px] font-semibold text-neutral-900">{stageName}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-[13px] font-medium text-neutral-600">Kolor</p>
        <div className="flex flex-wrap gap-3">
          {DUDU_COLOR_KEYS.map((key) => {
            const active = key === color;
            return (
              <button
                key={key}
                type="button"
                onClick={() => pick(key)}
                aria-pressed={active}
                aria-label={DUDU_COLORS[key].label}
                title={DUDU_COLORS[key].label}
                className={`flex h-11 w-11 items-center justify-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-violet-200 ${
                  active ? "ring-2 ring-offset-2 ring-neutral-900 ring-offset-neutral-0" : "hover:scale-105"
                }`}
                style={{ backgroundColor: DUDU_COLORS[key].accent }}
              >
                {active && <Check aria-hidden className="h-5 w-5 text-white" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
        {error && <p className="text-[13px] text-danger">{error}</p>}
        <p className="text-[12px] text-neutral-500">
          {isPending ? "Zapisywanie…" : "Zmiana zapisuje się automatycznie i widać ją w przeglądzie dnia."}
        </p>
      </div>
    </div>
  );
}
