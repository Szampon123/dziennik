import type { Metadata } from "next";
import { signOut } from "@/lib/auth";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("page.suspended.title") };
}

// Reachable without a session (see PUBLIC_PATHS in src/proxy.ts) — the proxy
// sends every suspended user here, and this is the only page they can open.
export default async function SuspendedPage() {
  const { t } = await getT();

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">{t("page.suspended.title")}</h1>
        <p className="text-muted mb-6">{t("auth.suspendedBody")}</p>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="text-primary underline">
            {t("user.logout")}
          </button>
        </form>
      </div>
    </div>
  );
}
