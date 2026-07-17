import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUserId } from "@/lib/session";
import { getActivityWithMilestones } from "@/lib/activities";
import { getT } from "@/lib/i18n/server";
import { ActivityIcon } from "@/lib/activity-icons";
import { ActivityStats } from "@/components/ActivityStats";
import { MilestoneLadder } from "@/components/MilestoneLadder";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutList } from "@/components/WorkoutList";
import { WorkoutChart } from "@/components/WorkoutChart";
import { Card } from "@/components/Card";

export const dynamic = "force-dynamic";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const userId = await requireUserId();
  const { slug } = await params;

  const [activity, { t }] = await Promise.all([
    getActivityWithMilestones(userId, slug),
    getT(),
  ]);
  if (!activity) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/activities"
          className="group inline-flex items-center gap-1 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {t("nav.activities")}
        </Link>
        <div className="mt-2 flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 shadow-[0_2px_8px_-3px_rgba(110,86,207,0.4)]">
            <ActivityIcon slug={activity.slug} category={activity.category} className="h-6 w-6 text-violet-700" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
              {activity.name}
            </h1>
            {activity.description && (
              <p className="mt-0.5 text-[13px] text-neutral-500">{activity.description}</p>
            )}
          </div>
        </div>
      </div>

      <ActivityStats
        completedCount={activity.completedCount}
        maxLevel={activity.maxLevel}
        level={activity.level}
        levelAchievedAt={activity.levelAchievedAt}
        logKind={activity.logKind}
        milestones={activity.milestones.map((m) => ({
          level: m.level,
          title: m.title,
          done: m.done,
          completedAt: m.completedAt,
        }))}
        workouts={activity.workouts.map((w) => ({ date: w.date, distanceKm: w.distanceKm }))}
      />

      {activity.logKind === "distance" && (
        <Card
          title={t("detail.workoutLog.title")}
          subtitle={t("detail.workoutLog.subtitle")}
        >
          <div className="flex flex-col gap-4">
            <WorkoutChart workouts={activity.workouts} />
            <WorkoutForm activitySlug={activity.slug} />
            <WorkoutList workouts={activity.workouts.slice(0, 20)} />
          </div>
        </Card>
      )}

      <MilestoneLadder milestones={activity.milestones} currentLevel={activity.level} />
    </div>
  );
}
