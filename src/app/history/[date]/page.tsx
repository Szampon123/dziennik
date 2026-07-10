import Link from "next/link";
import { notFound } from "next/navigation";
import { ListChecks } from "lucide-react";
import { getDayWithNotes } from "@/lib/queries";
import { formatDayLong, isValidDayKey } from "@/lib/dates";
import { parsePriorities, parsePrioritiesDone } from "@/lib/day";
import { Card } from "@/components/Card";
import { Badge } from "@/components/ui/Badge";
import { SyncStatusBadge } from "@/components/SyncStatusBadge";
import { MorningEntry } from "@/components/MorningEntry";
import { NoteStream } from "@/components/NoteStream";
import { CloseDayPanel } from "@/components/CloseDayPanel";
import { TasksEditor } from "@/components/TasksEditor";
import { DayCalendarTasks } from "@/components/DayCalendarTasks";
import { isNotionConfigured } from "@/lib/notion";
import { getGoogleStatus } from "@/lib/google";
import { getCachedDayEvents } from "@/lib/calendar-cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { getLocale } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function DayDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const userId = await requireUserId();
  const { date } = await params;
  if (!isValidDayKey(date)) notFound();

  const [day, notionConfigured, locale] = await Promise.all([
    getDayWithNotes(userId, date),
    isNotionConfigured(userId),
    getLocale(),
  ]);
  if (!day) notFound();

  const priorities = parsePriorities(day.prioritiesJson);
  const prioritiesDone = parsePrioritiesDone(day.prioritiesDoneJson, priorities.length);
  const closed = day.status === "closed";

  // Read that day's real calendar events (like the Dziś screen) so the user can
  // see how many tasks there were and verify which got done. Falls back to the
  // manual count editor when the calendar can't be read for this day.
  const googleStatus = await getGoogleStatus(userId);
  let dayEvents: Awaited<ReturnType<typeof getCachedDayEvents>>["events"] | null = null;
  if (googleStatus.state === "connected") {
    try {
      dayEvents = (await getCachedDayEvents(userId, date)).events;
    } catch {
      dayEvents = null; // fall back to the manual editor
    }
  }
  const hasEvents = dayEvents !== null && dayEvents.length > 0;
  const checkedIds = hasEvents
    ? (
        await prisma.calendarEventCheck.findMany({
          where: { userId, dayKey: date, eventId: { in: dayEvents!.map((e) => e.id) } },
          select: { eventId: true },
        })
      ).map((c) => c.eventId)
    : [];

  // When live events are available, the header badge follows them so it matches
  // the checklist even before the first toggle updates the stored snapshot.
  const headerTasksDone = hasEvents ? checkedIds.length : day.tasksDone;
  const headerTasksTotal = hasEvents ? dayEvents!.length : day.tasksTotal;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/history"
            className="group inline-flex items-center gap-1 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">←</span> Historia
          </Link>
          <h1 className="mt-1 text-[28px] font-semibold capitalize tracking-[-0.5px] text-neutral-900">
            {formatDayLong(day.date, locale)}
          </h1>
          {closed ? (
            <p className="mt-1 text-[13px] text-neutral-500">
              Dzień zamknięty — otwórz go ponownie, aby edytować poranek, notatki i refleksję.
            </p>
          ) : (
            <p className="mt-1 text-[13px] text-neutral-500">Dzień otwarty — możesz swobodnie edytować.</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-6">
          {closed ? (
            <SyncStatusBadge status={day.syncStatus} />
          ) : (
            <Badge variant="neutral">dzień otwarty</Badge>
          )}
          {headerTasksTotal !== null && headerTasksTotal > 0 && (
            <Badge variant="neutral" title="Wykonane zadania z kalendarza">
              <ListChecks aria-hidden className="h-3.5 w-3.5" />
              {headerTasksDone ?? 0}/{headerTasksTotal}
            </Badge>
          )}
          <Badge variant={day.dayRating !== null ? "violet" : "neutral"} title="Ocena dnia">
            ★ {day.dayRating ?? "—"}/5
          </Badge>
          <Badge variant={day.energyLevel !== null ? "azure" : "neutral"} title="Poziom energii">
            ⚡ {day.energyLevel ?? "—"}/5
          </Badge>
        </div>
      </div>

      <Card title="Poranek" subtitle="Intencja dnia i 1–3 priorytety">
        <MorningEntry
          date={day.date}
          initialIntent={day.morningIntent ?? ""}
          initialPriorities={priorities}
          initialPrioritiesDone={prioritiesDone}
          disabled={closed}
          notionConfigured={notionConfigured}
        />
      </Card>

      <Card
        title="Zadania z kalendarza"
        subtitle={
          hasEvents
            ? "Odhacz zadania z tego dnia, aby zweryfikować, co udało się wykonać"
            : "Ile zadań udało się wykonać tego dnia"
        }
      >
        {hasEvents ? (
          <DayCalendarTasks date={day.date} events={dayEvents!} initialCheckedIds={checkedIds} />
        ) : (
          <div className="flex flex-col gap-3">
            {googleStatus.state === "connected" && dayEvents !== null && (
              <p className="text-[13px] text-neutral-500">
                Brak wydarzeń z kalendarza tego dnia — możesz wpisać liczbę ręcznie.
              </p>
            )}
            <TasksEditor date={day.date} tasksDone={day.tasksDone} tasksTotal={day.tasksTotal} />
          </div>
        )}
      </Card>

      <Card title="Notatki z dnia" subtitle="Zapiski z timestampem">
        <NoteStream date={day.date} notes={day.notes} disabled={closed} />
      </Card>

      <Card title="Zamknięcie dnia" subtitle="Refleksja i oceny">
        <CloseDayPanel
          date={day.date}
          initialGood={day.reflectionGood ?? ""}
          initialBad={day.reflectionBad ?? ""}
          initialRating={day.dayRating}
          initialEnergy={day.energyLevel}
          closed={closed}
          syncStatus={day.syncStatus}
          syncError={day.syncError}
          showRetry={closed && notionConfigured && day.syncStatus !== "synced"}
        />
      </Card>
    </div>
  );
}
