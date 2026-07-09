"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { sendVerificationEmail, verifyEmailToken } from "@/lib/verification";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Consume the token from a verification link. Public on purpose — the user
 * clicks this straight from their inbox, usually signed out. Possession of an
 * unguessable 32-byte token is the only credential, so the call is rate-limited
 * per IP to keep it from being ground against.
 */
export async function confirmEmailVerification(input: {
  email: string;
  token: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  // Trim only, no case folding: the token row is keyed on the exact address the
  // link carries, and checkTokenValid() on the page must resolve the same row.
  const email = typeof input?.email === "string" ? input.email.trim() : "";
  const token = typeof input?.token === "string" ? input.token.trim() : "";
  if (!email || !token) {
    return { ok: false, error: "Nieprawidłowy lub wygasły link weryfikacyjny." };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`verify:confirm:${ip}`, 10, 60 * 60).allowed) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj ponownie za godzinę." };
  }

  return verifyEmailToken(email, token);
}

/** Re-send the verification link to the signed-in user's own address. */
export async function resendVerificationEmail(): Promise<{ ok: boolean; error?: string }> {
  const userId = await requireUserId();

  if (!rateLimit(`verify:resend:${userId}`, 3, 60 * 60).allowed) {
    return { ok: false, error: "Zbyt wiele prób. Spróbuj ponownie za godzinę." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, emailVerified: true },
  });

  if (!user?.email) return { ok: false, error: "Brak adresu e-mail." };
  if (user.emailVerified) return { ok: true }; // already verified — nothing to do

  const sent = await sendVerificationEmail(user.email);
  if (!sent) return { ok: false, error: "Nie udało się wysłać e-maila. Spróbuj ponownie." };

  return { ok: true };
}
