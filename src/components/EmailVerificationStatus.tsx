"use client";

import { useState, useTransition } from "react";
import { resendVerificationEmail } from "@/actions/verification";
import { useT } from "@/components/i18n/I18nProvider";
import { RESEND_ERROR_KEY } from "@/lib/resend-errors";
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * Verification state of the account's address, in the settings card.
 *
 * The layout banner only appears while the address is unconfirmed, so it can
 * never answer "is my email verified?" in the affirmative — its absence is the
 * only signal, and absence is not something a user goes looking for. This says
 * it either way, in the one place they would think to check.
 */
export function EmailVerificationStatus({ verified }: { verified: boolean }) {
  const t = useT();
  const [sent, setSent] = useState(false);
  const [errorKey, setErrorKey] = useState<MessageKey | null>(null);
  const [isPending, startTransition] = useTransition();

  function resend() {
    startTransition(async () => {
      setErrorKey(null);
      const res = await resendVerificationEmail();
      if (res.ok) {
        setSent(true);
      } else {
        setErrorKey(RESEND_ERROR_KEY[res.error]);
      }
    });
  }

  if (verified) {
    return (
      <p className="border-success/40 bg-success-bg text-success mt-3 flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium">
        <span aria-hidden>✓</span>
        {t("settings.account.emailVerified")}
      </p>
    );
  }

  return (
    <div className="border-warning/40 bg-warning-bg text-warning mt-3 rounded-lg border px-3 py-2 text-[13px]">
      <p className="font-medium">{t("settings.account.emailUnverified")}</p>
      {sent ? (
        <p className="text-success mt-1">{t("auth.verifyBannerSent")}</p>
      ) : (
        <button
          onClick={resend}
          disabled={isPending}
          className="mt-1 font-medium underline hover:no-underline disabled:opacity-60"
        >
          {isPending ? t("auth.verifyBannerSending") : t("auth.verifyBannerResend")}
        </button>
      )}
      {errorKey && <p className="text-danger mt-1">{t(errorKey)}</p>}
    </div>
  );
}
