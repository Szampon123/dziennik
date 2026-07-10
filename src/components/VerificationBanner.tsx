"use client";

import { useState, useTransition } from "react";
import { resendVerificationEmail, type ResendFailure } from "@/actions/verification";
import { useT } from "@/components/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

const RESEND_ERROR_KEY: Record<ResendFailure, MessageKey> = {
  rate: "auth.verifyTooManyRequests",
  noEmail: "auth.verifyNoEmail",
  sendFailed: "auth.verifySendFailed",
};

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
      <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-800">
        {t("auth.verifyBannerSent")}
      </div>
    );
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
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
