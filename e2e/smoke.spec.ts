import { randomInt } from "node:crypto";
import { test, expect, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

/**
 * Post-deploy smoke: the shortest path a real user walks on their first day.
 *
 * It exists because of two bugs that reached production and were found by a
 * human, not by CI: every server action on /dzis threw 500 (a type re-exported
 * from a "use server" module), and email delivery was dead for everyone but the
 * owner. Both are invisible to `tsc` and to any test that stops at the unit
 * boundary, and both would have failed this file on the first step that touched
 * them. So the assertions below are deliberately end-to-end and deliberately
 * suspicious: any 5xx and any uncaught page error fails the run, wherever it
 * happens, even if the click that caused it appeared to work.
 *
 * Not covered, on purpose: the 5-step onboarding wizard. This test skips it by
 * flipping onboardingComplete (see below) — it is its own surface and deserves
 * its own spec rather than being smuggled into this one.
 */

const prisma = new PrismaClient();

// The suite creates and deletes users. Fail closed rather than discover in the
// morning that it ran against production: .env.local must name the endpoint it
// is allowed to touch, and DATABASE_URL must actually point there.
const EXPECTED_DB_HOST = process.env.E2E_EXPECT_DB_HOST;

const email = `e2e-smoke-${Date.now()}@example.com`;
const password = "SmokeTest123!";
const INTENTION = "Ship the smoke test";
const TODO = "Buy milk";

/**
 * A fresh client IP per run, drawn from the range reserved for benchmarking
 * (RFC 2544, 198.18.0.0/15) — never routable, so it can never be a real client.
 *
 * The auth budgets are keyed per IP and live in Redis, so they are durable and
 * shared across runs. Locally there is no `x-forwarded-for`, so every caller
 * collapses into the single UNKNOWN_IP bucket and the fourth run of this suite in
 * an hour would be refused by the signup limit (3/h) — a failure that says nothing
 * about the code under test. On Vercel the edge sets this header on every request
 * and each user gets their own bucket; this reproduces that rather than working
 * around the limiter.
 *
 * The address must come from a space big enough that two runs never collide: an
 * earlier version cycled through 253 addresses and started failing intermittently
 * once a run reused an hour-old address that had already spent its budget.
 */
const RUN_IP = `198.18.${randomInt(0, 256)}.${randomInt(1, 255)}`;

test.use({ extraHTTPHeaders: { "x-forwarded-for": RUN_IP } });

test.beforeAll(async () => {
  if (!EXPECTED_DB_HOST) {
    throw new Error(
      "E2E_EXPECT_DB_HOST is not set. This suite writes and deletes rows — set it in " +
        ".env.local to the host of the dev-testing Neon branch, and it will refuse to run " +
        "against anything else."
    );
  }
  const actual = new URL(process.env.DATABASE_URL ?? "postgres://unset/").host;
  if (!actual.startsWith(EXPECTED_DB_HOST)) {
    throw new Error(
      `Refusing to run: DATABASE_URL points at "${actual}", not the expected ` +
        `"${EXPECTED_DB_HOST}". Destructive tests belong on the dev-testing branch only.`
    );
  }

  // A run killed mid-flight (Ctrl-C, a closed pipe) never reaches afterAll and
  // leaves its account behind. Sweep anything this suite created earlier so the
  // dev branch does not silently accumulate them.
  const stale = await prisma.user.findMany({
    where: { email: { startsWith: "e2e-smoke-" } },
    select: { email: true },
  });
  if (stale.length) {
    await prisma.user.deleteMany({ where: { email: { startsWith: "e2e-smoke-" } } });
    await prisma.verificationToken.deleteMany({
      where: { identifier: { startsWith: "e2e-smoke-" } },
    });
    console.log(`[smoke] swept ${stale.length} account(s) left by an interrupted run`);
  }
});

test.afterAll(async () => {
  // Always, even if an assertion blew up half way — a failed run must not leave
  // an account behind for the next one to trip over.
  await prisma.user.deleteMany({ where: { email } });
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.$disconnect();
});

/**
 * A page that treats any 5xx or uncaught exception as a test failure, whenever it
 * happens. Server actions are the reason: a failing action can leave the UI looking
 * untouched, so asserting only on what is visible would have missed the 500s.
 */
function watchForFailures(page: Page): string[] {
  const failures: string[] = [];
  page.on("response", (res) => {
    if (res.status() >= 500) failures.push(`${res.status()} ${res.request().method()} ${res.url()}`);
  });
  page.on("pageerror", (err) => failures.push(`uncaught: ${err.message}`));
  return failures;
}

test("first day: register, verify, write the day, log out", async ({ page, context }) => {
  const failures = watchForFailures(page);

  // English is the default, but a stale cookie in a reused profile would silently
  // change every string this test asserts on.
  await context.addCookies([
    { name: "locale", value: "en", url: "http://localhost:3000" },
  ]);

  await test.step("register", async () => {
    await page.goto("/register");
    await page.fill('input[autocomplete="name"]', "Smoke Test");
    await page.fill('input[autocomplete="email"]', email);
    const pw = page.locator('input[autocomplete="new-password"]');
    await pw.nth(0).fill(password);
    await pw.nth(1).fill(password);
    await page.click('button[type="submit"]');

    // Registration signs in and heads for /dzis; the root layout diverts a brand
    // new account into the wizard. Landing anywhere else means auth broke.
    await page.waitForURL(/\/onboarding/);
  });

  await test.step("skip the onboarding wizard (not this test's subject)", async () => {
    await prisma.user.update({ where: { email }, data: { onboardingComplete: true } });
  });

  await test.step("the unverified banner is up", async () => {
    await page.goto("/dzis");
    await expect(page.getByText("Your email address is not verified.")).toBeVisible();
  });

  await test.step("save the day's intention", async () => {
    await page.getByLabel("Day's intention").fill(INTENTION);
    await page.getByRole("button", { name: "Save morning entry" }).click();
    await expect(page.getByText("Saved ✓")).toBeVisible();

    // The UI says saved; the database is what decides.
    const entry = await prisma.dayEntry.findFirst({
      where: { user: { email } },
      select: { morningIntent: true },
    });
    expect(entry?.morningIntent).toBe(INTENTION);
  });

  await test.step("add a todo and tick it off", async () => {
    // Scoped to the card that owns the task input: /dzis has more than one "Add"
    // button (notes has one too), and more than one <li>.
    const todoCard = page.locator("section").filter({ has: page.getByLabel("Task text") });

    await todoCard.getByLabel("Task text").fill(TODO);
    await todoCard.getByRole("button", { name: "Add", exact: true }).click();

    const row = todoCard.locator("li").filter({ hasText: TODO });
    await expect(row).toBeVisible();
    await row.getByRole("checkbox").check();

    // Todos are not their own table — they live as JSON on the day's DayEntry row
    // (see src/lib/todos.ts). Poll: the tick fires a server action, so the write
    // lands slightly after the checkbox paints.
    await expect
      .poll(async () => {
        const entry = await prisma.dayEntry.findFirst({
          where: { user: { email } },
          select: { todosJson: true },
        });
        const todos: Array<{ title: string; done: boolean }> = JSON.parse(entry?.todosJson ?? "[]");
        return todos.find((t) => t.title === TODO)?.done;
      })
      .toBe(true);
  });

  await test.step("verify the email address", async () => {
    // Read the token the app just issued, exactly as the link in the inbox carries it.
    const row = await prisma.verificationToken.findFirst({ where: { identifier: email } });
    expect(row, "registration must issue a verification token").not.toBeNull();

    await page.goto(`/verify-email?token=${row!.token}&email=${encodeURIComponent(email)}`);

    // Survives a client-side navigation, dies on a document reload. This is the
    // whole proof that the banner clears without the user pressing F5.
    await page.evaluate(() => {
      (window as unknown as { __noReload?: string }).__noReload = "alive";
    });

    await page.getByRole("button", { name: "Confirm email" }).click();
    await page.waitForURL(/\/dzis/);

    const survived = await page.evaluate(
      () => (window as unknown as { __noReload?: string }).__noReload
    );
    expect(survived, "the app must land on /dzis without reloading the document").toBe("alive");
    await expect(page.getByText("Your email address is not verified.")).toHaveCount(0);
  });

  await test.step("settings shows the address as verified", async () => {
    await page.goto("/settings");
    await expect(page.getByText("Email verified")).toBeVisible();
  });

  await test.step("log out", async () => {
    // The user menu is a native <details>; the button only exists once it is open.
    await page.locator("summary").first().click();
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL(/\/login/);
  });

  expect(failures, "no 5xx and no uncaught errors anywhere in the run").toEqual([]);
});
