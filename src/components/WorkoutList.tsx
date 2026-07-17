"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { deleteWorkout } from "@/actions/workouts";
import { formatDayShort } from "@/lib/dates";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useT, useLocale } from "@/components/i18n/I18nProvider";

export type WorkoutItem = {
  id: string;
  date: string;
  distanceKm: number;
  durationMin: number;
  isRace: boolean;
  note: string | null;
  source: string;
};

function formatPace(distanceKm: number, durationMin: number): string {
  const paceMin = durationMin / distanceKm;
  const min = Math.floor(paceMin);
  const sec = Math.round((paceMin - min) * 60);
  return `${min}:${String(sec).padStart(2, "0")}/km`;
}

export function WorkoutList({ workouts }: { workouts: WorkoutItem[] }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const t = useT();
  const locale = useLocale();
  const { confirm, dialog } = useConfirm();

  async function remove(id: string) {
    if (!(await confirm({ body: t("workout.deleteConfirm"), variant: "danger" }))) return;
    startTransition(async () => {
      const result = await deleteWorkout(id);
      setError(result.ok ? "" : result.error);
    });
  }

  if (workouts.length === 0) {
    return (
      <EmptyState title={t("workout.emptyTitle")} hint={t("workout.emptyHint")} />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {dialog}
      {error && <p className="text-[13px] text-danger">{error}</p>}
      <ul className="flex flex-col divide-y divide-neutral-200">
        {workouts.map((w) => (
          <li key={w.id} className="group flex items-center gap-3 px-1 py-2.5">
            <span className="w-14 shrink-0 font-mono text-[13px] text-neutral-500">
              {formatDayShort(w.date, locale)}
            </span>
            <span className="flex-1 text-[15px] text-neutral-800">
              <span className="font-medium">{w.distanceKm} km</span>
              <span className="text-neutral-500">
                {" "}· {w.durationMin} min · {formatPace(w.distanceKm, w.durationMin)}
              </span>
              {w.isRace && (
                <Badge variant="azure" className="ml-2">
                  {t("workout.raceBadge")}
                </Badge>
              )}
              {/* Brand name, identical in every locale — no message key. */}
              {w.source === "strava" && (
                <Badge variant="neutral" className="ml-2">
                  Strava
                </Badge>
              )}
            </span>
            <button
              type="button"
              onClick={() => remove(w.id)}
              disabled={isPending}
              aria-label={t("workout.deleteAria")}
              title={t("workout.deleteAria")}
              className="rounded p-1 text-neutral-500 opacity-0 transition-opacity hover:text-danger focus-visible:opacity-100 group-hover:opacity-100 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
