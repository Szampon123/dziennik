import type { Metadata } from "next";
import Link from "next/link";
import { getT } from "@/lib/i18n/server";
import { checkResetTokenValid } from "@/lib/password-reset";
import { RESET_ERROR_KEY } from "@/lib/password-reset-errors";
import { AuthShell } from "@/components/AuthShell";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nowe hasło",
  robots: { index: false, follow: false },
};

// Next 16: searchParams is a Promise and must be awaited.
type Props = { searchParams: Promise<{ token?: string }> };

/**
 * Rendering only *inspects* the token — mail scanners and link prefetchers hit
 * this URL before the user does, and a GET that spent the token would burn the
 * link before it was ever clicked. Only the form's server action spends it.
 *
 * No signed-in redirect here: a user whose session survived on another device
 * must still be able to complete a reset from the emailed link.
 */
export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const { t } = await getT();

  if (!token) {
    return (
      <AuthShell subtitle={t("auth.resetPassword")}>
        <p className="text-center text-danger">{t("auth.resetInvalidLink")}</p>
        <Link
          href="/forgot-password"
          className="block text-center text-sm text-violet-600 hover:underline"
        >
          {t("auth.forgotPassword")}
        </Link>
      </AuthShell>
    );
  }

  const check = await checkResetTokenValid(token);

  return (
    <AuthShell subtitle={t("auth.resetPassword")}>
      {check.ok ? (
        <ResetPasswordForm token={token} />
      ) : (
        <>
          <p className="text-center text-danger">{t(RESET_ERROR_KEY[check.error])}</p>
          <Link
            href="/forgot-password"
            className="block text-center text-sm text-violet-600 hover:underline"
          >
            {t("auth.forgotPassword")}
          </Link>
        </>
      )}
    </AuthShell>
  );
}
