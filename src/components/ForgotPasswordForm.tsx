"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/password-reset";
import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";

/**
 * Ask for a reset link. The success panel is shown for *any* accepted address,
 * existing or not — the action deliberately cannot tell us which, so that this
 * form is not an account-existence oracle.
 */
export function ForgotPasswordForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    startTransition(async () => {
      setError("");
      const res = await requestPasswordReset(email);
      if (res.ok) setSent(true);
      else setError(t("auth.resetTooManyRequests"));
    });
  }

  if (sent) {
    return (
      <>
        <p className="text-center text-sm text-neutral-700">{t("auth.resetEmailSent")}</p>
        <Link
          href="/login"
          className="block text-center text-sm font-medium text-violet-600 hover:underline"
        >
          {t("auth.backToLogin")}
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        autoComplete="email"
        required
        className={inputClass}
      />
      <button type="submit" disabled={isPending} className={buttonClass("primary", "w-full")}>
        {isPending ? t("common.loading") : t("auth.sendResetLink")}
      </button>
      {error && <p className="text-[13px] text-danger">{error}</p>}
      <Link
        href="/login"
        className="mt-1 block text-center text-[13px] text-neutral-600 hover:underline"
      >
        {t("auth.backToLogin")}
      </Link>
    </form>
  );
}
