"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { normalizeRole, isAdminRole } from "@/lib/roles";
import { MAX_POST_BODY, MAX_LEVEL } from "@/lib/forum";
import type { ActionResult } from "@/actions/day-entry";

const postSchema = z.object({
  activitySlug: z.string().trim().min(1, "Nieznana umiejętność."),
  level: z
    .union([z.number(), z.string(), z.null()])
    .optional()
    .transform((v) => {
      if (v === null || v === undefined || v === "") return null;
      const n = typeof v === "number" ? v : parseInt(v, 10);
      return Number.isFinite(n) ? n : NaN;
    })
    .refine((n) => n === null || (Number.isInteger(n) && n >= 1 && n <= MAX_LEVEL), {
      message: `Poziom musi być liczbą 1–${MAX_LEVEL}.`,
    }),
  body: z
    .string()
    .trim()
    .min(1, "Napisz wiadomość.")
    .max(MAX_POST_BODY, `Wiadomość może mieć maks. ${MAX_POST_BODY} znaków.`),
});

/** Post a message into a skill's (optionally level-specific) discussion space. */
export async function createPost(input: z.input<typeof postSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { activitySlug, level, body } = parsed.data;

  const activity = await prisma.activity.findUnique({
    where: { slug: activitySlug },
    select: { slug: true },
  });
  if (!activity) return { ok: false, error: "Nieznana umiejętność." };

  await prisma.forumPost.create({ data: { userId, activitySlug, level, body } });
  revalidatePath(`/forum/${activitySlug}`);
  return { ok: true };
}

export async function deletePost(input: { id: string }): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = String(input?.id ?? "");
  if (!id) return { ok: false, error: "Nieprawidłowe żądanie." };

  const post = await prisma.forumPost.findUnique({
    where: { id },
    select: { userId: true, activitySlug: true },
  });
  if (!post) return { ok: false, error: "Wiadomość nie istnieje." };

  const isOwn = post.userId === userId;
  if (!isOwn) {
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!isAdminRole(normalizeRole(me?.role)))
      return { ok: false, error: "Brak uprawnień do usunięcia tej wiadomości." };
  }

  await prisma.forumPost.delete({ where: { id } });
  revalidatePath(`/forum/${post.activitySlug}`);
  return { ok: true };
}
