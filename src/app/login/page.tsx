import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, isDevLoginEnabled, isGoogleLoginConfigured } from "@/lib/auth";
import { getSessionUserId } from "@/lib/session";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";
import { CredentialsLoginForm } from "@/components/CredentialsLoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // Existence-verified check (not raw auth()): a stale JWT whose user row was
  // deleted must land here, not bounce back to "/" in a redirect loop.
  const userId = await getSessionUserId();
  if (userId) redirect("/");

  const googleReady = isGoogleLoginConfigured();
  const devLogin = isDevLoginEnabled();

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-16">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-violet-600" />
          <h1 className="text-[28px] font-bold tracking-[-0.5px] text-neutral-900">Dziennik</h1>
        </div>
        <p className="mt-2 text-sm text-neutral-600">
          Osobisty dziennik dnia — intencje, notatki, refleksje.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-card">
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
      </div>

      <p className="text-center text-[13px] text-neutral-500">
        Każdy użytkownik ma własny dziennik oraz własne połączenia Google Calendar i Notion.
      </p>
    </div>
  );
}
