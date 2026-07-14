import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkTokenValid } from "@/lib/verification";
import { VERIFICATION_ERROR_KEY } from "@/lib/verification-errors";
import { getT } from "@/lib/i18n/server";
import { AuthShell } from "@/components/AuthShell";
import { VerifyEmailForm } from "@/components/VerifyEmailForm";
import { VerifyEmailResend } from "@/components/VerifyEmailResend";

export const dynamic = "force-dynamic";

// Not a static `metadata` export: the title follows the reader's locale, and
// the root layout's "%s — Vincendio" template supplies the suffix.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("auth.verifyTitle") };
}

type Props = { searchParams: Promise<{ token?: string; email?: string }> };

/**
 * Rendering this page only *inspects* the token — mail scanners and link
 * prefetchers hit it before the user does, and a GET that consumed the token
 * would burn the link before it was ever clicked. The button posts a server
 * action that spends it.
 */
export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token, email } = await searchParams;
  const { t } = await getT();

  if (!token || !email) {
    return (
      <AuthShell subtitle={t("auth.verifyTitle")}>
        <p className="text-danger text-center">{t("auth.verifyMissingParams")}</p>
        <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
          {t("auth.backToLogin")}
        </Link>
      </AuthShell>
    );
  }

  const [check, session] = await Promise.all([checkTokenValid(email, token), auth()]);

  // Only send them into the app if the signed-in account is the one being
  // verified. Someone signed in as A who opens B's link still gets B's address
  // confirmed — the token, not the session, is the credential — but dropping
  // them on A's /dzis with a "verified!" flash would describe the wrong account.
  const signedInAsThisAddress =
    session?.user?.email != null &&
    session.user.email.trim().toLowerCase() === email.trim().toLowerCase();

  // A dead link is the *normal* outcome for a user with more than one verification
  // mail in the thread: every send drops the previous token, so only the newest
  // link works and the older ones sit above it in Gmail. What to offer them turns
  // on a question the token cannot answer — is this address verified already? —
  // so ask the row, and only when the reader is the account in question.
  const alreadyVerified =
    !check.ok &&
    signedInAsThisAddress &&
    (await prisma.user.findUnique({
      where: { email: session!.user!.email! },
      select: { emailVerified: true },
    }))?.emailVerified != null;

  return (
    <AuthShell subtitle={t("auth.verifyTitle")}>
      {check.ok ? (
        <VerifyEmailForm email={email} token={token} returnToApp={signedInAsThisAddress} />
      ) : alreadyVerified ? (
        // They verified with a newer link and then clicked an older one. Nothing is
        // wrong, and saying "invalid link" in red would be alarming nonsense.
        <>
          <p className="text-success text-center font-medium">
            {t("auth.verifyAlreadyVerified")}
          </p>
          <Link href="/dzis" className="block text-center text-sm text-violet-600 hover:underline">
            {t("auth.verifyGoToApp")}
          </Link>
        </>
      ) : signedInAsThisAddress ? (
        // Signed in, still unverified, holding a spent link: the one person for whom
        // "send a new one" is both possible and the only useful thing on the page.
        <VerifyEmailResend />
      ) : (
        // Signed out, or signed in as somebody else — resending would mail the wrong
        // account, so the honest offer is the sign-in page.
        <>
          <p className="text-danger text-center">{t(VERIFICATION_ERROR_KEY[check.error])}</p>
          <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
            {t("auth.backToLogin")}
          </Link>
        </>
      )}
    </AuthShell>
  );
}
