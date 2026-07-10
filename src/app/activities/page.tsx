import type { Metadata } from "next";
import { requireUserId } from "@/lib/session";
import { listActivitiesWithProgress } from "@/lib/activities";
import { getT } from "@/lib/i18n/server";
import { EmptyState } from "@/components/EmptyState";
import { ActivitiesOverview } from "@/components/ActivitiesOverview";
import { ActivitiesBrowser } from "@/components/ActivitiesBrowser";

export const dynamic = "force-dynamic";

// Behind the auth proxy: a signed-out crawler is redirected away, so this page
// must never be indexed. noindex takes the place of a canonical — a canonical
// would only assert that this URL duplicates another one.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("page.activities.title"),
    robots: { index: false, follow: false },
  };
}

export default async function ActivitiesPage() {
  const userId = await requireUserId();
  const [activities, { t }] = await Promise.all([
    listActivitiesWithProgress(userId),
    getT(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
          {t("page.activities.title")}
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">{t("page.activities.subtitle")}</p>
      </div>

      {activities.length === 0 ? (
        <EmptyState title={t("act.emptyTitle")} hint={t("act.emptyHint")} />
      ) : (
        <>
          <ActivitiesOverview activities={activities} />
          <ActivitiesBrowser activities={activities} />
        </>
      )}
    </div>
  );
}
