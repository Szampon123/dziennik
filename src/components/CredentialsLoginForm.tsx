"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";

/** Email + password sign-in. On success the browser lands on the Dziś screen. */
export function CredentialsLoginForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    startTransition(async () => {
      setError("");
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError(t("auth.invalidCredentials"));
      } else if (res?.ok) {
        window.location.href = "/dzis";
      } else {
        setError(t("auth.loginFailed"));
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("auth.emailPlaceholder")}
        autoComplete="email"
        required
        className={inputClass}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t("auth.passwordPlaceholder")}
        autoComplete="current-password"
        required
        className={inputClass}
      />
      <Link
        href="/forgot-password"
        className="self-end text-[13px] text-neutral-600 hover:text-violet-600 hover:underline"
      >
        {t("auth.forgotPassword")}
      </Link>
      <button type="submit" disabled={isPending} className={buttonClass("primary", "w-full")}>
        {isPending ? t("auth.signingIn") : t("auth.signIn")}
      </button>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </form>
  );
}
