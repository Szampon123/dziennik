"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import { isValidDayKey } from "@/lib/dates";
import { recomputeAutoMilestones } from "@/lib/milestone-engine";

export type WorkoutResult =
  | { ok: true; newLevels: number[] }
  | { ok: false; error: string };

const addSchema = z.object({
  activitySlug: z.string().min(1),
  date: z.string().refine(isValidDayKey, "errors.invalidDate"),
  distanceKm: z.number().positive("errors.distancePositive").max(500, "errors.distanceUnrealistic"),
  durationMin: z.number().positive("errors.durationPositive").max(1440, "errors.durationUnrealistic"),
  isRace: z.boolean().default(false),
  note: z.string().trim().max(500, "errors.noteTooLong").optional(),
});

export async function addWorkout(input: z.input<typeof addSchema>): Promise<WorkoutResult> {
  const userId = await requireUserId();
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error));
  }
  const { activitySlug, date, distanceKm, durationMin, isRace, note } = parsed.data;

  const activity = await prisma.activity.findUnique({ where: { slug: activitySlug } });
  if (!activity) {
    return fail("errors.activityNotFound");
  }

  await prisma.workout.create({
    data: { userId, activityId: activity.id, date, distanceKm, durationMin, isRace, note: note || null },
  });

  const newLevels = await recomputeAutoMilestones(userId, activity.id);

  revalidatePath("/activities");
  revalidatePath(`/activities/${activitySlug}`);
  return { ok: true, newLevels };
}

export async function deleteWorkout(id: string): Promise<WorkoutResult> {
  const userId = await requireUserId();
  const workout = await prisma.workout.findUnique({
    where: { id },
    include: { activity: { select: { id: true, slug: true } } },
  });
  // Ownership check: never touch another user's workouts.
  if (!workout || workout.userId !== userId) {
    return fail("errors.workoutNotFound");
  }

  await prisma.workout.delete({ where: { id } });
  await recomputeAutoMilestones(userId, workout.activity.id);

  revalidatePath("/activities");
  revalidatePath(`/activities/${workout.activity.slug}`);
  return { ok: true, newLevels: [] };
}
