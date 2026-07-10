"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import { isValidDayKey } from "@/lib/dates";
import { NOTE_TYPES } from "@/lib/day";
import type { ActionResult } from "@/actions/day-entry";

const addNoteSchema = z.object({
  date: z.string().refine(isValidDayKey, "errors.invalidDate"),
  content: z.string().trim().min(1, "errors.noteEmpty").max(2000, "errors.noteTooLong"),
  type: z.enum(NOTE_TYPES),
});

export async function addNote(input: z.input<typeof addNoteSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = addNoteSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error));
  }
  const { date, content, type } = parsed.data;

  const day = await prisma.dayEntry.upsert({
    where: { userId_date: { userId, date } },
    update: {},
    create: { userId, date },
  });
  if (day.status === "closed") {
    return fail("errors.dayClosedAddNote");
  }

  await prisma.note.create({
    data: { content, type, dayEntryId: day.id },
  });

  revalidatePath("/");
  revalidatePath(`/history/${date}`);
  return { ok: true };
}

export async function deleteNote(id: string): Promise<ActionResult> {
  const userId = await requireUserId();
  const note = await prisma.note.findUnique({ where: { id }, include: { dayEntry: true } });
  // Ownership check: never touch another user's notes.
  if (!note || note.dayEntry.userId !== userId) {
    return fail("errors.noteNotFound");
  }
  if (note.dayEntry.status === "closed") {
    return fail("errors.dayClosedDeleteNote");
  }

  await prisma.note.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/history/${note.dayEntry.date}`);
  return { ok: true };
}
