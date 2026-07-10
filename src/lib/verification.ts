// E-mail verification for credentials accounts, built on the VerificationToken
// model Auth.js already defines. Google accounts arrive with emailVerified
// already set, so they never pass through here.
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { resolveBaseUrl } from "@/lib/base-url";

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

  return sendEmail({
    to: email,
    subject: "Potwierdź swój adres e-mail — Dziennik",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Witaj w Dzienniku!</h2>
        <p>Kliknij poniższy link, aby potwierdzić swój adres e-mail:</p>
        <p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px;">
            Potwierdź e-mail
          </a>
        </p>
        <p style="color: #666; font-size: 13px;">
          Link wygasa za ${VERIFICATION_EXPIRY_HOURS} godzin. Jeśli nie zakładałeś konta w Dzienniku, zignoruj tę wiadomość.
        </p>
      </div>
    `,
  });
}

const INVALID_TOKEN_ERROR = "Nieprawidłowy lub wygasły link weryfikacyjny.";
const EXPIRED_TOKEN_ERROR = "Link weryfikacyjny wygasł. Zaloguj się i poproś o nowy link.";

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
): Promise<{ ok: true } | { ok: false; error: string }> {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
    select: { expires: true },
  });

  if (!record) return { ok: false, error: INVALID_TOKEN_ERROR };
  // Deliberately not deleted here — this function must never write.
  if (record.expires < new Date()) return { ok: false, error: EXPIRED_TOKEN_ERROR };
  return { ok: true };
}

/**
 * Consume a verification token: if it exists and is still valid, mark the
 * address as verified and delete the token. Expired tokens are deleted too.
 */
export async function verifyEmailToken(
  email: string,
  token: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const where = { identifier_token: { identifier: email, token } };
  const record = await prisma.verificationToken.findUnique({ where });

  if (!record) {
    return { ok: false, error: INVALID_TOKEN_ERROR };
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where });
    return { ok: false, error: EXPIRED_TOKEN_ERROR };
  }

  // updateMany, not update: the account may have been deleted since the token
  // was issued, and `update` would throw rather than report zero rows.
  const [updated] = await prisma.$transaction([
    prisma.user.updateMany({ where: { email }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.delete({ where }),
  ]);

  if (updated.count === 0) {
    return { ok: false, error: "Nie znaleziono konta dla tego adresu e-mail." };
  }

  return { ok: true };
}
