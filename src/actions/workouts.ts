"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { isValidDayKey } from "@/lib/dates";
import { recomputeAutoMilestones } from "@/lib/milestone-engine";

export type WorkoutResult =
  | { ok: true; newLevels: number[] }
  | { ok: false; error: string };

const addSchema = z.object({
  activitySlug: z.string().min(1),
  date: z.string().refine(isValidDayKey, "Nieprawidłowa data"),
  distanceKm: z.number().positive("Dystans musi być większy od zera").max(500, "Dystans jest nierealny"),
  durationMin: z.number().positive("Czas musi być większy od zera").max(1440, "Czas jest nierealny"),
  isRace: z.boolean().default(false),
  note: z.string().trim().max(500, "Notatka jest za długa").optional(),
});

export async function addWorkout(input: z.input<typeof addSchema>): Promise<WorkoutResult> {
  const userId = await requireUserId();
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const { activitySlug, date, distanceKm, durationMin, isRace, note } = parsed.data;

  const activity = await prisma.activity.findUnique({ where: { slug: activitySlug } });
  if (!activity) {
    return { ok: false, error: "Nie znaleziono aktywności." };
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
    return { ok: false, error: "Nie znaleziono treningu." };
  }

  await prisma.workout.delete({ where: { id } });
  await recomputeAutoMilestones(userId, workout.activity.id);

  revalidatePath("/activities");
  revalidatePath(`/activities/${workout.activity.slug}`);
  return { ok: true, newLevels: [] };
}
