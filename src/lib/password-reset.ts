// "Forgot password" tokens. Mirrors src/lib/verification.ts, with two
// differences that matter:
//
//  1. Only the SHA-256 *hash* of the token reaches the database. A verification
//     token at worst confirms an address; a reset token takes over the account,
//     so a leaked table dump must not be usable. The raw value exists only in
//     the email.
//  2. A spent token is marked (usedAt) rather than deleted, so a second click
//     can be told "already used" instead of the misleading "invalid or expired".
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordStrength } from "@/lib/passwords";
import type { ResetErrorCode } from "@/lib/password-reset-errors";

export const RESET_EXPIRY_HOURS = 1;

/** SHA-256 is right here where bcrypt is not: the input is already 32 random
 * bytes, so there is nothing to slow down a guesser — and lookup must be a
 * single indexed equality check, not a scan-and-compare over every row. */
function hashToken(raw: string): string {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * Issue a reset token for `userId` and return the raw value to email. Any
 * outstanding token for that user is dropped first, so only the newest link
 * works — clicking "forgot password" twice must not leave two live links.
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { userId } });
  await prisma.passwordResetToken.create({
    data: { token: hashToken(rawToken), userId, expiresAt },
  });

  return rawToken;
}

/**
 * Spend a reset token: validate it, then write the new password hash and mark
 * the token used in one transaction — a crash between the two would otherwise
 * leave a live link to an account whose password had already changed.
 */
export async function resetPasswordWithToken(
  rawToken: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: ResetErrorCode }> {
  // Complexity is enforced here, not only in the browser: a reset must not be
  // a way to downgrade to a weaker password than registration accepts.
  if (!validatePasswordStrength(password).valid) {
    return { ok: false, error: "weak" };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashToken(rawToken) },
    select: { id: true, userId: true, expiresAt: true, usedAt: true },
  });

  if (!record) return { ok: false, error: "invalid" };
  if (record.usedAt) return { ok: false, error: "used" };
  if (record.expiresAt < new Date()) return { ok: false, error: "expired" };

  // Hashed before the transaction: bcrypt costs ~100ms, and holding a row lock
  // across it would serialise unrelated resets.
  const passwordHash = await hashPassword(password);

  // Spend the token *first*, and only write the password if this request is the
  // one that spent it. The checks above are a read, so two requests carrying
  // the same token can both pass them; `usedAt: null` in the WHERE is what
  // actually decides between them. Under READ COMMITTED the loser blocks on the
  // row lock, re-evaluates the predicate after the winner commits, and matches
  // zero rows — so it aborts here rather than overwriting the winner's password
  // with its own.
  const spent = await prisma.$transaction(async (tx) => {
    const marked = await tx.passwordResetToken.updateMany({
      where: { id: record.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (marked.count === 0) return false;

    await tx.user.update({
      where: { id: record.userId },
      data: {
        passwordHash,
        // Kills every session opened with the old password — see the cut-off
        // check in the jwt callback (src/lib/auth.ts). Without this, whoever
        // prompted the reset keeps their existing cookie.
        //
        // Always write this through Prisma. `sessionsValidFrom` is a
        // `timestamp without time zone`, so a raw SQL `now()` stores local
        // wall-clock in it and Prisma reads that straight back as UTC — a
        // cut-off in the future, locking every user out (including on fresh
        // sign-ins) for the length of the UTC offset.
        sessionsValidFrom: new Date(),
      },
    });
    return true;
  });

  if (!spent) return { ok: false, error: "used" };
  return { ok: true };
}

/**
 * Read-only validity check, for *rendering* the reset form. Consumes nothing:
 * mail scanners and link prefetchers (Gmail, Outlook Safe Links, corporate
 * proxies) fetch the URL before the human ever sees it, and a GET that spent
 * the token would burn the link. Same reasoning as checkTokenValid() in
 * src/lib/verification.ts.
 */
export async function checkResetTokenValid(
  rawToken: string
): Promise<{ ok: true } | { ok: false; error: ResetErrorCode }> {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token: hashToken(rawToken) },
    select: { expiresAt: true, usedAt: true },
  });

  if (!record) return { ok: false, error: "invalid" };
  if (record.usedAt) return { ok: false, error: "used" };
  if (record.expiresAt < new Date()) return { ok: false, error: "expired" };
  return { ok: true };
}

/** The link that goes in the email. */
export function resetUrl(baseUrl: string, rawToken: string): string {
  return `${baseUrl}/reset-password?token=${rawToken}`;
}
