// Runs `prisma db seed` during a Vercel build — but only for a production build.
//
// WHY THE GATE. Preview and Production share one DATABASE_URL in this project (both
// scopes, one variable), so a preview build talks to the *production* database. Seed
// data is the 138 activities and their 99-level ladders: unconditional seeding would
// mean that opening a pull request which rewrites a ladder pushes that ladder live,
// before anyone has reviewed it. The branch would be deciding what production says.
//
// So: production builds seed, previews do not. This is a guard, not a fix — the fix
// is to give Preview its own database (the dev-testing branch), which is a Vercel env
// change and the owner's call. Until then this keeps a preview from writing to prod.
//
// The seed is idempotent (upserts keyed on slug and (activityId, level)), so a build
// that dies half way leaves a consistent-but-mixed set of rows and the next deploy
// finishes the job. Nothing is deleted, ever.
import { spawnSync } from "node:child_process";

const env = process.env.VERCEL_ENV ?? "(not on Vercel)";

if (env !== "production") {
  console.log(`[seed] VERCEL_ENV=${env} — skipping. Only production builds seed.`);
  process.exit(0);
}

console.log("[seed] production build — seeding activities and ladders…");
const started = Date.now();

const result = spawnSync("npx", ["prisma", "db", "seed"], {
  stdio: "inherit",
  shell: true,
});

const seconds = Math.round((Date.now() - started) / 1000);

if (result.status !== 0) {
  console.error(`[seed] FAILED after ${seconds}s (exit ${result.status}).`);
  // Fail the build. A deploy that silently shipped the new code against the old
  // ladders would be the worst of both: the app promising levels the data has not got.
  process.exit(result.status ?? 1);
}

console.log(`[seed] done in ${seconds}s.`);
