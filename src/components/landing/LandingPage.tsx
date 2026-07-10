import { HeroSection } from "./HeroSection";
import { StatsBar } from "./StatsBar";
import { FeatureSection, type FeatureAccent } from "./FeatureSection";
import { DuduSection } from "./DuduSection";
import { HowItWorks } from "./HowItWorks";
import { FinalCTA } from "./FinalCTA";
import { LandingFooter } from "./LandingFooter";

// Literal hex, matching the light-theme values in globals.css. HABIT_COLORS
// stores `var(--success)` and friends, which flip inside .dark — the landing
// page must not.
const HABIT_DOTS = [
  { color: "#16a34a", label: "Green" },
  { color: "#6e56cf", label: "Violet" },
  { color: "#0ea5e9", label: "Azure" },
  { color: "#d97706", label: "Amber" },
  { color: "#dc2626", label: "Rose" },
] as const;

const FEATURES: {
  title: string;
  body: string;
  image: { src: string; alt: string };
  imageSide: "left" | "right";
  accent: FeatureAccent;
}[] = [
  {
    title: "Master Anything, One Level at a Time",
    body:
      "From couch to marathon. From first chord to Chopin. 138 activities with hand-crafted " +
      "99-level ladders based on real progression data — not arbitrary XP.",
    image: {
      src: "/images/landing/feature-skills.png",
      alt: "The running activity at level 14 of 99, with its tier breakdown, next goals and training log.",
    },
    imageSide: "left",
    accent: {
      kind: "tags",
      items: ["Running", "Piano", "Italian Cooking", "Photography", "Chess"],
    },
  },
  {
    title: "Your Day, Organized and Reflected",
    body:
      "Morning intentions. Evening reflections. Google Calendar integration. Every day becomes " +
      "a story of progress, not just a to-do list.",
    image: {
      src: "/images/landing/feature-dashboard.png",
      alt: "The daily dashboard: day progress, rating, energy, a 13-day streak and the morning intention.",
    },
    imageSide: "right",
    accent: { kind: "tags", items: ["Journal", "Calendar", "Notion sync"] },
  },
  {
    title: "Habits That Actually Stick",
    body:
      "Weekly goals instead of daily guilt. Color-coded tracking grid. Miss Monday? Make it up " +
      "on Wednesday. Your streaks survive real life.",
    image: {
      src: "/images/landing/feature-habits.png",
      alt: "A month of habit tracking: four colour-coded habits, 84% of the monthly goal, and a daily activity chart.",
    },
    imageSide: "left",
    accent: { kind: "dots", items: HABIT_DOTS },
  },
];

/**
 * The public marketing page at "/". Rendered on a bare canvas: the root layout
 * skips the app chrome for this route (see PATHNAME_HEADER), so everything the
 * visitor sees — nav, sections, footer — is assembled here.
 *
 * English-only and theme-independent, unlike the app behind it.
 */
export function LandingPage() {
  return (
    <div className="flex-1 scroll-smooth bg-white">
      <HeroSection />
      <StatsBar />

      <div className="bg-white">
        {FEATURES.map((feature) => (
          <FeatureSection key={feature.title} {...feature} />
        ))}
      </div>

      <DuduSection />
      <HowItWorks />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
