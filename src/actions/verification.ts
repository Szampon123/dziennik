"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { sendVerificationEmail } from "@/lib/verification";
import { rateLimit } from "@/lib/rate-limit";

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
