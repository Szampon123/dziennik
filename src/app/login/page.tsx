import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, isDevLoginEnabled, isGoogleLoginConfigured } from "@/lib/auth";
import { getSessionUserId } from "@/lib/session";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";
import { CredentialsLoginForm } from "@/components/CredentialsLoginForm";
import { AuthShell } from "@/components/AuthShell";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Existence-verified check (not raw auth()): a stale JWT whose user row was
  // deleted must land here, not bounce back to "/" in a redirect loop.
  const userId = await getSessionUserId();
  if (userId) redirect("/");

  const googleReady = isGoogleLoginConfigured();
  const devLogin = isDevLoginEnabled();

  return (
    <AuthShell
      subtitle="Osobisty dziennik dnia — intencje, notatki, refleksje."
      footer="Każdy użytkownik ma własny dziennik oraz własne połączenia Google Calendar i Notion."
    >
      {googleReady && (
          <>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/" });
              }}
            >
              <button type="submit" className={buttonClass("secondary", "w-full")}>
                Zaloguj się przez Google
              </button>
            </form>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-neutral-200" />
              <span className="text-[13px] text-neutral-400">lub e-mailem</span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
          </>
        )}

        <CredentialsLoginForm />

        <p className="text-center text-[13px] text-neutral-600">
          Nie masz konta?{" "}
          <Link href="/register" className="font-medium text-violet-600 hover:underline">
            Zarejestruj się
          </Link>
        </p>

        {devLogin && (
          <form
            action={async (formData: FormData) => {
              "use server";
              await signIn("dev-login", {
                email: formData.get("email"),
                redirectTo: "/",
              });
            }}
            className="flex flex-col gap-2 border-t border-neutral-200 pt-3"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-warning">
              Dev login (tylko środowisko deweloperskie)
            </p>
            <input
              type="email"
              name="email"
              required
              placeholder="adres@testowy.pl"
              className={inputClass}
            />
            <button type="submit" className={buttonClass("secondary")}>
              Wejdź jako użytkownik testowy
            </button>
          </form>
        )}
    </AuthShell>
  );
}
