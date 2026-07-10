// The 22 activities the onboarding wizard offers, out of the 138 seeded ones.
//
// Every slug here is verified against prisma/seed-data/. The groups are the
// app's own category keys (src/lib/activity-categories.ts) rather than invented
// ones: there is no "Languages", "Tech" or "Mind" category in this app, and no
// language, programming or meditation activity exists to put in them.
//
// Labels are English because the wizard is; the activity *names* come from the
// database and stay Polish, like everywhere else in the app.
import type { CategoryKey } from "@/lib/activity-categories";

export type OnboardingGroup = {
  category: CategoryKey;
  /** English label for the chip row. The DB's category labels are Polish. */
  label: string;
  slugs: readonly string[];
};

export const ONBOARDING_GROUPS: readonly OnboardingGroup[] = [
  {
    category: "wytrzymalosciowe",
    label: "Endurance",
    slugs: ["bieganie", "plywanie", "jazda-na-rowerze"],
  },
  {
    category: "sila",
    label: "Strength & Body",
    slugs: ["trening-silowy", "joga", "kalistenika"],
  },
  {
    category: "instrumenty",
    label: "Music",
    slugs: ["pianino", "gra-na-gitarze", "spiew"],
  },
  {
    category: "kuchnie",
    label: "Cooking",
    slugs: ["kuchnia-wloska", "kuchnia-japonska", "kuchnia-francuska"],
  },
  {
    category: "wizualne",
    label: "Creative",
    slugs: ["rysowanie", "malarstwo", "kaligrafia"],
  },
  {
    category: "cyfrowe",
    label: "Digital",
    slugs: ["fotografia", "grafika-cyfrowa", "montaz-wideo"],
  },
  { category: "umyslowe", label: "Mind", slugs: ["szachy", "e-sport"] },
  { category: "artyzm", label: "Craft", slugs: ["pisanie", "produkcja-muzyczna"] },
] as const;

/** Flat slug list, for the single query that loads them. */
export const ONBOARDING_SLUGS: readonly string[] = ONBOARDING_GROUPS.flatMap((g) => g.slugs);
