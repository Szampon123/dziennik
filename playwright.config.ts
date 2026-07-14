import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

// Same trick as prisma.config.ts: Next reads .env.local by itself, this process does
// not. The smoke needs DATABASE_URL — to read the verification token the app mails,
// and to refuse to run against anything but the dev branch.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(path.join(process.cwd(), file));
  } catch {
    // Absent file: a real env var is expected to supply the URLs.
  }
}

export default defineConfig({
  testDir: "./e2e",
  // One throwaway account against one dev server: parallel workers would race on
  // the same rows and the same rate-limit budgets.
  workers: 1,
  fullyParallel: false,
  // A flaky smoke test that passes on retry is a smoke test nobody believes.
  retries: 0,
  timeout: 60_000,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    ...devices["Desktop Chrome"],
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      // Without a key sendEmail() logs the message instead of posting it to Resend.
      // The suite reads the verification token from the database, so it needs the
      // token to exist, not the mail to be delivered — and a run that actually
      // mailed a made-up @example.com address every time would burn real quota on
      // a guaranteed bounce. Real deliverability is not smoke-testable from here;
      // it is checked against production with a real inbox.
      RESEND_API_KEY: "",
    },
  },
});
