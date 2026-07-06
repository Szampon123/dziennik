import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ActivityListItem } from "@/lib/activities";
import { Progress } from "@/components/ui/Progress";

// Aggregate snapshot across all activities, shown atop the list: total levels
// earned, momentum this week, how many started, and the most recently active
// one. Server component (pure display, computed from the same list).
export function ActivitiesOverview({ activities }: { activities: ActivityListItem[] }) {
  const totalLevels = activities.reduce((s, a) => s + a.completedCount, 0);
  const totalPossible = activities.reduce((s, a) => s + a.maxLevel, 0);
  const levelsThisWeek = activities.reduce((s, a) => s + a.completedThisWeek, 0);
  const startedCount = activities.filter((a) => a.started).length;
  const completedCount = activities.filter((a) => a.completed).length;

  const mostActive = activities.reduce<ActivityListItem | null>((best, a) => {
    if (a.lastActiveAt === null) return best;
    if (!best || best.lastActiveAt === null || a.lastActiveAt > best.lastActiveAt) return a;
    return best;
  }, null);

  return (
    <div className="rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-card">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] text-neutral-500">Zaliczone poziomy</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {totalLevels}
            <span className="text-sm font-normal text-neutral-500">/{totalPossible}</span>
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] text-neutral-500">W tym tygodniu</p>
          <p className={`text-2xl font-semibold ${levelsThisWeek > 0 ? "text-success" : "text-neutral-400"}`}>
            {levelsThisWeek > 0 ? `+${levelsThisWeek}` : "0"}
          </p>
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] text-neutral-500">Rozpoczęte</p>
          <p className="text-2xl font-semibold text-neutral-900">
            {startedCount}
            <span className="text-sm font-normal text-neutral-500">/{activities.length}</span>
          </p>
          {completedCount > 0 && (
            <p className="text-[12px] text-neutral-500">{completedCount} ukończonych 🏆</p>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-[13px] text-neutral-500">Ostatnio aktywna</p>
          {mostActive ? (
            <Link
              href={`/activities/${mostActive.slug}`}
              className="group inline-flex items-center gap-1 text-[17px] font-semibold text-neutral-900 hover:text-violet-700"
            >
              <span className="truncate">{mostActive.name}</span>
              <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-violet-700" />
            </Link>
          ) : (
            <p className="text-2xl font-semibold text-neutral-400">—</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Progress value={totalLevels} max={totalPossible} className="flex-1" />
        <span className="shrink-0 text-[12px] font-medium tabular-nums text-neutral-500">
          {totalPossible > 0 ? Math.round((totalLevels / totalPossible) * 100) : 0}%
        </span>
      </div>
    </div>
  );
}
