import type { Metadata } from "next";
import { Ban } from "lucide-react";
import { signOut } from "@/lib/auth";
import { getT } from "@/lib/i18n/server";
import { buttonClass } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("page.suspended.title") };
}

// Reachable without a session (see PUBLIC_PATHS in src/proxy.ts) — the proxy
// sends every suspended user here, and this is the only page they can open.
export default async function SuspendedPage() {
  const { t } = await getT();

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md rounded-card border border-neutral-200 bg-neutral-0 p-8 text-center shadow-card">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <Ban aria-hidden className="h-6 w-6" />
        </span>
        <h1 className="text-xl font-semibold text-neutral-900">{t("page.suspended.title")}</h1>
        <p className="mt-2 text-sm text-neutral-600">{t("auth.suspendedBody")}</p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
          className="mt-6"
        >
          <button type="submit" className={buttonClass("primary")}>
            {t("user.logout")}
          </button>
        </form>
      </div>
    </div>
  );
}
