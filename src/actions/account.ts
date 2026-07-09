"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from "@/lib/passwords";
import { rateLimit } from "@/lib/rate-limit";

export type RegisterResult = { ok: true } | { ok: false; error: string };

const schema = z.object({
  name: z.string().trim().max(80, "Imię jest za długie.").optional().default(""),
  email: z.string().trim().toLowerCase().email("Podaj prawidłowy adres e-mail."),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`)
    .max(MAX_PASSWORD_LENGTH, "Hasło jest za długie."),
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
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`register:${ip}`, 3, 60 * 60).allowed) {
    return { ok: false, error: "Zbyt wiele prób rejestracji. Spróbuj ponownie później." };
  }

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;
  const name = parsed.data.name?.trim() || email.split("@")[0];

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "Konto z tym adresem już istnieje. Zaloguj się." };
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { email, name, passwordHash } });

  return { ok: true };
}
