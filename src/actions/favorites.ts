"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import type { ActionResult } from "@/actions/day-entry";

const schema = z.object({
  activitySlug: z.string().min(1),
  favorite: z.boolean(),
});

export async function setFavorite(input: z.input<typeof schema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Nieprawidłowe żądanie." };
  }
  const { activitySlug, favorite } = parsed.data;

  const activity = await prisma.activity.findUnique({ where: { slug: activitySlug } });
  if (!activity) {
    return { ok: false, error: "Nie znaleziono aktywności." };
  }

  if (favorite) {
    await prisma.favoriteActivity.upsert({
      where: { userId_activityId: { userId, activityId: activity.id } },
      update: {},
      create: { userId, activityId: activity.id },
    });
  } else {
    await prisma.favoriteActivity.deleteMany({ where: { userId, activityId: activity.id } });
  }

  revalidatePath("/activities");
  return { ok: true };
}
