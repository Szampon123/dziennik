import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, isDevLoginEnabled, isGoogleLoginConfigured } from "@/lib/auth";
import { getSessionUserId } from "@/lib/session";
import { getT } from "@/lib/i18n/server";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";
import { CredentialsLoginForm } from "@/components/CredentialsLoginForm";
import { AuthShell } from "@/components/AuthShell";

export const dynamic = "force-dynamic";

// "/" redirects here for signed-out visitors, so in practice this is the page
// crawlers and link-preview scrapers land on. It inherits the Open Graph card
// from the root layout and claims its own canonical.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("page.login.title"),
    alternates: { canonical: "/login" },
  };
}

export default async function LoginPage() {
  // Existence-verified check (not raw auth()): a stale JWT whose user row was
  // deleted must land here, not bounce back to "/" in a redirect loop.
  const userId = await getSessionUserId();
  if (userId) redirect("/dzis");

  const { t } = await getT();
  const googleReady = isGoogleLoginConfigured();
  const devLogin = isDevLoginEnabled();

  return (
    <AuthShell
      subtitle={t("auth.loginSubtitle")}
      footer={t("auth.everyUserOwn")}
    >
      {googleReady && (
          <>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/dzis" });
              }}
            >
              <button type="submit" className={buttonClass("secondary", "w-full")}>
                {t("auth.googleSignIn")}
              </button>
            </form>
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-neutral-200" />
              <span className="text-[13px] text-neutral-400">{t("auth.orWithEmail")}</span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
          </>
        )}

        <CredentialsLoginForm />

        <p className="text-center text-[13px] text-neutral-600">
          {t("auth.noAccountYet")}{" "}
          <Link href="/register" className="font-medium text-violet-600 hover:underline">
            {t("auth.register")}
          </Link>
        </p>

        {devLogin && (
          <form
            action={async (formData: FormData) => {
              "use server";
              await signIn("dev-login", {
                email: formData.get("email"),
                redirectTo: "/dzis",
              });
            }}
            className="flex flex-col gap-2 border-t border-neutral-200 pt-3"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-warning">
              {t("auth.devLogin")}
            </p>
            <input
              type="email"
              name="email"
              required
              placeholder="adres@testowy.pl"
              className={inputClass}
            />
            <button type="submit" className={buttonClass("secondary")}>
              {t("auth.devLoginAs")}
            </button>
          </form>
        )}
    </AuthShell>
  );
}
