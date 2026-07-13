"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import type { ActionResult } from "@/lib/action-errors";

const schema = z.object({
  activitySlug: z.string().min(1),
  favorite: z.boolean(),
});

export async function setFavorite(input: z.input<typeof schema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return fail("errors.badRequest");
  }
  const { activitySlug, favorite } = parsed.data;

  const activity = await prisma.activity.findUnique({ where: { slug: activitySlug } });
  if (!activity) {
    return fail("errors.activityNotFound");
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
