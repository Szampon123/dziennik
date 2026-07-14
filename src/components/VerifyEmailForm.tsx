"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { confirmEmailVerification } from "@/actions/verification";
import { VERIFICATION_ERROR_KEY } from "@/lib/verification-errors";
import { useT } from "@/components/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import { buttonClass } from "@/components/ui/Button";

/**
 * The token is spent here, on an explicit click — never while the page renders.
 * Mail scanners that prefetch the link only trigger the read-only check behind it.
 *
 * `returnToApp` is set when the clicker is already signed in as the address being
 * verified. They have no reason to see "sign in" — they are in — and the banner
 * they came here to get rid of lives on every app page, so they go straight to
 * /dzis. The action revalidated the root layout, so it re-renders on arrival and
 * the banner is gone without a manual reload.
 */
export function VerifyEmailForm({
  email,
  token,
  returnToApp = false,
}: {
  email: string;
  token: string;
  returnToApp?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const [done, setDone] = useState(false);
  const [errorKey, setErrorKey] = useState<MessageKey | null>(null);
  const [isPending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      setErrorKey(null);
      const res = await confirmEmailVerification({ email, token });
      if (res.ok) {
        setDone(true);
        if (returnToApp) {
          // replace, not push: the spent link is a dead end, and Back should not
          // return them to a token that no longer verifies anything.
          router.replace("/dzis");
        }
      } else {
        setErrorKey(
          res.error === "rate" ? "auth.verifyTooManyRequests" : VERIFICATION_ERROR_KEY[res.error]
        );
      }
    });
  }

  if (done) {
    return (
      <>
        <p className="text-success text-center font-medium">{t("auth.verifyConfirmed")}</p>
        {returnToApp ? (
          <p className="text-center text-sm text-neutral-500">{t("auth.verifyRedirecting")}</p>
        ) : (
          <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
            {t("auth.verifySignIn")}
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      <p className="text-center text-sm text-neutral-600">
        {t("auth.verifyConfirmPrompt")}
        <span className="mt-1 block font-medium text-neutral-800">{email}</span>
      </p>
      <button
        onClick={confirm}
        disabled={isPending}
        className={buttonClass("primary", "w-full")}
      >
        {isPending ? t("auth.verifyConfirming") : t("auth.verifyEmailButton")}
      </button>
      {errorKey && (
        <>
          <p className="text-danger text-center text-[13px]">{t(errorKey)}</p>
          <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
            {t("auth.backToLogin")}
          </Link>
        </>
      )}
    </>
  );
}
