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

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const userId = await requireUserId();
  const [days, chartDays] = await Promise.all([listDays(userId), lastThirtyDays(userId)]);
  const ratedDays = chartDays.filter(
    (d) => d.dayRating !== null || d.energyLevel !== null
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Historia</h1>

      <Card title="Ostatnie 30 dni" subtitle="Ocena dnia i poziom energii">
        {ratedDays >= 1 ? (
          <HistoryChart data={chartDays} />
        ) : (
          <p className="py-10 text-center text-[13px] text-neutral-500">
            Zamknij dzień z oceną i energią, aby zobaczyć trend
          </p>
        )}
      </Card>

      <Card title="Wszystkie dni" subtitle="Kliknij dzień, aby zobaczyć szczegóły">
        {days.length === 0 ? (
          <EmptyState
            title="Brak zapisanych dni"
            hint="Twój pierwszy dzień pojawi się tu po dodaniu wpisu na stronie Dziś."
          />
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-200">
            {days.map((day) => (
              <li key={day.id}>
                <Link
                  href={`/history/${day.date}`}
                  className="flex min-h-10 cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-neutral-50"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium capitalize text-neutral-900">
                      {formatDayLong(day.date)}
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
                      <Badge variant="neutral">dzień otwarty</Badge>
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
                    <ChevronRight aria-hidden className="h-4 w-4 text-neutral-400" />
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
