"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { confirmEmailVerification } from "@/actions/verification";
import { buttonClass } from "@/components/ui/Button";

/**
 * The token is spent here, on an explicit click — never while the page renders.
 * Mail scanners that prefetch the link only trigger the read-only check behind it.
 */
export function VerifyEmailForm({ email, token }: { email: string; token: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      setError("");
      const res = await confirmEmailVerification({ email, token });
      if (res.ok) {
        setDone(true);
      } else {
        setError(res.error);
      }
    });
  }

  if (done) {
    return (
      <>
        <p className="text-success text-center font-medium">Adres e-mail został potwierdzony!</p>
        <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
          Zaloguj się
        </Link>
      </>
    );
  }

  return (
    <>
      <p className="text-center text-sm text-neutral-600">
        Potwierdź, że ten adres e-mail należy do Ciebie:
        <span className="mt-1 block font-medium text-neutral-800">{email}</span>
      </p>
      <button
        onClick={confirm}
        disabled={isPending}
        className={buttonClass("primary", "w-full")}
      >
        {isPending ? "Potwierdzanie…" : "Potwierdź e-mail"}
      </button>
      {error && (
        <>
          <p className="text-danger text-center text-[13px]">{error}</p>
          <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
            Przejdź do logowania
          </Link>
        </>
      )}
    </>
  );
}
