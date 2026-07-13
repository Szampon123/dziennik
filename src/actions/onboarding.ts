"use server";

// Each step persists on its own, rather than everything landing on "Finish".
// A user who closes the tab at step 3 keeps their activity picks: onboarding-
// Complete is still false, so they re-enter the wizard, and it repopulates from
// what is already in the database.
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { createHabit } from "@/actions/habits";
import { ONBOARDING_SLUGS } from "@/lib/onboarding-activities";
import {
  normalizeDuduColor,
  normalizeDuduConfig,
  normalizeDuduName,
  serializeDuduConfig,
} from "@/lib/dudu";
import type { ActionResult } from "@/lib/action-errors";

/**
 * Step 2. Replaces the user's picks with `slugs`, so going back a step and
 * unticking something actually unticks it.
 *
 * Selections are stored as FavoriteActivity rows — the model the activities
 * page already uses to pin favourites. No new table: a second "selected
 * activities" concept would drift from the first the moment either changed.
 */
export async function saveOnboardingActivities(slugs: string[]): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = z.array(z.string()).max(50).safeParse(slugs);
  if (!parsed.success) return { ok: false, error: "Invalid selection." };

  // Only slugs the wizard actually offers. A crafted request must not be able
  // to favourite arbitrary rows, or to name a slug that no longer exists.
  const allowed = parsed.data.filter((s) => ONBOARDING_SLUGS.includes(s));

  const activities = await prisma.activity.findMany({
    where: { slug: { in: allowed } },
    select: { id: true },
  });
  const activityIds = activities.map((a) => a.id);

  await prisma.$transaction([
    // Scoped to the wizard's own slugs: a returning user may have favourited
    // something else in the app, and re-running step 2 must not wipe it.
    prisma.favoriteActivity.deleteMany({
      where: {
        userId,
        activity: { slug: { in: [...ONBOARDING_SLUGS] } },
      },
    }),
    prisma.favoriteActivity.createMany({
      data: activityIds.map((activityId) => ({ userId, activityId })),
      skipDuplicates: true,
    }),
  ]);

  revalidatePath("/activities");
  return { ok: true };
}

const habitSchema = z.object({
  name: z.string().trim().min(1).max(100),
  targetPerWeek: z.number().int().min(1).max(7),
  color: z.string(),
});

/**
 * Step 3. Delegates to the app's own createHabit(), which owns sortOrder,
 * colour normalisation and revalidation — this must not grow a second, subtly
 * different way to make a habit.
 */
export async function saveOnboardingHabit(
  input: z.input<typeof habitSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = habitSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Give the habit a name." };

  // Idempotent across a refresh: re-running the step must not leave two copies
  // of the same habit behind.
  const existing = await prisma.habit.findFirst({
    where: { userId, name: parsed.data.name, archivedAt: null },
    select: { id: true },
  });
  if (existing) {
    await prisma.habit.update({
      where: { id: existing.id },
      data: { targetPerWeek: parsed.data.targetPerWeek },
    });
    return { ok: true };
  }

  return createHabit(parsed.data.name, parsed.data.targetPerWeek, parsed.data.color);
}

const duduSchema = z.object({
  name: z.string().optional(),
  color: z.string().optional(),
  config: z.record(z.string(), z.string()).optional(),
});

/**
 * Step 4. The column is `duduConfigJson`, a JSON *string* — writing a raw object
 * to a `duduConfig` field would not compile, and writing unvalidated JSON would
 * let an unknown accessory id through to the renderer.
 */
export async function saveOnboardingDudu(
  input: z.input<typeof duduSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();

  const parsed = duduSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid companion settings." };
  const { name, color, config } = parsed.data;

  await prisma.user.update({
    where: { id: userId },
    data: {
      // normalizeDuduName returns null for a blank name, which is the "no name
      // chosen" state the rest of the app expects — so it is written as-is.
      ...(name !== undefined && { duduName: normalizeDuduName(name) }),
      ...(color !== undefined && { duduColor: normalizeDuduColor(color) }),
      ...(config !== undefined && {
        duduConfigJson: serializeDuduConfig(normalizeDuduConfig(config)),
      }),
    },
  });

  revalidatePath("/dudu");
  return { ok: true };
}

/**
 * Ends the wizard — from the last step, or from "Skip setup" at any point.
 * Nobody gets trapped in here.
 */
export async function completeOnboarding(): Promise<ActionResult> {
  const userId = await requireUserId();

  await prisma.user.update({
    where: { id: userId },
    data: { onboardingComplete: true },
  });

  revalidatePath("/dzis");
  return { ok: true };
}
