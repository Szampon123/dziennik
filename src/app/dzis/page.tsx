import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { Circle, CircleCheck } from "lucide-react";
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
import { getT } from "@/lib/i18n/server";
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

// Behind the auth proxy: a signed-out crawler is redirected away, so this page
// must never be indexed. noindex takes the place of a canonical — a canonical
// would only assert that this URL duplicates another one.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("page.today.title"),
    robots: { index: false, follow: false },
  };
}

export default async function TodayPage() {
  const userId = await requireUserId();
  const [day, notionConfigured, streak, favQuoteIds, user, characterXp, { t, locale }] = await Promise.all([
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
    getT(),
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
        characterStageName={t(character.stageNameKey)}
        characterXp={characterXp}
        characterColor={user?.duduColor}
        characterConfig={user?.duduConfigJson}
        characterName={user?.duduName ?? null}
      />
    ),
    nowNext: <NowNext />,
    calendar: <WeekCalendar />,
    morning: (
      <Card title={t("card.morning.title")} subtitle={t("card.morning.subtitle")}>
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
      <Card title={t("card.todos.title")} subtitle={t("card.todos.subtitle")}>
        <TodoList date={day.date} todos={parseTodos(day.todosJson)} disabled={closed} />
      </Card>
    ),
    notes: (
      <Card title={t("card.notes.title")} subtitle={t("card.notes.subtitle")}>
        <NoteStream date={day.date} notes={day.notes} disabled={closed} />
      </Card>
    ),
    close: (
      <Card title={t("card.close.title")} subtitle={t("card.close.subtitle")}>
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
          <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
            {t("page.today.title")}
          </h1>
          <p className="mt-1 text-[13px] capitalize text-neutral-500">{formatDayLong(day.date, locale)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {morningFilled ? (
            <Badge variant="success">
              <CircleCheck aria-hidden className="h-3.5 w-3.5" />
              {t("today.morningSaved")}
            </Badge>
          ) : (
            <Badge variant="warning">
              <Circle aria-hidden className="h-3.5 w-3.5" />
              {t("today.morningEmpty")}
            </Badge>
          )}
          <DashboardCustomizer order={order} hidden={[...hidden]} />
        </div>
      </div>

      {visible.length === 0 ? (
        <Card title={t("today.emptyTitle")} subtitle={t("today.emptySubtitle")}>
          <p className="text-sm text-neutral-600">{t("today.emptyHint")}</p>
        </Card>
      ) : needsCalendar ? (
        <CalendarProvider initialCheckedIds={todayCheckedIds}>{list}</CalendarProvider>
      ) : (
        list
      )}
    </div>
  );
}
