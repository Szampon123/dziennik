import { startOfWeek, addDays, todayKey, dayKeyToDate } from "@/lib/dates";
import { getT } from "@/lib/i18n/server";

type WorkoutLite = { date: string; distanceKm: number; durationMin: number };

function formatPace(distanceKm: number, durationMin: number): string {
  const paceMin = durationMin / distanceKm;
  const min = Math.floor(paceMin);
  const sec = Math.round((paceMin - min) * 60);
  return `${min}:${String(sec).padStart(2, "0")}/km`;
}

const WEEKS = 12;

// Training summary for distance activities: lifetime stats (total km, longest,
// best pace, count) + a 12-week volume bar chart. Server component — computed
// from the loaded workout history. Rendered only when there are workouts.
export async function WorkoutChart({ workouts }: { workouts: WorkoutLite[] }) {
  if (workouts.length === 0) return null;
  const { t } = await getT();

  const totalKm = workouts.reduce((s, w) => s + w.distanceKm, 0);
  const longest = workouts.reduce((m, w) => Math.max(m, w.distanceKm), 0);
  const withDist = workouts.filter((w) => w.distanceKm > 0);
  const bestPace = withDist.length
    ? withDist.reduce(
        (best, w) => Math.min(best, w.durationMin / w.distanceKm),
        Number.POSITIVE_INFINITY
      )
    : null;

  // 12-week volume (oldest → newest).
  const thisWeek = startOfWeek(todayKey());
  const weeks = Array.from({ length: WEEKS }, (_, i) => addDays(thisWeek, -7 * (WEEKS - 1 - i)));
  const kmByWeek = new Map<string, number>();
  for (const w of workouts) {
    const wk = startOfWeek(w.date);
    kmByWeek.set(wk, (kmByWeek.get(wk) ?? 0) + w.distanceKm);
  }
  const data = weeks.map((wk) => ({ wk, km: Math.round((kmByWeek.get(wk) ?? 0) * 10) / 10 }));
  const maxKm = Math.max(1, ...data.map((d) => d.km));

  const round1 = (n: number) => Math.round(n * 10) / 10;

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4">
      <div className="flex flex-wrap gap-2">
        <Stat label={t("workout.total")} value={`${round1(totalKm)} km`} />
        <Stat label={t("workout.count")} value={String(workouts.length)} />
        <Stat label={t("workout.longest")} value={`${round1(longest)} km`} />
        {bestPace !== null && <Stat label={t("workout.bestPace")} value={formatPace(1, bestPace)} />}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-[12px] font-medium text-neutral-500">
          {t("workout.volume", { weeks: WEEKS })}
        </p>
        <div className="flex h-24 items-end gap-1">
          {data.map((d, i) => {
            const isThisWeek = d.wk === thisWeek;
            const h = d.km > 0 ? Math.max(6, (d.km / maxKm) * 100) : 0;
            return (
              <div
                key={d.wk}
                className="flex flex-1 flex-col items-center justify-end gap-1"
                title={`${dayKeyToDate(d.wk).getDate()}.${dayKeyToDate(d.wk).getMonth() + 1} — ${d.km} km`}
              >
                <span className="text-[9px] tabular-nums text-neutral-400">{d.km || ""}</span>
                <div className="flex w-full max-w-6 flex-1 items-end">
                  <div
                    className={`w-full rounded-t ${isThisWeek ? "bg-azure-700" : "bg-azure-500"}`}
                    style={{ height: `${h}%` }}
                  />
                </div>
                {i % 2 === 0 && (
                  <span className="text-[9px] tabular-nums text-neutral-400">
                    {dayKeyToDate(d.wk).getDate()}.{dayKeyToDate(d.wk).getMonth() + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-[12px]">
      <span className="text-neutral-500">{label}:</span>
      <span className="font-semibold text-neutral-900">{value}</span>
    </span>
  );
}
