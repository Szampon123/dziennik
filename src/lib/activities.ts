// Activity skill system — read-side helpers.
// Activity/Milestone definitions are global (seeded); completions are per user.
import { prisma } from "@/lib/prisma";
import { startOfWeek, todayKey, dayKeyToDate } from "@/lib/dates";
import { parseResources } from "@/lib/milestone-resources";
import { getLocale } from "@/lib/i18n/server";
import { getActivityName, getMilestoneTitle, getMilestoneDetail } from "@/lib/i18n/translate";

/** Epoch ms of Monday 00:00 of the current week (local tz). */
function weekStartMs(): number {
  return dayKeyToDate(startOfWeek(todayKey())).getTime();
}

export type MilestoneVideo = { yt: string; tut: string; kind: "piece" | "technika" };

/** Parse the seeded videoJson ({yt, tut, kind?}); tolerant of null/garbage. */
function parseVideo(json: string | null): MilestoneVideo | null {
  if (!json) return null;
  try {
    const v = JSON.parse(json);
    if (v && typeof v.yt === "string" && typeof v.tut === "string") {
      const kind = v.kind === "technika" ? "technika" : "piece";
      return { yt: v.yt, tut: v.tut, kind };
    }
  } catch {
    // ignore malformed data
  }
  return null;
}

/**
 * The user's level in an activity: the HIGHEST level they've completed — their
 * position on the ladder. Completing a higher milestone raises the level even
 * if some lower one is still unchecked (e.g. a frequency-based level like "run
 * 2×/week for 4 weeks" isn't auto-satisfied by a distance run, so gaps are
 * normal). Previously this was the highest *contiguous* level, which got stuck
 * at a gap even when higher levels were done — confusing and reported as a bug.
 */
export function highestLevel(completedLevels: Set<number>): number {
  let level = 0;
  for (const l of completedLevels) if (l > level) level = l;
  return level;
}

export async function listActivitiesWithProgress(userId: string) {
  const since = weekStartMs();
  // Seed copy is stored per locale; resolve it here so every caller downstream
  // receives display-ready strings and never sees the raw Polish columns.
  const locale = await getLocale();
  const activities = await prisma.activity.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      favorites: { where: { userId }, select: { userId: true } },
      milestones: {
        select: {
          level: true,
          completions: {
            where: { userId },
            select: { completedAt: true },
          },
        },
      },
      workouts: {
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  return activities.map((a) => {
    const completed = new Set(
      a.milestones.filter((m) => m.completions.length > 0).map((m) => m.level)
    );
    const maxLevel = a.milestones.length;
    const level = highestLevel(completed);

    // Most recent sign of activity: latest workout or latest milestone check-off.
    const timestamps: number[] = [];
    if (a.workouts[0]) timestamps.push(a.workouts[0].createdAt.getTime());
    for (const m of a.milestones) {
      for (const c of m.completions) timestamps.push(c.completedAt.getTime());
    }
    const lastActiveAt = timestamps.length > 0 ? Math.max(...timestamps) : null;

    // Milestones checked off in the current calendar week (Mon–Sun).
    const completedThisWeek = a.milestones.reduce(
      (n, m) => n + m.completions.filter((c) => c.completedAt.getTime() >= since).length,
      0
    );

    // When the CURRENT level was achieved — the check-off date of the milestone
    // at that level (shown on the activity list card).
    const levelAchievedAt =
      level > 0
        ? (a.milestones
            .find((m) => m.level === level)
            ?.completions[0]?.completedAt.getTime() ?? null)
        : null;

    return {
      id: a.id,
      slug: a.slug,
      name: getActivityName(a, locale),
      icon: a.icon,
      description: a.description,
      category: a.category,
      favorite: a.favorites.length > 0,
      maxLevel,
      completedCount: completed.size,
      level,
      started: completed.size > 0,
      completed: completed.size === maxLevel,
      lastActiveAt,
      levelAchievedAt,
      completedThisWeek,
    };
  });
}

export type ActivityListItem = Awaited<ReturnType<typeof listActivitiesWithProgress>>[number];

export async function getActivityWithMilestones(userId: string, slug: string) {
  const locale = await getLocale();
  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: {
      milestones: {
        orderBy: { level: "asc" },
        include: {
          completions: { where: { userId }, select: { completedAt: true, source: true } },
          // videoJson lives on the milestone (global) — selected via the default scalar below.
          entries: {
            where: { userId },
            select: {
              note: true,
              photoPath: true,
              updatedAt: true,
              customTitle: true,
              customDetail: true,
            },
          },
        },
      },
      workouts: {
        where: { userId },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: 400, // recent history — the list shows ~20, the chart aggregates the rest
      },
    },
  });
  if (!activity) return null;

  const milestones = activity.milestones.map((m) => {
    // Per-user overrides win for display; the seeded original stays available.
    const customTitle = m.entries[0]?.customTitle ?? null;
    const customDetail = m.entries[0]?.customDetail ?? null;
    // "Original" means the seeded text as this reader sees it, not the raw
    // Polish — it prefills the edit form and is what a reset restores.
    const originalTitle = getMilestoneTitle(m, locale);
    const originalDetail = getMilestoneDetail(m, locale);
    return {
      video: parseVideo(m.videoJson),
      resources: parseResources(m.resourcesJson),
      id: m.id,
      level: m.level,
      title: customTitle ?? originalTitle,
      detail: customDetail ?? originalDetail,
      originalTitle,
      originalDetail,
      customTitle,
      customDetail,
      customized: customTitle !== null || customDetail !== null,
      criteriaJson: m.criteriaJson,
      done: m.completions.length > 0,
      auto: m.completions[0]?.source === "auto",
      completedAt: m.completions[0]?.completedAt.getTime() ?? null,
      note: m.entries[0]?.note ?? null,
      hasPhoto: Boolean(m.entries[0]?.photoPath),
      // Cache-buster for the photo URL (changes on re-upload).
      entryVersion: m.entries[0]?.updatedAt.getTime() ?? null,
    };
  });
  const completed = new Set(milestones.filter((m) => m.done).map((m) => m.level));
  const maxLevel = milestones.length;
  const level = highestLevel(completed);
  const levelAchievedAt =
    level > 0 ? (milestones.find((m) => m.level === level)?.completedAt ?? null) : null;

  return {
    id: activity.id,
    slug: activity.slug,
    name: getActivityName(activity, locale),
    icon: activity.icon,
    description: activity.description,
    category: activity.category,
    logKind: activity.logKind,
    maxLevel,
    completedCount: completed.size,
    level,
    levelAchievedAt,
    milestones,
    workouts: activity.workouts.map((w) => ({
      id: w.id,
      date: w.date,
      distanceKm: w.distanceKm,
      durationMin: w.durationMin,
      isRace: w.isRace,
      note: w.note,
      source: w.source,
    })),
  };
}
