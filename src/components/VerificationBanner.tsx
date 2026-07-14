"use client";

import { useState, useTransition } from "react";
import { resendVerificationEmail } from "@/actions/verification";
import { useT } from "@/components/i18n/I18nProvider";
import { RESEND_ERROR_KEY } from "@/lib/resend-errors";
import type { MessageKey } from "@/lib/i18n/messages";

/** Soft reminder for credentials accounts with an unconfirmed address. */
export function VerificationBanner() {
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

  if (sent) {
    return (
      <div className="border-success/40 bg-success-bg text-success border-b px-4 py-2 text-center text-sm">
        {t("auth.verifyBannerSent")}
      </div>
    );
  }

  return (
    <div className="border-warning/40 bg-warning-bg text-warning border-b px-4 py-2 text-center text-sm">
      {t("auth.verifyBannerUnverified")}{" "}
      <button
        onClick={resend}
        disabled={isPending}
        className="font-medium underline hover:no-underline"
      >
        {isPending ? t("auth.verifyBannerSending") : t("auth.verifyBannerResend")}
      </button>
      {errorKey && <span className="text-danger ml-2">{t(errorKey)}</span>}
    </div>
  );
}
