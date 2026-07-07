import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { RegisterForm } from "@/components/RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const userId = await getSessionUserId();
  if (userId) redirect("/");

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-16">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-violet-600" />
          <h1 className="text-[28px] font-bold tracking-[-0.5px] text-neutral-900">Dziennik</h1>
        </div>
        <p className="mt-2 text-sm text-neutral-600">Załóż konto, aby prowadzić swój dziennik.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-card">
        <RegisterForm />
        <p className="text-center text-[13px] text-neutral-600">
          Masz już konto?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>

      <p className="text-center text-[13px] text-neutral-500">
        Każdy użytkownik ma własny dziennik oraz własne połączenia Google Calendar i Notion.
      </p>
    </div>
  );
}
