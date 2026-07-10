"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { registerAccount } from "@/actions/account";
import { useT } from "@/components/i18n/I18nProvider";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";

const MIN_PASSWORD = 8; // authoritative check is server-side (src/lib/passwords.ts)

/** Create an email+password account, then sign in and land on the Dziś screen. */
export function RegisterForm() {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD) {
      setError(t("auth.passwordMinLength"));
      return;
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError(t("auth.passwordComplexity"));
      return;
    }
    if (password !== confirm) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }
    startTransition(async () => {
      const res = await registerAccount({ name, email, password });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      const signRes = await signIn("credentials", { email, password, redirect: false });
      if (signRes?.ok) {
        window.location.href = "/dzis";
      } else {
        setError(t("auth.accountCreatedLoginFailed"));
      }
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("auth.namePlaceholder")}
        autoComplete="name"
        className={inputClass}
      />
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
        placeholder={t("auth.newPasswordHint", { min: MIN_PASSWORD })}
        autoComplete="new-password"
        required
        className={inputClass}
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder={t("auth.repeatPassword")}
        autoComplete="new-password"
        required
        className={inputClass}
      />
      <button type="submit" disabled={isPending} className={buttonClass("primary", "w-full")}>
        {isPending ? t("auth.creatingAccount") : t("auth.createAccount")}
      </button>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </form>
  );
}
