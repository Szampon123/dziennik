"use client";

import { useState, useTransition } from "react";
import { resendVerificationEmail } from "@/actions/verification";
import { useT } from "@/components/i18n/I18nProvider";
import { RESEND_ERROR_KEY } from "@/lib/resend-errors";
import type { MessageKey } from "@/lib/i18n/messages";
import { buttonClass } from "@/components/ui/Button";

/**
 * The way out of a dead verification link, for someone already signed in as the
 * address it names.
 *
 * Dead links are the normal case, not the edge one: every send drops the pending
 * token for that address, so the moment a second link exists the first one stops
 * working — and both are sitting in the same Gmail thread, the older one first.
 * Offering only "back to sign in" to a user who is *already signed in* left them
 * with nothing to click.
 */
export function VerifyEmailResend() {
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
    return <p className="text-success text-center font-medium">{t("auth.verifyBannerSent")}</p>;
  }

  return (
    <>
      <p className="text-center text-sm text-neutral-600">{t("auth.verifyLinkDead")}</p>
      <button onClick={resend} disabled={isPending} className={buttonClass("primary", "w-full")}>
        {isPending ? t("auth.verifyBannerSending") : t("auth.verifyBannerResend")}
      </button>
      {errorKey && <p className="text-danger text-center text-[13px]">{t(errorKey)}</p>}
    </>
  );
}
