"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { sendVerificationEmail, verifyEmailToken } from "@/lib/verification";
import { revalidatePath } from "next/cache";
import { rateLimitPersistent } from "@/lib/rate-limit-redis";
import { clientIp } from "@/lib/client-ip";
import type { VerificationErrorCode } from "@/lib/verification-errors";
// Imported, never re-exported: 179cefc showed that a type re-exported from a
// "use server" module survives the transform as a runtime identifier and throws
// ReferenceError. Consumers import it from lib/resend-errors directly.
import type { ResendFailure } from "@/lib/resend-errors";

/**
 * Consume the token from a verification link. Public on purpose — the user
 * clicks this straight from their inbox, usually signed out. Possession of an
 * unguessable 32-byte token is the only credential, so the call is rate-limited
 * per IP to keep it from being ground against.
 */
export async function confirmEmailVerification(input: {
  email: string;
  token: string;
}): Promise<{ ok: true } | { ok: false; error: VerificationErrorCode | "rate" }> {
  // Trim only, no case folding: the token row is keyed on the exact address the
  // link carries, and checkTokenValid() on the page must resolve the same row.
  const email = typeof input?.email === "string" ? input.email.trim() : "";
  const token = typeof input?.token === "string" ? input.token.trim() : "";
  if (!email || !token) {
    return { ok: false, error: "invalid" };
  }

  const ip = clientIp(await headers());
  if (!(await rateLimitPersistent(`verify:confirm:${ip}`, 10, 60 * 60)).allowed) {
    return { ok: false, error: "rate" };
  }

  const result = await verifyEmailToken(email, token);

  // The banner is rendered by the root layout from a fresh emailVerified read, so
  // the stale thing after a successful confirm is the cached layout, not the row.
  // "layout" from "/" purges the client Router Cache as well: without it the next
  // navigation would replay the cached RSC payload and the banner would survive
  // until a manual reload.
  if (result.ok) {
    revalidatePath("/", "layout");
  }

  return result;
}

/** Re-send the verification link to the signed-in user's own address. */
export async function resendVerificationEmail(): Promise<
  { ok: true } | { ok: false; error: ResendFailure }
> {
  const userId = await requireUserId();

  if (!(await rateLimitPersistent(`verify:resend:${userId}`, 3, 60 * 60)).allowed) {
    return { ok: false, error: "rate" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true },
  });

  if (!user?.email) return { ok: false, error: "noEmail" };
  if (user.emailVerified) return { ok: true }; // already verified — nothing to do

  const sent = await sendVerificationEmail(user.email);
  if (!sent.ok) {
    return { ok: false, error: sent.permanent ? "misconfigured" : "sendFailed" };
  }

  return { ok: true };
}
