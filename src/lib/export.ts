// Everything we hold about one user, assembled for them to take away.
//
// GDPR Art. 20 (portability) asks for the data in a structured, commonly used,
// machine-readable format. This is the whole of it, in one JSON file.
//
// ─── WHAT IS DELIBERATELY NOT IN HERE ───────────────────────────────────────
//  passwordHash ........ An argon2id hash is not the user's password and is of no
//                        use to them. Handing it out only widens the blast radius
//                        of a leaked export file.
//  Account, Session .... Auth.js internals. Account holds Google's OAuth tokens.
//  OAuthToken .......... Google access/refresh tokens (encrypted at rest here).
//  notionToken ......... Their Notion integration secret.
//  Verification / reset  Short-lived credentials. A live reset token in a file the
//   tokens               user might email themselves is a handed-over account.
//  RoleChange .......... The role audit log names the *admin* who made the change
//                        (changedBy). Exporting it would hand one user a fact about
//                        another, which is the one thing an export must never do.
//
//  Every one of those is a credential or somebody else's data. What remains is
//  what the user actually wrote and did.
//
//  Photos are referenced, not embedded — see PHOTO NOTE below.
// ────────────────────────────────────────────────────────────────────────────

import { prisma } from "@/lib/prisma";

/**
 * Bumped when the shape below changes in a way that would break a reader written
 * against the old one. Consumers should look at this before anything else.
 */
export const EXPORT_SCHEMA_VERSION = 1;

/** JSON columns are stored as text; hand the reader real JSON, not a string. */
function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * PHOTO NOTE — a deliberate v1 simplification.
 *
 * Proof photos and forum photos are referenced by URL, not inlined as base64. The
 * URLs point at the same authorised endpoints the app uses, so a signed-in user
 * can fetch every one of them; a stranger holding the export file cannot.
 *
 * The honest trade-off: this file alone is therefore not a complete archive — the
 * pictures live behind a login. A true "take everything and leave" export is a ZIP
 * with the binaries in it, and that is the version to build if anyone asks for it.
 */
function photoUrl(kind: "forum" | "milestone", id: string): string {
  return kind === "forum" ? `/api/forum-photo/${id}` : `/api/milestone-photo/${id}`;
}

export type UserExport = Awaited<ReturnType<typeof buildUserExport>>;

export async function buildUserExport(userId: string, exportedAt: Date) {
  const [
    user,
    days,
    habits,
    workouts,
    userMilestones,
    milestoneEntries,
    forumPosts,
    forumVotes,
    favoriteQuotes,
    favoriteActivities,
    calendarChecks,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      // An allow-list, not an omit: a column added to User later must be considered
      // on purpose, not exported by accident because nobody updated an exclusion.
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        onboardingComplete: true,
        duduName: true,
        duduColor: true,
        duduConfigJson: true,
        dashboardJson: true,
        notionParentPageId: true,
      },
    }),
    prisma.dayEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      select: {
        date: true,
        morningIntent: true,
        prioritiesJson: true,
        prioritiesDoneJson: true,
        todosJson: true,
        tasksDone: true,
        tasksTotal: true,
        reflectionGood: true,
        reflectionBad: true,
        dayRating: true,
        energyLevel: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        notes: {
          orderBy: { createdAt: "asc" },
          select: { content: true, type: true, createdAt: true },
        },
      },
    }),
    prisma.habit.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
      select: {
        name: true,
        targetPerWeek: true,
        color: true,
        archivedAt: true,
        createdAt: true,
        checks: { orderBy: { date: "asc" }, select: { date: true, createdAt: true } },
      },
    }),
    prisma.workout.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      select: {
        date: true,
        distanceKm: true,
        durationMin: true,
        isRace: true,
        note: true,
        createdAt: true,
        activity: { select: { slug: true, name: true } },
      },
    }),
    prisma.userMilestone.findMany({
      where: { userId },
      orderBy: { completedAt: "asc" },
      select: {
        completedAt: true,
        source: true,
        milestone: {
          select: { level: true, title: true, activity: { select: { slug: true, name: true } } },
        },
      },
    }),
    prisma.milestoneEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        milestoneId: true,
        note: true,
        photoPath: true,
        customTitle: true,
        customDetail: true,
        createdAt: true,
        updatedAt: true,
        milestone: {
          select: { level: true, title: true, activity: { select: { slug: true, name: true } } },
        },
      },
    }),
    prisma.forumPost.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        activitySlug: true,
        level: true,
        parentId: true,
        body: true,
        photoPath: true,
        linkUrl: true,
        createdAt: true,
      },
    }),
    prisma.forumVote.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { postId: true, createdAt: true },
    }),
    prisma.favoriteQuote.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { quoteId: true, createdAt: true },
    }),
    prisma.favoriteActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, activity: { select: { slug: true, name: true } } },
    }),
    prisma.calendarEventCheck.findMany({
      where: { userId },
      orderBy: { checkedAt: "asc" },
      select: { eventId: true, dayKey: true, checkedAt: true },
    }),
  ]);

  if (!user) return null;

  return {
    meta: {
      app: "Vincendio",
      schemaVersion: EXPORT_SCHEMA_VERSION,
      exportedAt: exportedAt.toISOString(),
      about:
        "Everything Vincendio holds about you. Photos are referenced by URL rather than " +
        "embedded; you can download them while signed in. Credentials (password hash, OAuth " +
        "and Notion tokens) are deliberately excluded — they are not useful to you and would " +
        "make this file dangerous to keep.",
    },

    account: {
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      avatarUrl: user.image,
      role: user.role,
      registeredAt: user.createdAt,
      onboardingComplete: user.onboardingComplete,
      companion: {
        name: user.duduName,
        color: user.duduColor,
        outfit: parseJson<Record<string, string>>(user.duduConfigJson, {}),
      },
      dashboardLayout: parseJson<unknown>(user.dashboardJson, null),
      notionParentPageId: user.notionParentPageId,
    },

    journal: days.map((day) => ({
      date: day.date,
      morningIntent: day.morningIntent,
      priorities: parseJson<string[]>(day.prioritiesJson, []),
      prioritiesDone: parseJson<boolean[]>(day.prioritiesDoneJson, []),
      todos: parseJson<unknown[]>(day.todosJson, []),
      calendarTasksDone: day.tasksDone,
      calendarTasksTotal: day.tasksTotal,
      reflectionGood: day.reflectionGood,
      reflectionBad: day.reflectionBad,
      dayRating: day.dayRating,
      energyLevel: day.energyLevel,
      status: day.status,
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
      notes: day.notes,
    })),

    habits: habits.map((habit) => ({
      name: habit.name,
      targetPerWeek: habit.targetPerWeek,
      color: habit.color,
      archivedAt: habit.archivedAt,
      createdAt: habit.createdAt,
      checkedDays: habit.checks.map((check) => check.date),
    })),

    workouts: workouts.map((workout) => ({
      date: workout.date,
      activity: workout.activity.slug,
      activityName: workout.activity.name,
      distanceKm: workout.distanceKm,
      durationMin: workout.durationMin,
      isRace: workout.isRace,
      note: workout.note,
      createdAt: workout.createdAt,
    })),

    skills: {
      completedMilestones: userMilestones.map((row) => ({
        activity: row.milestone.activity.slug,
        activityName: row.milestone.activity.name,
        level: row.milestone.level,
        title: row.milestone.title,
        completedAt: row.completedAt,
        source: row.source,
      })),
      milestoneEntries: milestoneEntries.map((entry) => ({
        activity: entry.milestone.activity.slug,
        activityName: entry.milestone.activity.name,
        level: entry.milestone.level,
        title: entry.customTitle ?? entry.milestone.title,
        detail: entry.customDetail,
        note: entry.note,
        photoUrl: entry.photoPath ? photoUrl("milestone", entry.milestoneId) : null,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })),
    },

    forum: {
      posts: forumPosts.map((post) => ({
        id: post.id,
        // Kept so a reply can be matched to the post it answers. Replies by other
        // people are not here — those are their words, not yours.
        replyToPostId: post.parentId,
        activity: post.activitySlug,
        level: post.level,
        body: post.body,
        linkUrl: post.linkUrl,
        photoUrl: post.photoPath ? photoUrl("forum", post.id) : null,
        createdAt: post.createdAt,
      })),
      upvotedPostIds: forumVotes.map((vote) => ({
        postId: vote.postId,
        votedAt: vote.createdAt,
      })),
    },

    favourites: {
      quoteIds: favoriteQuotes.map((row) => ({ quoteId: row.quoteId, addedAt: row.createdAt })),
      activities: favoriteActivities.map((row) => ({
        activity: row.activity.slug,
        activityName: row.activity.name,
        addedAt: row.createdAt,
      })),
    },

    calendarCheckedEvents: calendarChecks.map((check) => ({
      eventId: check.eventId,
      day: check.dayKey,
      checkedAt: check.checkedAt,
    })),
  };
}

/** vincendio-export-2026-07-14.json */
export function exportFilename(exportedAt: Date): string {
  return `vincendio-export-${exportedAt.toISOString().slice(0, 10)}.json`;
}
