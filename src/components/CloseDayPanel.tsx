"use client";

import { useState, useTransition } from "react";
import { closeDay, reopenDay } from "@/actions/day-entry";
import { RatingScale } from "@/components/RatingScale";
import { SyncStatusBadge } from "@/components/SyncStatusBadge";
import { RetrySyncButton } from "@/components/RetrySyncButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";

export function CloseDayPanel({
  date,
  initialGood,
  initialBad,
  initialRating,
  initialEnergy,
  closed,
  syncStatus,
  syncError,
  showRetry,
}: {
  date: string;
  initialGood: string;
  initialBad: string;
  initialRating: number | null;
  initialEnergy: number | null;
  closed: boolean;
  syncStatus: string;
  syncError: string | null;
  showRetry: boolean;
}) {
  const [good, setGood] = useState(initialGood);
  const [bad, setBad] = useState(initialBad);
  const [rating, setRating] = useState<number | null>(initialRating);
  const [energy, setEnergy] = useState<number | null>(initialEnergy);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitClose() {
    if (rating === null || energy === null) {
      setError("Wybierz ocenę dnia i poziom energii (1–5), aby zamknąć dzień.");
      return;
    }
    startTransition(async () => {
      const result = await closeDay({
        date,
        reflectionGood: good,
        reflectionBad: bad,
        dayRating: rating,
        energyLevel: energy,
      });
      setError(result.ok ? "" : result.error);
    });
  }

  function submitReopen() {
    startTransition(async () => {
      const result = await reopenDay(date);
      setError(result.ok ? "" : result.error);
    });
  }

  if (closed) {
    return (
      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-neutral-900">Dzień zamknięty ✓</p>
            <SyncStatusBadge status={syncStatus} />
          </div>
          {syncError && <p className="mt-1 text-[13px] text-danger">{syncError}</p>}
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="violet" title="Ocena dnia">
              ★ {initialRating}/5
            </Badge>
            <Badge variant="azure" title="Poziom energii">
              ⚡ {initialEnergy}/5
            </Badge>
          </div>
          {initialGood && (
            <p className="mt-2 text-neutral-600">
              <span className="text-neutral-900">Co poszło dobrze:</span> {initialGood}
            </p>
          )}
          {initialBad && (
            <p className="mt-1 text-neutral-600">
              <span className="text-neutral-900">Do poprawy:</span> {initialBad}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={submitReopen} disabled={isPending}>
            {isPending ? "Otwieranie…" : "Otwórz dzień ponownie"}
          </Button>
          {showRetry && <RetrySyncButton date={date} />}
        </div>
        {error && <p className="text-[13px] text-danger">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-neutral-800">Co poszło dobrze?</span>
        <Textarea
          value={good}
          onChange={(e) => setGood(e.target.value)}
          rows={2}
          placeholder="Sukcesy, momenty flow, dobre decyzje…"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-neutral-800">Co poprawić?</span>
        <Textarea
          value={bad}
          onChange={(e) => setBad(e.target.value)}
          rows={2}
          placeholder="Rozproszenia, zgrzyty, wnioski na jutro…"
        />
      </label>

      <div className="flex flex-col gap-2 py-1">
        <RatingScale label="Ocena dnia" value={rating} onChange={setRating} disabled={isPending} />
        <RatingScale label="Poziom energii" value={energy} onChange={setEnergy} disabled={isPending} />
      </div>

      <Button onClick={submitClose} disabled={isPending} className="self-start">
        {isPending ? "Zamykanie…" : "Zamknij dzień"}
      </Button>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </div>
  );
}
