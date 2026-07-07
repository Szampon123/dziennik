import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { RegisterForm } from "@/components/RegisterForm";
import { AuthShell } from "@/components/AuthShell";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const userId = await getSessionUserId();
  if (userId) redirect("/");

  return (
    <AuthShell
      subtitle="Załóż konto, aby prowadzić swój dziennik."
      footer="Każdy użytkownik ma własny dziennik oraz własne połączenia Google Calendar i Notion."
    >
      <RegisterForm />
      <p className="text-center text-[13px] text-neutral-600">
        Masz już konto?{" "}
        <Link href="/login" className="font-medium text-violet-600 hover:underline">
          Zaloguj się
        </Link>
      </p>
    </AuthShell>
  );
}
