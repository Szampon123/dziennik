"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import { parseCriteria, implies } from "@/lib/milestone-criteria";
import type { ActionResult } from "@/lib/action-errors";

const setSchema = z.object({
  milestoneId: z.string().min(1),
  done: z.boolean(),
  // When completing with cascade, all lower levels of the same activity are
  // marked done too (skills are cumulative).
  cascade: z.boolean().default(false),
});

export async function setMilestone(input: z.input<typeof setSchema>): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = setSchema.safeParse(input);
  if (!parsed.success) {
    return fail("errors.badRequest");
  }
  const { milestoneId, done, cascade } = parsed.data;

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    select: {
      id: true,
      level: true,
      activityId: true,
      criteriaJson: true,
      activity: { select: { slug: true } },
    },
  });
  if (!milestone) {
    return fail("errors.milestoneMissing");
  }

  if (done) {
    // Cascade checks only lower levels this claim logically proves — never
    // across dimensions (20 min of running proves nothing about kilometers).
    let targets: { id: string }[] = [{ id: milestone.id }];
    const stronger = parseCriteria(milestone.criteriaJson);
    if (cascade && stronger) {
      const lower = await prisma.milestone.findMany({
        where: { activityId: milestone.activityId, level: { lt: milestone.level } },
        select: { id: true, criteriaJson: true },
      });
      const impliedLower = lower.filter((m) => {
        const weaker = parseCriteria(m.criteriaJson);
        return weaker !== null && implies(stronger, weaker);
      });
      targets = [{ id: milestone.id }, ...impliedLower.map((m) => ({ id: m.id }))];
    }

    // createMany + skipDuplicates is unsupported on SQLite; use a transaction of upserts.
    await prisma.$transaction(
      targets.map((t) =>
        prisma.userMilestone.upsert({
          where: { userId_milestoneId: { userId, milestoneId: t.id } },
          update: {},
          create: { userId, milestoneId: t.id },
        })
      )
    );
  } else {
    await prisma.userMilestone.deleteMany({ where: { userId, milestoneId } });
  }

  revalidatePath("/activities");
  revalidatePath(`/activities/${milestone.activity.slug}`);
  return { ok: true };
}
