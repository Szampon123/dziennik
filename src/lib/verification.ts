// E-mail verification for credentials accounts, built on the VerificationToken
// model Auth.js already defines. Google accounts arrive with emailVerified
// already set, so they never pass through here.
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, actionEmailHtml } from "@/lib/email";
import { resolveBaseUrl } from "@/lib/base-url";
import { getT } from "@/lib/i18n/server";
import type { VerificationErrorCode } from "@/lib/verification-errors";

const VERIFICATION_EXPIRY_HOURS = 24;

/**
 * Issue a fresh verification token for `email` and mail the link. Any pending
 * token for that address is dropped first, so only the newest link works.
 */
export async function sendVerificationEmail(email: string): Promise<boolean> {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  await prisma.verificationToken.create({ data: { identifier: email, token, expires } });

  const verifyUrl = `${resolveBaseUrl()}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  // The locale of the request that triggered the send — registration, an email
  // change, or a "resend link" click. In every case the person reading the mail
  // is the one who just used the site.
  const { t } = await getT();

  return sendEmail({
    to: email,
    subject: t("auth.verifyEmailSubject"),
    html: actionEmailHtml({
      url: verifyUrl,
      body: t("auth.verifyEmailBody"),
      button: t("auth.verifyEmailButton"),
      expiry: t("auth.verifyEmailExpiry", { hours: VERIFICATION_EXPIRY_HOURS }),
    }),
  });
}

/**
 * Read-only check that a token exists and has not expired. Consumes nothing,
 * so it is safe to run while merely *rendering* the /verify-email page: mail
 * scanners and link prefetchers (Gmail, Outlook Safe Links, corporate proxies)
 * fetch that URL before the human ever sees it. The token is only spent by
 * verifyEmailToken(), behind an explicit button press.
 */
export async function checkTokenValid(
  email: string,
  token: string
): Promise<{ ok: true } | { ok: false; error: VerificationErrorCode }> {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
    select: { expires: true },
  });

  if (!record) return { ok: false, error: "invalid" };
  // Deliberately not deleted here — this function must never write.
  if (record.expires < new Date()) return { ok: false, error: "expired" };
  return { ok: true };
}

/**
 * Consume a verification token: if it exists and is still valid, mark the
 * address as verified and delete the token. Expired tokens are deleted too.
 */
export async function verifyEmailToken(
  email: string,
  token: string
): Promise<{ ok: true } | { ok: false; error: VerificationErrorCode }> {
  const where = { identifier_token: { identifier: email, token } };
  const record = await prisma.verificationToken.findUnique({ where });

  if (!record) {
    return { ok: false, error: "invalid" };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where });
    return { ok: false, error: "expired" };
  }

  // updateMany, not update: the account may have been deleted since the token
  // was issued, and `update` would throw rather than report zero rows.
  const [updated] = await prisma.$transaction([
    prisma.user.updateMany({ where: { email }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.delete({ where }),
  ]);

  if (updated.count === 0) {
    return { ok: false, error: "noAccount" };
  }

  return { ok: true };
}
