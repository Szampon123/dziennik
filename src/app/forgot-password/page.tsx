import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { getT } from "@/lib/i18n/server";
import { AuthShell } from "@/components/AuthShell";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const dynamic = "force-dynamic";

// Reachable while signed out (see PUBLIC_PATHS in src/proxy.ts) but not worth
// indexing — it is a form, not content.
export const metadata: Metadata = {
  title: "Reset hasła",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  // Already signed in? Then this page has nothing to offer — change the
  // password in Settings instead.
  const userId = await getSessionUserId();
  if (userId) redirect("/");

  const { t } = await getT();

  return (
    <AuthShell subtitle={t("auth.forgotPasswordIntro")}>
      <ForgotPasswordForm />
    </AuthShell>
  );
}
