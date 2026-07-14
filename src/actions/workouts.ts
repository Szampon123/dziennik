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

// The ceilings exist to catch a typo (a 5 km run entered as 500), not to have an
// opinion about what a human can do. They were doing the second job: eight seeded
// milestones demanded efforts the form then refused to accept, so the levels could
// not be earned by logging the thing they describe.
//
//   500 km  <- cycling L96 asks for 600 km in one ride, L91 for 500.
//   1440 min (24 h) <- the crueller one, and the easier to miss. A 600 km brevet
//                      takes an amateur ~30 h; Audax allows 40. Mountain hiking
//                      L87 is literally titled "100 km, no sleep" — an effort that
//                      is over 24 h by definition. Also blocked L85/92/94/97 and
//                      SUP L94.
//
// 1000 km and 50 h clear every criterion in the seed (the longest is a 140 km
// mountain hike, ~40 h) while still being absurd as a typo.
const MAX_DISTANCE_KM = 1000;
const MAX_DURATION_MIN = 3000;

const addSchema = z.object({
  activitySlug: z.string().min(1),
  date: z.string().refine(isValidDayKey, "errors.invalidDate"),
  distanceKm: z
    .number()
    .positive("errors.distancePositive")
    .max(MAX_DISTANCE_KM, "errors.distanceUnrealistic"),
  durationMin: z
    .number()
    .positive("errors.durationPositive")
    .max(MAX_DURATION_MIN, "errors.durationUnrealistic"),
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
