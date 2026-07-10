import Link from "next/link";
import type { Metadata } from "next";
import { checkTokenValid } from "@/lib/verification";
import { VERIFICATION_ERROR_KEY } from "@/lib/verification-errors";
import { getT } from "@/lib/i18n/server";
import { AuthShell } from "@/components/AuthShell";
import { VerifyEmailForm } from "@/components/VerifyEmailForm";

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

  const check = await checkTokenValid(email, token);

  return (
    <AuthShell subtitle={t("auth.verifyTitle")}>
      {check.ok ? (
        <VerifyEmailForm email={email} token={token} />
      ) : (
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
