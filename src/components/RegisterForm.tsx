"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerAccount } from "@/actions/account";
import { useT } from "@/components/i18n/I18nProvider";
import { MINIMUM_AGE } from "@/lib/legal/age";
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
      <LegalConsent />
    </form>
  );
}

/**
 * "By creating an account you confirm you are at least 16, and accept the Terms
 * and the Privacy Policy."
 *
 * The age is declared here rather than only in §3 of the terms, which turns a rule
 * nobody read into a statement the user actually makes. It is still a declaration,
 * not a check — nothing verifies a date of birth, and short of identity checks
 * nothing could.
 *
 * The sentence is one message key with placeholders, not several keys glued
 * together: word order and articles differ per language, and concatenating
 * fragments produces sentences no native speaker would write. {age} is
 * interpolated by t(); {terms} and {privacy} survive it (unknown params are left
 * alone) and are split out here into real links, so a person can read what they
 * are agreeing to *before* they agree to it.
 */
function LegalConsent() {
  const t = useT();
  const label = { terms: t("auth.legalTermsLink"), privacy: t("auth.legalPrivacyLink") };
  const href = { terms: "/terms", privacy: "/privacy" } as const;

  const parts = t("auth.legalConsent", { age: MINIMUM_AGE }).split(/(\{terms\}|\{privacy\})/);

  return (
    <p className="mt-1 text-center text-[13px] leading-relaxed text-neutral-500">
      {parts.map((part, i) => {
        const key = part === "{terms}" ? "terms" : part === "{privacy}" ? "privacy" : null;
        if (!key) return <span key={i}>{part}</span>;
        return (
          <Link key={i} href={href[key]} className="text-violet-600 hover:underline">
            {label[key]}
          </Link>
        );
      })}
    </p>
  );
}
