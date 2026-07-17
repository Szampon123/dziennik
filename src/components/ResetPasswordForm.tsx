"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { resetPassword } from "@/actions/password-reset";
import { RESET_ERROR_KEY } from "@/lib/password-reset-errors";
import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";

const MIN_PASSWORD = 8; // authoritative check is server-side (src/lib/passwords.ts)
const REDIRECT_DELAY_MS = 2500;

/** Set a new password with the token from the emailed link. */
export function ResetPasswordForm({ token }: { token: string }) {
  const t = useT();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Let the confirmation be read before leaving; the link below is there for
  // anyone who would rather not wait.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => {
      window.location.href = "/login";
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [done]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Mirrors validatePasswordStrength() so the common mistakes are caught
    // without a round-trip. The server rejects a weak password regardless.
    if (
      password.length < MIN_PASSWORD ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    if (password !== confirm) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }

    startTransition(async () => {
      const res = await resetPassword(token, password);
      if (res.ok) setDone(true);
      else setError(t(RESET_ERROR_KEY[res.error]));
    });
  }

  if (done) {
    return (
      <>
        <p className="text-center text-sm text-neutral-600">{t("auth.resetSuccess")}</p>
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
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("auth.newPassword")}
        autoComplete="new-password"
        required
        className={inputClass}
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder={t("auth.confirmPassword")}
        autoComplete="new-password"
        required
        className={inputClass}
      />
      <button type="submit" disabled={isPending} className={buttonClass("primary", "w-full")}>
        {isPending ? t("common.saving") : t("auth.resetPassword")}
      </button>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </form>
  );
}
