"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { hashPassword, validatePasswordStrength } from "@/lib/passwords";
import { PASSWORD_ERROR_KEY } from "@/lib/password-errors";
import { rateLimitPersistent } from "@/lib/rate-limit-redis";
import { clientIp } from "@/lib/client-ip";
import { sendVerificationEmail } from "@/lib/verification";

export type RegisterResult = { ok: true } | { ok: false; error: string };

const schema = z.object({
  name: z.string().trim().max(80, "errors.nameTooLong").optional().default(""),
  email: z.string().trim().toLowerCase().email("errors.invalidEmail"),
  // Length and complexity are checked by validatePasswordStrength() below, so
  // that one function is the single source of truth for the password policy.
  password: z.string(),
});

/**
 * Create a new email+password account. Public (no session) — this IS the
 * registration entry point. The password is bcrypt-hashed; the email is the
 * unique identity. After this succeeds the client signs in with the same
 * credentials. New accounts get the default role ("user").
 */
export async function registerAccount(
  input: z.input<typeof schema>
): Promise<RegisterResult> {
  // Signup spam guard, keyed per caller IP (3 per hour).
  const ip = clientIp(await headers());
  if (!(await rateLimitPersistent(`register:${ip}`, 3, 60 * 60)).allowed) {
    return fail("errors.tooManyRegistrations");
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error));
  }
  const { email, password } = parsed.data;

  const pwCheck = validatePasswordStrength(password);
  if (!pwCheck.valid) {
    return fail(PASSWORD_ERROR_KEY[pwCheck.error]);
  }

  const name = parsed.data.name?.trim() || email.split("@")[0];

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return fail("errors.emailTaken");
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { email, name, passwordHash } });

  // Best-effort: a dead mail provider must not cost the user their account.
  // They can re-request the link from the banner once signed in.
  await sendVerificationEmail(email).catch((e) =>
    console.error("[REGISTER] Verification email failed:", e)
  );

  return { ok: true };
}
