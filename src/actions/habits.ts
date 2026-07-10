"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import { isValidDayKey } from "@/lib/dates";
import { normalizeHabitColor } from "@/lib/habit-colors";
import type { ActionResult } from "@/actions/day-entry";

const nameSchema = z.string().trim().min(1, "errors.habitNameRequired").max(100);
const targetSchema = z.number().int().min(1).max(7);

/** Create a new habit at the end of the user's list. */
export async function createHabit(
  name: string,
  targetPerWeek: number = 7,
  color: string = "green"
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = nameSchema.safeParse(name);
  if (!parsed.success) return fail(issueKey(parsed.error));
  const target = targetSchema.safeParse(targetPerWeek);
  if (!target.success) return fail("errors.habitTargetRange");

  const last = await prisma.habit.findFirst({
    where: { userId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  await prisma.habit.create({
    data: {
      userId,
      name: parsed.data,
      targetPerWeek: target.data,
      color: normalizeHabitColor(color),
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/nawyki");
  return { ok: true };
}

const setColorSchema = z.object({ id: z.string().min(1), color: z.string() });

/** Change a habit's checkbox colour. */
export async function setHabitColor(
  input: z.input<typeof setColorSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = setColorSchema.safeParse(input);
  if (!parsed.success) return fail("errors.badRequest");

  await prisma.habit.updateMany({
    where: { id: parsed.data.id, userId },
    data: { color: normalizeHabitColor(parsed.data.color) },
  });

  revalidatePath("/nawyki");
  return { ok: true };
}

const setTargetSchema = z.object({ id: z.string().min(1), targetPerWeek: targetSchema });

/** Change how many days a week a habit should be done (1..7). */
export async function setHabitTarget(
  input: z.input<typeof setTargetSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = setTargetSchema.safeParse(input);
  if (!parsed.success) return fail("errors.habitTargetRange");

  await prisma.habit.updateMany({
    where: { id: parsed.data.id, userId },
    data: { targetPerWeek: parsed.data.targetPerWeek },
  });

  revalidatePath("/nawyki");
  return { ok: true };
}

const renameSchema = z.object({ id: z.string().min(1), name: nameSchema });

export async function renameHabit(input: z.input<typeof renameSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = renameSchema.safeParse(input);
  if (!parsed.success) return fail(issueKey(parsed.error));

  // updateMany with the userId in the filter = ownership check.
  await prisma.habit.updateMany({
    where: { id: parsed.data.id, userId },
    data: { name: parsed.data.name },
  });

  revalidatePath("/nawyki");
  return { ok: true };
}

const moveSchema = z.object({ id: z.string().min(1), direction: z.enum(["up", "down"]) });

/** Swap a habit's sortOrder with its neighbour (reorder within the active list). */
export async function moveHabit(input: z.input<typeof moveSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = moveSchema.safeParse(input);
  if (!parsed.success) return fail("errors.badRequest");
  const { id, direction } = parsed.data;

  const habits = await prisma.habit.findMany({
    where: { userId, archivedAt: null },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { id: true, sortOrder: true },
  });
  const i = habits.findIndex((h) => h.id === id);
  if (i < 0) return fail("errors.habitNotFound");
  const j = direction === "up" ? i - 1 : i + 1;
  if (j < 0 || j >= habits.length) return { ok: true }; // already at the edge

  const a = habits[i];
  const b = habits[j];
  await prisma.$transaction([
    prisma.habit.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.habit.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);

  revalidatePath("/nawyki");
  return { ok: true };
}

const archiveSchema = z.object({ id: z.string().min(1), archived: z.boolean() });

/** Archive/unarchive a habit — drops it from the grid but keeps its check history. */
export async function setHabitArchived(
  input: z.input<typeof archiveSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = archiveSchema.safeParse(input);
  if (!parsed.success) return fail("errors.badRequest");

  await prisma.habit.updateMany({
    where: { id: parsed.data.id, userId },
    data: { archivedAt: parsed.data.archived ? new Date() : null },
  });

  revalidatePath("/nawyki");
  return { ok: true };
}

const deleteSchema = z.object({ id: z.string().min(1) });

/** Permanently delete a habit and all its checks (cascade). */
export async function deleteHabit(input: z.input<typeof deleteSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) return fail("errors.badRequest");

  await prisma.habit.deleteMany({ where: { id: parsed.data.id, userId } });

  revalidatePath("/nawyki");
  return { ok: true };
}

const checkSchema = z.object({
  habitId: z.string().min(1),
  date: z.string(),
  checked: z.boolean(),
});

/** Mark a habit done/undone on a given day (one square in the grid). */
export async function setHabitCheck(input: z.input<typeof checkSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = checkSchema.safeParse(input);
  if (!parsed.success || !isValidDayKey(parsed.data.date)) {
    return fail("errors.badRequest");
  }
  const { habitId, date, checked } = parsed.data;

  // Ownership: the habit must belong to the signed-in user.
  const owned = await prisma.habit.findFirst({
    where: { id: habitId, userId },
    select: { id: true },
  });
  if (!owned) return fail("errors.habitNotFound");

  if (checked) {
    await prisma.habitCheck.upsert({
      where: { habitId_date: { habitId, date } },
      update: {},
      create: { userId, habitId, date },
    });
  } else {
    await prisma.habitCheck.deleteMany({ where: { habitId, date } });
  }

  revalidatePath("/nawyki");
  return { ok: true };
}
