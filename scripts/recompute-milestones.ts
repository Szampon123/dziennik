/**
 * Re-evaluate every engine-owned milestone completion, and say what changed.
 *
 * WHY THIS EXISTS. The engine only ever runs when a workout is added or deleted.
 * Change a criterion in prisma/seed-data and re-seed, and nothing re-evaluates
 * anybody: the new rules sit in the database, inert, until each user happens to log
 * a workout. Worse, the change is silent — a level someone had can quietly become a
 * level they no longer qualify for, with nothing to tell them or us.
 *
 * So: after every seed change that touches criteriaJson, run this. It is a dry run
 * by default and prints a diff — who gains a level, who loses one. Pass --apply to
 * write.
 *
 *   npx tsx scripts/recompute-milestones.ts                 # show the diff
 *   npx tsx scripts/recompute-milestones.ts --apply         # write it
 *   npx tsx scripts/recompute-milestones.ts --activity bieganie
 *
 * Manual completions are not this script's business and it cannot touch them — the
 * engine only ever owns rows with source "auto" (src/lib/milestone-engine.ts).
 *
 * Environment: reads DATABASE_URL from the environment, exactly as prisma.config.ts
 * does. Point it at the dev-testing branch first. Always.
 */
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { planRecompute, recomputeAutoMilestones } from "@/lib/milestone-engine";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(path.join(process.cwd(), file));
  } catch {
    // Absent file: a real env var is expected to supply the URL.
  }
}

const prisma = new PrismaClient();

const apply = process.argv.includes("--apply");
const activityFlag = process.argv.indexOf("--activity");
const onlyActivity = activityFlag !== -1 ? process.argv[activityFlag + 1] : null;

type Change = {
  email: string;
  activity: string;
  added: number[];
  removed: number[];
};

async function main() {
  const host = new URL(process.env.DATABASE_URL ?? "postgres://unset/").host;
  console.log(`database : ${host}`);
  console.log(`mode     : ${apply ? "APPLY — this will write" : "dry run (pass --apply to write)"}`);
  if (onlyActivity) console.log(`activity : ${onlyActivity}`);
  console.log("");

  // Every (user, activity) the engine could have an opinion about: the user either
  // logged a workout there, or already holds an auto completion. The second half
  // matters — it is how an orphaned completion, whose criterion the seed just
  // dropped, gets found and taken back even though no workout remains to trigger it.
  const [workoutPairs, autoPairs] = await Promise.all([
    prisma.workout.findMany({
      where: onlyActivity ? { activity: { slug: onlyActivity } } : {},
      select: { userId: true, activityId: true },
      distinct: ["userId", "activityId"],
    }),
    prisma.userMilestone.findMany({
      where: {
        source: "auto",
        ...(onlyActivity ? { milestone: { activity: { slug: onlyActivity } } } : {}),
      },
      select: { userId: true, milestone: { select: { activityId: true } } },
    }),
  ]);

  const pairs = new Map<string, { userId: string; activityId: string }>();
  for (const w of workoutPairs) pairs.set(`${w.userId}:${w.activityId}`, w);
  for (const a of autoPairs) {
    const key = `${a.userId}:${a.milestone.activityId}`;
    pairs.set(key, { userId: a.userId, activityId: a.milestone.activityId });
  }

  if (pairs.size === 0) {
    console.log("Nothing to recompute: no workouts and no engine-owned completions.");
    return;
  }

  const [users, activities] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true } }),
    prisma.activity.findMany({ select: { id: true, slug: true } }),
  ]);
  const emailById = new Map(users.map((u) => [u.id, u.email ?? u.id]));
  const slugById = new Map(activities.map((a) => [a.id, a.slug]));

  const changes: Change[] = [];

  for (const { userId, activityId } of pairs.values()) {
    // planRecompute decides; recomputeAutoMilestones decides *and writes*. Both call
    // the same code, so what the dry run prints is what --apply does.
    const { toCreate, toDelete } = await planRecompute(userId, activityId);
    if (toCreate.length === 0 && toDelete.length === 0) continue;

    const asc = (a: number, b: number) => a - b;
    changes.push({
      email: emailById.get(userId) ?? userId,
      activity: slugById.get(activityId) ?? activityId,
      added: toCreate.map((m) => m.level).sort(asc),
      removed: toDelete.map((m) => m.level).sort(asc),
    });

    if (apply) await recomputeAutoMilestones(userId, activityId);
  }

  console.log(`checked  : ${pairs.size} user/activity pair(s)`);

  if (changes.length === 0) {
    console.log("\nNo completion changes. Every engine-owned level still matches its criterion.");
    return;
  }

  console.log(`changed  : ${changes.length} pair(s)\n`);
  let gained = 0;
  let lost = 0;
  for (const c of changes) {
    gained += c.added.length;
    lost += c.removed.length;
    console.log(`  ${c.email}  ·  ${c.activity}`);
    if (c.added.length) console.log(`    + gains  ${c.added.join(", ")}`);
    // The line that matters. Somebody is about to lose a level they had, and a
    // migration that prints only the good half is a migration nobody audited.
    if (c.removed.length) console.log(`    - LOSES  ${c.removed.join(", ")}`);
  }

  console.log(`\ntotal    : +${gained} level(s) gained, -${lost} level(s) lost`);
  if (!apply) console.log("\nNothing was written. Re-run with --apply to commit this diff.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
