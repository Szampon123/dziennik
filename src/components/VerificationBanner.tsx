"use client";

import { useState, useTransition } from "react";
import { resendVerificationEmail } from "@/actions/verification";

/** Soft reminder for credentials accounts with an unconfirmed address. */
export function VerificationBanner() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function resend() {
    startTransition(async () => {
      setError("");
      const res = await resendVerificationEmail();
      if (res.ok) {
        setSent(true);
      } else {
        setError(res.error ?? "Błąd");
      }
    });
  }

  if (sent) {
    return (
      <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-center text-sm text-emerald-800">
        Wysłano link weryfikacyjny. Sprawdź swoją skrzynkę e-mail.
      </div>
    );
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-800">
      Twój adres e-mail nie jest zweryfikowany.{" "}
      <button
        onClick={resend}
        disabled={isPending}
        className="font-medium underline hover:no-underline"
      >
        {isPending ? "Wysyłanie…" : "Wyślij link weryfikacyjny"}
      </button>
      {error && <span className="text-danger ml-2">{error}</span>}
    </div>
  );
}
