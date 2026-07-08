// One-time migration: encrypt tokens that already exist in the database as
// plaintext (from before STAGE 2). After this runs, every stored token is an
// AES-256-GCM ciphertext.
//
//   Run manually:  npx tsx prisma/scripts/encrypt-existing-tokens.ts
//
// - Idempotent: rows whose value is already in the encrypt() wire format are
//   skipped, so re-running is safe.
// - Atomic: all writes happen inside one transaction — a failure rolls the
//   whole migration back, leaving the database untouched.
import { PrismaClient } from "@prisma/client";
import { encrypt, isEncrypted } from "../../src/lib/crypto";

// Standalone scripts don't get Next.js's env loading. Pull in .env (DATABASE_URL)
// and .env.local (ENCRYPTION_KEY) before constructing the client. Uses Node's
// built-in loader (Node 20.6+), typed defensively so it compiles on any
// @types/node version.
const loadEnvFile = (
  process as NodeJS.Process & { loadEnvFile?: (path?: string) => void }
).loadEnvFile;
if (loadEnvFile) {
  for (const file of [".env", ".env.local"]) {
    try {
      loadEnvFile(file);
    } catch {
      // File may not exist in this environment — ignore.
    }
  }
}

const prisma = new PrismaClient();

async function main() {
  // Fail fast with a clear error if ENCRYPTION_KEY is missing/invalid, before
  // we open a transaction.
  encrypt("healthcheck");

  await prisma.$transaction(
    async (tx) => {
      // --- OAuthToken: accessToken (required) + refreshToken (nullable) ---
      const tokens = await tx.oAuthToken.findMany();
      let oauthUpdated = 0;
      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i];
        console.log(`Migrating OAuthToken ${i + 1}/${tokens.length}...`);
        const data: { accessToken?: string; refreshToken?: string } = {};
        if (t.accessToken && !isEncrypted(t.accessToken)) {
          data.accessToken = encrypt(t.accessToken);
        }
        if (t.refreshToken && !isEncrypted(t.refreshToken)) {
          data.refreshToken = encrypt(t.refreshToken);
        }
        if (Object.keys(data).length > 0) {
          await tx.oAuthToken.update({
            where: { userId_provider: { userId: t.userId, provider: t.provider } },
            data,
          });
          oauthUpdated++;
        }
      }

      // --- User.notionToken (nullable; parentPageId stays plaintext) ---
      const users = await tx.user.findMany({ where: { notionToken: { not: null } } });
      let notionUpdated = 0;
      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        console.log(`Migrating User notionToken ${i + 1}/${users.length}...`);
        if (u.notionToken && !isEncrypted(u.notionToken)) {
          await tx.user.update({
            where: { id: u.id },
            data: { notionToken: encrypt(u.notionToken) },
          });
          notionUpdated++;
        }
      }

      console.log(
        `\nDone. OAuthToken rows encrypted: ${oauthUpdated}/${tokens.length}. ` +
          `Notion tokens encrypted: ${notionUpdated}/${users.length}.`
      );
    },
    { timeout: 60_000 }
  );
}

main()
  .catch((e) => {
    console.error("Migration failed — no changes were committed.", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
