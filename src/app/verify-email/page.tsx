import Link from "next/link";
import { checkTokenValid } from "@/lib/verification";
import { AuthShell } from "@/components/AuthShell";
import { VerifyEmailForm } from "@/components/VerifyEmailForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Weryfikacja e-mail — Dziennik" };

type Props = { searchParams: Promise<{ token?: string; email?: string }> };

/**
 * Rendering this page only *inspects* the token — mail scanners and link
 * prefetchers hit it before the user does, and a GET that consumed the token
 * would burn the link before it was ever clicked. The button posts a server
 * action that spends it.
 */
export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return (
      <AuthShell subtitle="Weryfikacja e-mail">
        <p className="text-danger text-center">Brak wymaganych parametrów w linku.</p>
        <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
          Przejdź do logowania
        </Link>
      </AuthShell>
    );
  }

  const check = await checkTokenValid(email, token);

  return (
    <AuthShell subtitle="Weryfikacja e-mail">
      {check.ok ? (
        <VerifyEmailForm email={email} token={token} />
      ) : (
        <>
          <p className="text-danger text-center">{check.error}</p>
          <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
            Przejdź do logowania
          </Link>
        </>
      )}
    </AuthShell>
  );
}
