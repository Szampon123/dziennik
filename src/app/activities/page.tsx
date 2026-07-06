import { requireUserId } from "@/lib/session";
import { listActivitiesWithProgress } from "@/lib/activities";
import { EmptyState } from "@/components/EmptyState";
import { ActivitiesOverview } from "@/components/ActivitiesOverview";
import { ActivitiesBrowser } from "@/components/ActivitiesBrowser";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const userId = await requireUserId();
  const activities = await listActivitiesWithProgress(userId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
          Aktywności
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Realne, mierzalne poziomy od 1 do 99 — odhaczaj kolejne kamienie milowe.
        </p>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          title="Brak aktywności"
          hint="Uruchom `npx prisma db seed`, aby załadować bazę aktywności."
        />
      ) : (
        <>
          <ActivitiesOverview activities={activities} />
          <ActivitiesBrowser activities={activities} />
        </>
      )}
    </div>
  );
}
