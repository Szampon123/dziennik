"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";

/** Email + password sign-in. On success the browser lands on the Dziś screen. */
export function CredentialsLoginForm() {
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
        setError("Nieprawidłowy e-mail lub hasło.");
      } else if (res?.ok) {
        window.location.href = "/";
      } else {
        setError("Nie udało się zalogować. Spróbuj ponownie.");
      }
    });
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
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        autoComplete="current-password"
        required
        className={inputClass}
      />
      <button type="submit" disabled={isPending} className={buttonClass("primary", "w-full")}>
        {isPending ? "Logowanie…" : "Zaloguj się"}
      </button>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </form>
  );
}
