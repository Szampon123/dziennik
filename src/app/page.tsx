import { Fragment, type ReactNode } from "react";
import {
  getOrCreateToday,
  closedDayStreak,
  favoriteQuoteIds,
  completedMilestoneCount,
} from "@/lib/queries";
import { computeCharacter } from "@/lib/character";
import { formatDayLong, dayKeyDaysAgo } from "@/lib/dates";
import { parsePriorities, parsePrioritiesDone } from "@/lib/day";
import { parseTodos } from "@/lib/todos";
import { dailyQuoteId } from "@/lib/quotes";
import { resolveDashboard } from "@/lib/dashboard";
import { isNotionConfigured } from "@/lib/notion";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { Card } from "@/components/Card";
import { Badge } from "@/components/ui/Badge";
import { CalendarProvider } from "@/components/calendar/CalendarProvider";
import { DayOverview } from "@/components/calendar/DayOverview";
import { NowNext } from "@/components/calendar/NowNext";
import { WeekCalendar } from "@/components/calendar/WeekCalendar";
import { QuotePanel } from "@/components/QuotePanel";
import { MorningEntry } from "@/components/MorningEntry";
import { TodoList } from "@/components/TodoList";
import { NoteStream } from "@/components/NoteStream";
import { CloseDayPanel } from "@/components/CloseDayPanel";
import { DashboardCustomizer } from "@/components/DashboardCustomizer";

// The page creates today's entry on first visit and always reflects the DB.
export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const userId = await requireUserId();
  const [day, notionConfigured, streak, favQuoteIds, user, characterXp] = await Promise.all([
    getOrCreateToday(userId),
    isNotionConfigured(userId),
    closedDayStreak(userId),
    favoriteQuoteIds(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        dashboardJson: true,
        duduColor: true,
        duduConfigJson: true,
        duduName: true,
      },
    }),
    completedMilestoneCount(userId),
  ]);
  const character = computeCharacter(characterXp);
  const closed = day.status === "closed";
  const priorities = parsePriorities(day.prioritiesJson);
  const prioritiesDone = parsePrioritiesDone(day.prioritiesDoneJson, priorities.length);
  const morningFilled = Boolean(day.morningIntent?.trim()) || priorities.length > 0;

  // Calendar checkpoints for the 7-day trend window (today + 6 days back).
  const weekKeys = Array.from({ length: 7 }, (_, i) => dayKeyDaysAgo(i));
  const weekChecks = await prisma.calendarEventCheck.findMany({
    where: { userId, dayKey: { in: weekKeys } },
    select: { eventId: true, dayKey: true },
  });

  // Personalised layout (defaults to all widgets in the default order).
  const { order, hidden } = resolveDashboard(user?.dashboardJson);

  const todayCheckedIds = weekChecks
    .filter((c) => c.dayKey === day.date)
    .map((c) => c.eventId);

  const widgets: Record<string, ReactNode> = {
    quote: <QuotePanel dailyId={dailyQuoteId(day.date)} favoriteIds={favQuoteIds} />,
    dayOverview: (
      <DayOverview
        weekChecks={weekChecks}
        dayRating={day.dayRating}
        energyLevel={day.energyLevel}
        streak={streak}
        prioritiesTotal={priorities.length}
        prioritiesDone={prioritiesDone.filter(Boolean).length}
        characterStage={character.stageIndex}
        characterStageName={character.stageName}
        characterXp={characterXp}
        characterColor={user?.duduColor}
        characterConfig={user?.duduConfigJson}
        characterName={user?.duduName ?? null}
      />
    ),
    nowNext: <NowNext />,
    calendar: <WeekCalendar />,
    morning: (
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
    ),
    todos: (
      <Card title="Do zrobienia" subtitle="Krótkie zadania na dziś — z opcjonalną godziną">
        <TodoList date={day.date} todos={parseTodos(day.todosJson)} disabled={closed} />
      </Card>
    ),
    notes: (
      <Card title="Notatki z dnia" subtitle="Szybkie zapiski z timestampem">
        <NoteStream date={day.date} notes={day.notes} disabled={closed} />
      </Card>
    ),
    close: (
      <Card title="Zamknięcie dnia" subtitle="Wieczorna refleksja i oceny">
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
    ),
  };

  const visible = order.filter((id) => !hidden.has(id) && widgets[id]);
  // The three calendar widgets share one client-side fetch via CalendarProvider;
  // only mount it (and hit the API) when at least one of them is visible.
  const calendarIds = new Set(["dayOverview", "nowNext", "calendar"]);
  const needsCalendar = visible.some((id) => calendarIds.has(id));
  const list = visible.map((id) => <Fragment key={id}>{widgets[id]}</Fragment>);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Dziś</h1>
          <p className="mt-1 text-[13px] capitalize text-neutral-500">{formatDayLong(day.date)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {morningFilled ? (
            <Badge variant="success">● Poranek zapisany</Badge>
          ) : (
            <Badge variant="warning">○ Poranek niewypełniony</Badge>
          )}
          <DashboardCustomizer order={order} hidden={[...hidden]} />
        </div>
      </div>

      {visible.length === 0 ? (
        <Card title="Pusty widok" subtitle="Wszystkie sekcje są ukryte">
          <p className="text-sm text-neutral-600">
            Włącz sekcje w „Dostosuj widok”, aby znów zobaczyć swój dzień.
          </p>
        </Card>
      ) : needsCalendar ? (
        <CalendarProvider initialCheckedIds={todayCheckedIds}>{list}</CalendarProvider>
      ) : (
        list
      )}
    </div>
  );
}
