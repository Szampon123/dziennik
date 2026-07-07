"use client";

import { useState, useTransition } from "react";
import { addWorkout } from "@/actions/workouts";
import { todayKey } from "@/lib/dates";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { inputClass } from "@/components/ui/Input";

export function WorkoutForm({ activitySlug }: { activitySlug: string }) {
  const [date, setDate] = useState(todayKey());
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [isRace, setIsRace] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    const distanceKm = Number(distance.replace(",", "."));
    const durationMin = Number(duration.replace(",", "."));
    startTransition(async () => {
      const result = await addWorkout({ activitySlug, date, distanceKm, durationMin, isRace });
      if (result.ok) {
        setDistance("");
        setDuration("");
        setIsRace(false);
        setMessage({
          tone: "ok",
          text:
            result.newLevels.length > 0
              ? `Trening zapisany — automatycznie zaliczone poziomy: ${result.newLevels.join(", ")} 🎉`
              : "Trening zapisany — bez nowych poziomów (automat zalicza tylko udowodnione).",
        });
      } else {
        setMessage({ tone: "error", text: result.error });
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-neutral-800">Data</span>
          <input
            type="date"
            value={date}
            max={todayKey()}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClass} w-auto`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-neutral-800">Dystans (km)</span>
          <input
            inputMode="decimal"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="np. 5"
            className={`${inputClass} w-28`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-neutral-800">Czas (min)</span>
          <input
            inputMode="decimal"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="np. 32"
            className={`${inputClass} w-28`}
          />
        </label>
        <div className="flex min-h-10 items-center gap-2 py-2">
          <Checkbox
            checked={isRace}
            onChange={() => setIsRace(!isRace)}
            size="sm"
            aria-label="Zawody / bieg oficjalny"
          />
          <button
            type="button"
            onClick={() => setIsRace(!isRace)}
            className="text-sm text-neutral-600"
          >
            Zawody / bieg oficjalny
          </button>
        </div>
        <Button onClick={submit} disabled={isPending || !distance.trim() || !duration.trim()}>
          {isPending ? "Analizuję…" : "Zapisz trening"}
        </Button>
      </div>
      {message && (
        <p className={`text-[13px] ${message.tone === "ok" ? "text-success" : "text-danger"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
