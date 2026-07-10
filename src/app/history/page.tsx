import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ListChecks } from "lucide-react";
import { listDays, lastThirtyDays } from "@/lib/queries";
import { formatDayLong } from "@/lib/dates";
import { Card } from "@/components/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/EmptyState";
import { HistoryChart } from "@/components/HistoryChart";
import { SyncStatusBadge } from "@/components/SyncStatusBadge";
import { requireUserId } from "@/lib/session";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

// Behind the auth proxy: a signed-out crawler is redirected away, so this page
// must never be indexed. noindex takes the place of a canonical — a canonical
// would only assert that this URL duplicates another one.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("page.history.title"),
    robots: { index: false, follow: false },
  };
}

export default async function HistoryPage() {
  const userId = await requireUserId();
  const [days, chartDays, { t, locale }] = await Promise.all([
    listDays(userId),
    lastThirtyDays(userId),
    getT(),
  ]);
  const ratedDays = chartDays.filter(
    (d) => d.dayRating !== null || d.energyLevel !== null
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
        {t("page.history.title")}
      </h1>

      <Card title={t("history.last30Days")} subtitle={t("history.ratingEnergy")}>
        {ratedDays >= 1 ? (
          <HistoryChart data={chartDays} />
        ) : (
          <p className="py-10 text-center text-[13px] text-neutral-500">
            {t("history.closeDayForTrend")}
          </p>
        )}
      </Card>

      <Card title={t("history.allDays")} subtitle={t("history.clickDay")}>
        {days.length === 0 ? (
          <EmptyState
            title={t("history.noDays")}
            hint={t("history.firstDayHint")}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {days.map((day) => (
              <li key={day.id}>
                <Link
                  href={`/history/${day.date}`}
                  className="group flex min-h-10 cursor-pointer items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-0 px-4 py-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-card-hover"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium capitalize text-neutral-900 transition-colors group-hover:text-violet-700">
                      {formatDayLong(day.date, locale)}
                    </p>
                    <p className="mt-0.5 text-[13px] text-neutral-500">
                      {day._count.notes}{" "}
                      {day._count.notes === 1
                        ? "notatka"
                        : day._count.notes < 5
                          ? "notatki"
                          : "notatek"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {day.status === "open" ? (
                      <Badge variant="neutral">{t("history.dayOpen")}</Badge>
                    ) : (
                      <SyncStatusBadge status={day.syncStatus} />
                    )}
                    {day.tasksTotal !== null && day.tasksTotal > 0 && (
                      <Badge variant="neutral" title="Wykonane zadania z kalendarza">
                        <ListChecks aria-hidden className="h-3.5 w-3.5" />
                        {day.tasksDone ?? 0}/{day.tasksTotal}
                      </Badge>
                    )}
                    <Badge
                      variant={day.dayRating !== null ? "violet" : "neutral"}
                      title="Ocena dnia"
                    >
                      ★ {day.dayRating ?? "—"}/5
                    </Badge>
                    <Badge
                      variant={day.energyLevel !== null ? "azure" : "neutral"}
                      title="Poziom energii"
                    >
                      ⚡ {day.energyLevel ?? "—"}/5
                    </Badge>
                    <ChevronRight
                      aria-hidden
                      className="h-4 w-4 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:text-violet-600"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
