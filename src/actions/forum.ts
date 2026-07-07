"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { normalizeRole, isAdminRole } from "@/lib/roles";
import { MAX_THREAD_TITLE, MAX_THREAD_BODY, MAX_REPLY_BODY, MAX_LEVEL } from "@/lib/forum";
import type { ActionResult } from "@/actions/day-entry";

const threadSchema = z.object({
  activitySlug: z.string().trim().min(1, "Wybierz umiejętność."),
  level: z
    .union([z.number(), z.string()])
    .optional()
    .nullable()
    .transform((v) => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "number" ? v : parseInt(v, 10);
      return Number.isFinite(n) ? n : NaN;
    })
    .refine((n) => n === null || (Number.isInteger(n) && n >= 1 && n <= MAX_LEVEL), {
      message: `Poziom musi być liczbą 1–${MAX_LEVEL}.`,
    }),
  title: z
    .string()
    .trim()
    .min(3, "Tytuł musi mieć co najmniej 3 znaki.")
    .max(MAX_THREAD_TITLE, `Tytuł może mieć maks. ${MAX_THREAD_TITLE} znaków.`),
  body: z
    .string()
    .trim()
    .min(1, "Napisz treść wątku.")
    .max(MAX_THREAD_BODY, `Treść może mieć maks. ${MAX_THREAD_BODY} znaków.`),
});

/** Create a thread and redirect to it. Returns an error result on validation failure. */
export async function createThread(input: z.input<typeof threadSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = threadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { activitySlug, level, title, body } = parsed.data;

  const activity = await prisma.activity.findUnique({
    where: { slug: activitySlug },
    select: { slug: true },
  });
  if (!activity) return { ok: false, error: "Nieznana umiejętność." };

  const thread = await prisma.forumThread.create({
    data: { userId, activitySlug, level, title, body },
    select: { id: true },
  });

  revalidatePath("/forum");
  redirect(`/forum/${thread.id}`);
}

const replySchema = z.object({
  threadId: z.string().min(1),
  body: z
    .string()
    .trim()
    .min(1, "Napisz odpowiedź.")
    .max(MAX_REPLY_BODY, `Odpowiedź może mieć maks. ${MAX_REPLY_BODY} znaków.`),
});

export async function addReply(input: z.input<typeof replySchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = replySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { threadId, body } = parsed.data;

  const thread = await prisma.forumThread.findUnique({
    where: { id: threadId },
    select: { id: true },
  });
  if (!thread) return { ok: false, error: "Wątek nie istnieje." };

  await prisma.forumReply.create({ data: { threadId, userId, body } });
  revalidatePath(`/forum/${threadId}`);
  return { ok: true };
}

/** Whether the current user may delete a post (own post, or admin/owner). */
async function canModerate(userId: string, authorId: string): Promise<boolean> {
  if (userId === authorId) return true;
  const me = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  return isAdminRole(normalizeRole(me?.role));
}

export async function deleteThread(input: { id: string }): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = String(input?.id ?? "");
  if (!id) return { ok: false, error: "Nieprawidłowe żądanie." };

  const thread = await prisma.forumThread.findUnique({ where: { id }, select: { userId: true } });
  if (!thread) return { ok: false, error: "Wątek nie istnieje." };
  if (!(await canModerate(userId, thread.userId)))
    return { ok: false, error: "Brak uprawnień do usunięcia tego wątku." };

  await prisma.forumThread.delete({ where: { id } });
  revalidatePath("/forum");
  return { ok: true };
}

export async function deleteReply(input: { id: string }): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = String(input?.id ?? "");
  if (!id) return { ok: false, error: "Nieprawidłowe żądanie." };

  const reply = await prisma.forumReply.findUnique({
    where: { id },
    select: { userId: true, threadId: true },
  });
  if (!reply) return { ok: false, error: "Odpowiedź nie istnieje." };
  if (!(await canModerate(userId, reply.userId)))
    return { ok: false, error: "Brak uprawnień do usunięcia tej odpowiedzi." };

  await prisma.forumReply.delete({ where: { id } });
  revalidatePath(`/forum/${reply.threadId}`);
  return { ok: true };
}
