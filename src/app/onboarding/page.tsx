import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { ONBOARDING_SLUGS } from "@/lib/onboarding-activities";
import { normalizeDuduColor, normalizeDuduConfig } from "@/lib/dudu";
import { normalizeHabitColor } from "@/lib/habit-colors";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const dynamic = "force-dynamic";

/**
 * Repopulates the wizard from whatever a previous, abandoned run already wrote.
 * `onboardingComplete` stays false until the final step, so a user who closed
 * the tab lands back here with their picks intact rather than a blank slate.
 *
 * requireUserId() gates the page: /onboarding is not in PUBLIC_PATHS, so the
 * proxy has already bounced anonymous visitors to /login — this is the
 * defence-in-depth the rest of the app uses.
 */
export default async function OnboardingPage() {
  const userId = await requireUserId();

  const [user, activities, favorites, habit] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        duduName: true,
        duduColor: true,
        duduConfigJson: true,
        onboardingComplete: true,
      },
    }),
    prisma.activity.findMany({
      where: { slug: { in: [...ONBOARDING_SLUGS] } },
      select: { slug: true, name: true, category: true },
    }),
    prisma.favoriteActivity.findMany({
      where: { userId, activity: { slug: { in: [...ONBOARDING_SLUGS] } } },
      select: { activity: { select: { slug: true } } },
    }),
    prisma.habit.findFirst({
      where: { userId, archivedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { name: true, targetPerWeek: true, color: true },
    }),
  ]);

  if (!user) redirect("/login");
  // Already done. Nothing here for them, and the root layout would not have
  // redirected them in — they reached this URL by hand.
  if (user.onboardingComplete) redirect("/dzis");

  // Google gives a full name; a credentials account may have none. Fall back to
  // the email's local part, then to a greeting that still reads as a sentence.
  const displayName = user.name?.trim() || user.email?.split("@")[0] || "there";

  const config = normalizeDuduConfig(user.duduConfigJson);

  return (
    <OnboardingWizard
      initial={{
        displayName,
        activities,
        selectedSlugs: favorites.map((f) => f.activity.slug),
        habit: habit
          ? {
              name: habit.name,
              targetPerWeek: habit.targetPerWeek,
              color: normalizeHabitColor(habit.color),
            }
          : null,
        existingHabitName: habit?.name ?? null,
        dudu: {
          name: user.duduName ?? "",
          color: normalizeDuduColor(user.duduColor),
          hat: config.hat,
          item: config.item,
        },
      }}
    />
  );
}
