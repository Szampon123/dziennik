import Link from "next/link";
import { verifyEmailToken } from "@/lib/verification";
import { AuthShell } from "@/components/AuthShell";

export const dynamic = "force-dynamic";

export const metadata = { title: "Weryfikacja e-mail — Dziennik" };

type Props = { searchParams: Promise<{ token?: string; email?: string }> };

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

  const result = await verifyEmailToken(email, token);

  return (
    <AuthShell subtitle="Weryfikacja e-mail">
      {result.ok ? (
        <>
          <p className="text-success text-center font-medium">Adres e-mail został potwierdzony!</p>
          <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
            Zaloguj się
          </Link>
        </>
      ) : (
        <>
          <p className="text-danger text-center">{result.error}</p>
          <Link href="/login" className="block text-center text-sm text-violet-600 hover:underline">
            Przejdź do logowania
          </Link>
        </>
      )}
    </AuthShell>
  );
}
