"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import { isValidDayKey, todayKey, dayKeyToDate } from "@/lib/dates";
import { MAX_PRIORITIES, parsePriorities, parsePrioritiesDone } from "@/lib/day";
import { isNotionConfigured, syncDayToNotion } from "@/lib/notion";
import { getCachedEvents } from "@/lib/calendar-cache";
import { getGoogleStatus } from "@/lib/google";

// Defined in lib/action-errors alongside fail(), which produces its failure
// branch. Re-exported here because every action already imports it from this
// module. Type-only, so the "use server" export rule doesn't apply.
import type { ActionResult } from "@/lib/action-errors";
export type { ActionResult };

const morningSchema = z.object({
  date: z.string().refine(isValidDayKey, "errors.invalidDate"),
  morningIntent: z.string().max(2000, "errors.intentTooLong").optional().default(""),
  priorities: z
    .array(z.string().max(300, "errors.priorityTooLong"))
    .max(MAX_PRIORITIES, "errors.tooManyPriorities"),
});

export async function saveMorning(input: z.input<typeof morningSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = morningSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error), { max: MAX_PRIORITIES });
  }
  const { date, morningIntent, priorities } = parsed.data;
  const cleaned = priorities.map((p) => p.trim()).filter(Boolean);

  const day = await prisma.dayEntry.findUnique({ where: { userId_date: { userId, date } } });
  if (day?.status === "closed") {
    return fail("errors.dayClosedEdit");
  }

  // Re-saving priorities keeps done-flags for texts that are still present
  // (an edited/removed priority loses its checkmark — it's a different task).
  const previous = parsePriorities(day?.prioritiesJson ?? "[]");
  const previousDone = parsePrioritiesDone(day?.prioritiesDoneJson ?? "[]", previous.length);
  const doneByText = new Map(previous.map((text, i) => [text, previousDone[i]]));
  const done = cleaned.map((text) => doneByText.get(text) ?? false);

  await prisma.dayEntry.upsert({
    where: { userId_date: { userId, date } },
    update: {
      morningIntent: morningIntent.trim(),
      prioritiesJson: JSON.stringify(cleaned),
      prioritiesDoneJson: JSON.stringify(done),
    },
    create: {
      userId,
      date,
      morningIntent: morningIntent.trim(),
      prioritiesJson: JSON.stringify(cleaned),
      prioritiesDoneJson: JSON.stringify(done),
    },
  });

  revalidatePath("/");
  revalidatePath("/history");
  return { ok: true };
}

const priorityCheckSchema = z.object({
  date: z.string().refine(isValidDayKey, "errors.invalidDate"),
  index: z.number().int().min(0).max(MAX_PRIORITIES - 1),
  checked: z.boolean(),
});

/** Marks a morning priority as done/undone (a "checkpoint" on the Dziś screen). */
export async function setPriorityCheck(
  input: z.input<typeof priorityCheckSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = priorityCheckSchema.safeParse(input);
  if (!parsed.success) {
    return fail("errors.badRequest");
  }
  const { date, index, checked } = parsed.data;

  const day = await prisma.dayEntry.findUnique({ where: { userId_date: { userId, date } } });
  if (!day) return fail("errors.dayEntryNotFound");
  if (day.status === "closed") {
    return fail("errors.dayClosed");
  }

  const priorities = parsePriorities(day.prioritiesJson);
  if (index >= priorities.length) {
    return fail("errors.savePriorityFirst");
  }
  const done = parsePrioritiesDone(day.prioritiesDoneJson, priorities.length);
  done[index] = checked;

  await prisma.dayEntry.update({
    where: { userId_date: { userId, date } },
    data: { prioritiesDoneJson: JSON.stringify(done) },
  });

  revalidatePath("/");
  return { ok: true };
}

const closeSchema = z.object({
  date: z.string().refine(isValidDayKey, "errors.invalidDate"),
  reflectionGood: z.string().max(5000, "errors.reflectionTooLong").optional().default(""),
  reflectionBad: z.string().max(5000, "errors.reflectionTooLong").optional().default(""),
  dayRating: z.number().int().min(1, "errors.pickDayRating").max(5),
  energyLevel: z.number().int().min(1, "errors.pickEnergyLevel").max(5),
});

export async function closeDay(input: z.input<typeof closeSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = closeSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error), { max: MAX_PRIORITIES });
  }
  const { date, reflectionGood, reflectionBad, dayRating, energyLevel } = parsed.data;

  // Snapshot calendar-checkpoint progress for the day (for the Notion brief
  // and history). Best-effort: a disconnected calendar must not block closing.
  let tasksDone: number | null = null;
  let tasksTotal: number | null = null;
  try {
    const status = await getGoogleStatus(userId);
    if (status.state === "connected") {
      const daysBack = Math.max(
        0,
        Math.round((dayKeyToDate(todayKey()).getTime() - dayKeyToDate(date).getTime()) / 86_400_000)
      );
      const { events } = await getCachedEvents(userId, 0, { pastDays: Math.min(daysBack, 14) });
      const dayEvents = events.filter((e) => e.dayKey === date);
      tasksTotal = dayEvents.length;
      const eventIds = dayEvents.map((e) => e.id);
      tasksDone =
        eventIds.length > 0
          ? await prisma.calendarEventCheck.count({
              where: { userId, eventId: { in: eventIds } },
            })
          : 0;
    }
  } catch {
    // leave nulls — the brief simply omits the progress line
  }

  // Couldn't compute a fresh snapshot (calendar disconnected, out of the fetch
  // window, or an edited count on an old day) — keep whatever was already saved
  // instead of wiping a manually-set task count on re-close.
  if (tasksTotal === null) {
    const existing = await prisma.dayEntry.findUnique({
      where: { userId_date: { userId, date } },
      select: { tasksDone: true, tasksTotal: true },
    });
    tasksDone = existing?.tasksDone ?? null;
    tasksTotal = existing?.tasksTotal ?? null;
  }

  // Local save always succeeds first — Notion sync must never block it.
  await prisma.dayEntry.upsert({
    where: { userId_date: { userId, date } },
    update: {
      reflectionGood: reflectionGood.trim(),
      reflectionBad: reflectionBad.trim(),
      dayRating,
      energyLevel,
      status: "closed",
      tasksDone,
      tasksTotal,
    },
    create: {
      userId,
      date,
      reflectionGood: reflectionGood.trim(),
      reflectionBad: reflectionBad.trim(),
      dayRating,
      energyLevel,
      status: "closed",
      tasksDone,
      tasksTotal,
    },
  });

  if (await isNotionConfigured(userId)) {
    // Errors are captured in syncStatus/syncError; the day stays closed locally.
    await syncDayToNotion(userId, date);
  }

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath(`/history/${date}`);
  return { ok: true };
}

export async function reopenDay(date: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!isValidDayKey(date)) {
    return fail("errors.invalidDate");
  }
  const day = await prisma.dayEntry.findUnique({ where: { userId_date: { userId, date } } });
  if (!day) {
    return fail("errors.dayEntryNotFound");
  }

  await prisma.dayEntry.update({
    where: { userId_date: { userId, date } },
    data: { status: "open" },
  });

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath(`/history/${date}`);
  return { ok: true };
}

const tasksSchema = z.object({
  date: z.string().refine(isValidDayKey, "errors.invalidDate"),
  tasksDone: z.number().int().min(0).max(100).nullable(),
  tasksTotal: z.number().int().min(0).max(100).nullable(),
});

/**
 * Directly correct the completed-tasks count for a day (past days can't be
 * re-checked against the live calendar, so the count is editable by hand).
 * An empty/zero total clears both values. Re-syncs the Notion brief when the
 * day is already closed.
 */
export async function updateDayTasks(
  input: z.input<typeof tasksSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = tasksSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error), { max: MAX_PRIORITIES });
  }
  const { date } = parsed.data;

  let { tasksDone, tasksTotal } = parsed.data;
  if (tasksTotal === null || tasksTotal === 0) {
    tasksDone = null;
    tasksTotal = null;
  } else {
    tasksDone = Math.min(Math.max(tasksDone ?? 0, 0), tasksTotal);
  }

  const day = await prisma.dayEntry.findUnique({
    where: { userId_date: { userId, date } },
    select: { status: true },
  });
  if (!day) {
    return fail("errors.dayEntryNotFound");
  }

  await prisma.dayEntry.update({
    where: { userId_date: { userId, date } },
    data: { tasksDone, tasksTotal },
  });

  if (day.status === "closed" && (await isNotionConfigured(userId))) {
    await syncDayToNotion(userId, date);
  }

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath(`/history/${date}`);
  return { ok: true };
}
