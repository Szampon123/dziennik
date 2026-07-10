// Populates a *throwaway* database with the demo account the landing-page
// screenshots are captured from. Never point this at production: it deletes and
// recreates demo@vincendio.com and everything hanging off it.
//
// Run after `prisma migrate deploy` and the standard `prisma db seed` (which
// creates the 138 activities and their 99-level ladders — this script only adds
// per-user rows on top).
//
//   DATABASE_URL=... DIRECT_URL=... node scripts/demo-seed.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL = "demo@vincendio.com";
const NAME = "Alex";

/** Deterministic PRNG, so re-running the seed reproduces the same screenshots. */
function makeRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}
const rand = makeRandom(20260710);

function dayKey(daysAgo) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ---------------------------------------------------------------- activities

// Levels are cumulative: a ladder shows level N complete only if it is checked,
// so we mark 1..N to render as "someone who has climbed this far".
const PROGRESS = [
  { slug: "bieganie", level: 14 },
  { slug: "pianino", level: 7 },
  { slug: "kuchnia-wloska", level: 4 },
  { slug: "fotografia", level: 9 },
  { slug: "szachy", level: 6 },
];

const HABITS = [
  { name: "Morning meditation", targetPerWeek: 5, color: "violet", adherence: 0.8 },
  { name: "Read 30 minutes", targetPerWeek: 6, color: "azure", adherence: 0.7 },
  { name: "Drink 2L water", targetPerWeek: 7, color: "green", adherence: 0.9 },
  { name: "No phone before 9am", targetPerWeek: 5, color: "amber", adherence: 0.6 },
];

const INTENTIONS = [
  "Finish the long run without checking pace.",
  "One hour at the piano before anything else.",
  "Cook dinner from scratch, no shortcuts.",
  "Ship the draft, then step away from the screen.",
  "Walk to the studio and shoot in daylight.",
  "Play one slow game, think three moves ahead.",
  "Read on the balcony instead of scrolling.",
  "Stretch properly after the run.",
  "Call Mum before the day gets away.",
  "Say no to the meeting that has no agenda.",
  "Practise scales, badly, on purpose.",
  "Photograph the market before it gets busy.",
  "Leave the phone in the other room until nine.",
  "Make the ragù and let it sit for hours.",
];

const NOTES = [
  "Legs felt heavy for the first kilometre, then fine.",
  "Nailed the left-hand pattern at last.",
  "The dough needed ten more minutes than the recipe said.",
  "Golden hour lasted about four minutes today.",
  "Lost to the engine, but saw the fork coming.",
  "Slept badly; still ran.",
  "Bought basil. Forgot garlic.",
  "Rewrote the opening paragraph three times.",
  "New shoes — no blisters yet.",
  "Read forty pages without touching the phone.",
];

const PRIORITIES = [
  ["Long run", "Piano: 30 min", "Groceries"],
  ["Draft the proposal", "Stretch", "Read"],
  ["Cook properly", "Chess puzzle", "Early night"],
  ["Shoot in the park", "Edit five frames", "Water the plants"],
];

async function main() {
  const activityCount = await prisma.activity.count();
  if (activityCount === 0) {
    throw new Error("No activities — run `npx prisma db seed` before this script.");
  }

  // Idempotent: cascade wipes the demo user's milestones, habits, entries.
  await prisma.user.deleteMany({ where: { email: EMAIL } });

  const user = await prisma.user.create({
    data: {
      email: EMAIL,
      name: NAME,
      // Verified, or every screenshot carries the "confirm your e-mail" banner.
      emailVerified: new Date(),
      // Onboarding done, or every app page redirects to the setup wizard.
      onboardingComplete: true,
      role: "user",
      duduName: "Kiko",
      duduColor: "violet",
      duduConfigJson: JSON.stringify({
        hat: "beanie",
        glasses: "round",
        outfit: "scarf",
        item: "book",
        background: "rays",
      }),
      // The calendar and now/next widgets read live Google Calendar. With no
      // OAuth token they render a "not connected" empty state, which is not
      // what a marketing screenshot should show — so they are hidden rather
      // than faked.
      dashboardJson: JSON.stringify({
        order: ["dayOverview", "morning", "todos", "notes", "quote", "close", "calendar", "nowNext"],
        hidden: ["calendar", "nowNext"],
      }),
    },
  });

  // ---- activity ladders ----
  let milestonesMarked = 0;
  for (const { slug, level } of PROGRESS) {
    const activity = await prisma.activity.findUnique({ where: { slug } });
    if (!activity) throw new Error(`activity "${slug}" missing from the seed`);

    const milestones = await prisma.milestone.findMany({
      where: { activityId: activity.id, level: { lte: level } },
      select: { id: true, level: true },
    });

    await prisma.userMilestone.createMany({
      data: milestones.map((m) => ({
        userId: user.id,
        milestoneId: m.id,
        source: "manual",
        // Spread the completions backwards so the ladder does not look like it
        // was all ticked in one sitting.
        completedAt: new Date(Date.now() - (level - m.level + 1) * 3 * 24 * 60 * 60 * 1000),
      })),
    });
    milestonesMarked += milestones.length;
  }

  // ---- training log for the running ladder ----
  // Without these the activity page shows a "No saved workouts" empty state,
  // which is the one weak spot in an otherwise full screenshot.
  const running = await prisma.activity.findUnique({ where: { slug: "bieganie" } });
  const RUNS = [
    { daysAgo: 2, distanceKm: 12.4, durationMin: 63, note: "Long run, negative split." },
    { daysAgo: 4, distanceKm: 5.0, durationMin: 24, isRace: true, note: "Parkrun PB." },
    { daysAgo: 6, distanceKm: 8.1, durationMin: 44 },
    { daysAgo: 9, distanceKm: 6.0, durationMin: 33, note: "Easy, legs heavy." },
    { daysAgo: 12, distanceKm: 10.2, durationMin: 55 },
    { daysAgo: 16, distanceKm: 5.5, durationMin: 29 },
  ];
  await prisma.workout.createMany({
    data: RUNS.map((r) => ({
      userId: user.id,
      activityId: running.id,
      date: dayKey(r.daysAgo),
      distanceKm: r.distanceKm,
      durationMin: r.durationMin,
      isRace: r.isRace ?? false,
      note: r.note ?? null,
    })),
  });

  // ---- habits ----
  for (const [i, h] of HABITS.entries()) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: h.name,
        sortOrder: i,
        targetPerWeek: h.targetPerWeek,
        color: h.color,
      },
    });

    // 75 days, not 30: the tracker grid shows one calendar month at a time, so
    // a run seeded only 30 days back leaves the current month mostly blank
    // whenever "today" falls early in it. This covers the previous two months
    // fully as well.
    const checks = [];
    for (let d = 0; d < 75; d++) {
      if (rand() < h.adherence) {
        checks.push({ userId: user.id, habitId: habit.id, date: dayKey(d) });
      }
    }
    await prisma.habitCheck.createMany({ data: checks, skipDuplicates: true });
  }

  // ---- day entries ----
  const ratings = [4, 5, 3, 4, 4, 5, 4, 3, 4, 5, 4, 4, 3, 4];
  const energies = [4, 4, 3, 5, 4, 4, 3, 3, 5, 4, 4, 5, 3, 4];

  for (let d = 0; d < 14; d++) {
    const isToday = d === 0;
    const priorities = PRIORITIES[d % PRIORITIES.length];

    const entry = await prisma.dayEntry.create({
      data: {
        userId: user.id,
        date: dayKey(d),
        morningIntent: INTENTIONS[d % INTENTIONS.length],
        prioritiesJson: JSON.stringify(priorities),
        prioritiesDoneJson: JSON.stringify(
          isToday ? [true, false, false] : priorities.map(() => rand() > 0.25)
        ),
        todosJson: JSON.stringify([
          { id: `t${d}a`, title: "Long run — 12 km", time: "07:30", done: !isToday },
          { id: `t${d}b`, title: "Piano practice", time: "18:00", done: !isToday && rand() > 0.3 },
          { id: `t${d}c`, title: "Read before bed", time: null, done: !isToday && rand() > 0.4 },
        ]),
        // Today stays open — that is what a real dashboard looks like at noon —
        // but it carries a rating and an energy level, or the two tiles at the
        // top of the dashboard render as empty dashes in the screenshot.
        status: isToday ? "open" : "closed",
        dayRating: ratings[d],
        energyLevel: energies[d],
        reflectionGood: isToday ? null : "Got out the door before the excuses started.",
        reflectionBad: isToday ? null : "Too much screen time after dinner.",
      },
    });

    const noteCount = isToday ? 2 : 1 + Math.floor(rand() * 2);
    await prisma.note.createMany({
      data: Array.from({ length: noteCount }, (_, n) => ({
        dayEntryId: entry.id,
        content: NOTES[(d * 2 + n) % NOTES.length],
        type: "log",
      })),
    });
  }

  // ---- a few favourites, so the quote panel shows a filled heart ----
  // Ids come from the static library in src/lib/quotes.ts, not a table.
  await prisma.favoriteQuote.createMany({
    data: ["per-aspera-ad-astra", "carpe-diem"].map((quoteId) => ({ userId: user.id, quoteId })),
    skipDuplicates: true,
  });

  const habitChecks = await prisma.habitCheck.count({ where: { userId: user.id } });
  console.log(`demo user: ${EMAIL} (${user.id})`);
  console.log(`  milestones completed: ${milestonesMarked}`);
  console.log(`  habits: ${HABITS.length}, checks: ${habitChecks}`);
  console.log(`  day entries: 14 (today open)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
