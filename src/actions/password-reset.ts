"use server";

// Both actions here are deliberately PUBLIC — no requireUserId(). Someone who
// has forgotten their password is by definition signed out, so an auth gate
// would make the feature unreachable. Possession of an unguessable 32-byte
// token is the only credential, exactly as in confirmEmailVerification()
// (src/actions/verification.ts), so both are rate-limited instead.
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail, actionEmailHtml } from "@/lib/email";
import { rateLimitPersistent } from "@/lib/rate-limit-redis";
import { clientIp } from "@/lib/client-ip";
import { resolveBaseUrl } from "@/lib/base-url";
import { getT } from "@/lib/i18n/server";
import type { ResetFailure } from "@/lib/password-reset-errors";
import {
  createPasswordResetToken,
  resetPasswordWithToken,
  resetUrl,
  RESET_EXPIRY_HOURS,
} from "@/lib/password-reset";

export type RequestResetResult = { ok: true } | { ok: false; error: "rate" };
export type ResetResult = { ok: true } | { ok: false; error: ResetFailure };

/**
 * Mail a reset link, if the address belongs to an account with a password.
 *
 * Always reports success. A "no such user" answer would turn this form into an
 * account-existence oracle, so an unknown address, a Google-only account (no
 * passwordHash to reset) and a real credentials account are indistinguishable
 * from the outside — only the real one gets an email.
 *
 * The rate-limit rejection is keyed on the *submitted* address, so it fires
 * identically whether or not that account exists and leaks nothing either.
 */
export async function requestPasswordReset(email: string): Promise<RequestResetResult> {
  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalized) return { ok: true };

  if (!(await rateLimitPersistent(`reset:request:email:${normalized}`, 3, 60 * 60)).allowed) {
    return { ok: false, error: "rate" };
  }
  if (!(await rateLimitPersistent(`reset:request:ip:${clientIp(await headers())}`, 10, 60 * 60)).allowed) {
    return { ok: false, error: "rate" };
  }

  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { id: true, passwordHash: true },
  });

  // Google-only accounts have no password to reset; sending them a link would
  // let a reset *create* a password on an account the requester doesn't own.
  if (!user?.passwordHash) return { ok: true };

  const rawToken = await createPasswordResetToken(user.id);
  const url = resetUrl(resolveBaseUrl(), rawToken);

  // The requester's own locale — they are the one reading the mail.
  const { t } = await getT();

  await sendEmail({
    to: normalized,
    subject: t("auth.resetEmailSubject"),
    html: actionEmailHtml({
      url,
      body: t("auth.resetEmailBody"),
      button: t("auth.resetEmailButton"),
      expiry: t("auth.resetEmailExpiry", { hours: RESET_EXPIRY_HOURS }),
    }),
  });

  // Note the send result is not surfaced: "we couldn't email you" would also
  // confirm the address exists. Failures are logged by sendEmail().
  return { ok: true };
}

/** Spend a reset token and set the new password. Rate-limited per IP so the
 * token space cannot be ground against. */
export async function resetPassword(token: string, password: string): Promise<ResetResult> {
  const rawToken = typeof token === "string" ? token.trim() : "";
  const newPassword = typeof password === "string" ? password : "";
  if (!rawToken) return { ok: false, error: "invalid" };

  if (!(await rateLimitPersistent(`reset:confirm:ip:${clientIp(await headers())}`, 10, 60 * 60)).allowed) {
    return { ok: false, error: "rate" };
  }

  return resetPasswordWithToken(rawToken, newPassword);
}
