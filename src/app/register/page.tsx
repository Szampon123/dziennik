import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { getT } from "@/lib/i18n/server";
import { RegisterForm } from "@/components/RegisterForm";
import { AuthShell } from "@/components/AuthShell";

export const dynamic = "force-dynamic";

// One of the two pages a signed-out crawler can actually reach, so it carries a
// real canonical rather than the noindex the gated pages use.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("page.register.title"),
    description: t("page.register.description"),
    alternates: { canonical: "/register" },
  };
}

export default async function RegisterPage() {
  const userId = await getSessionUserId();
  if (userId) redirect("/dzis");

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
