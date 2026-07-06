"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { isValidDayKey } from "@/lib/dates";
import type { ActionResult } from "@/actions/day-entry";

const schema = z.object({
  eventId: z.string().min(1).max(1024),
  dayKey: z.string(),
  checked: z.boolean(),
});

/** Marks a calendar event as done/undone (a "checkpoint" on the Dziś screen). */
export async function setEventCheck(input: z.input<typeof schema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = schema.safeParse(input);
  if (!parsed.success || !isValidDayKey(parsed.data.dayKey)) {
    return { ok: false, error: "Nieprawidłowe żądanie." };
  }
  const { eventId, dayKey, checked } = parsed.data;

  if (checked) {
    await prisma.calendarEventCheck.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: { dayKey },
      create: { userId, eventId, dayKey },
    });
  } else {
    await prisma.calendarEventCheck.deleteMany({ where: { userId, eventId } });
  }

  revalidatePath("/");
  return { ok: true };
}

const pastDaySchema = z.object({
  date: z.string(),
  eventId: z.string().min(1).max(1024),
  checked: z.boolean(),
  eventIds: z.array(z.string().min(1).max(1024)).max(250),
});

/**
 * Toggle a checkpoint for a past day reviewed in History, and keep that day's
 * task snapshot (`tasksDone/tasksTotal`) in sync so the History badges and
 * chart reflect the verification. `eventIds` is the full set of that day's
 * calendar events, so the done count only sums checks that belong to them.
 */
export async function setPastDayEventCheck(
  input: z.input<typeof pastDaySchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = pastDaySchema.safeParse(input);
  if (!parsed.success || !isValidDayKey(parsed.data.date)) {
    return { ok: false, error: "Nieprawidłowe żądanie." };
  }
  const { date, eventId, checked, eventIds } = parsed.data;

  if (checked) {
    await prisma.calendarEventCheck.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: { dayKey: date },
      create: { userId, eventId, dayKey: date },
    });
  } else {
    await prisma.calendarEventCheck.deleteMany({ where: { userId, eventId } });
  }

  // Recompute the snapshot from the day's actual events + their checks.
  const tasksDone =
    eventIds.length > 0
      ? await prisma.calendarEventCheck.count({
          where: { userId, dayKey: date, eventId: { in: eventIds } },
        })
      : 0;
  await prisma.dayEntry.updateMany({
    where: { userId, date },
    data: { tasksDone, tasksTotal: eventIds.length },
  });

  revalidatePath("/");
  revalidatePath("/history");
  revalidatePath(`/history/${date}`);
  return { ok: true };
}
