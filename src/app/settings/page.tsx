import Link from "next/link";
import type { Metadata } from "next";
import { requireUserId } from "@/lib/session";
import { auth } from "@/lib/auth";
import { getGoogleStatus } from "@/lib/google";
import { getNotionStatus } from "@/lib/notion";
import { Card } from "@/components/Card";
import { GoogleSettings } from "@/components/GoogleSettings";
import { NotionSettings } from "@/components/NotionSettings";
import { ThemeSegmented } from "@/components/ThemeSegmented";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

// Behind the auth proxy: a signed-out crawler is redirected away, so this page
// must never be indexed. noindex takes the place of a canonical — a canonical
// would only assert that this URL duplicates another one.
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    title: t("page.settings.title"),
    robots: { index: false, follow: false },
  };
}

import type { MessageKey } from "@/lib/i18n/messages";

const GOOGLE_BANNERS: Record<string, { key: MessageKey; tone: "ok" | "error" }> = {
  connected: { key: "settings.googleConnected", tone: "ok" },
  error: { key: "settings.googleFailed", tone: "error" },
  not_configured: { key: "settings.googleNoKeys", tone: "error" },
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>;
}) {
  const userId = await requireUserId();
  const [{ google: googleParam }, session, googleStatus, notionStatus, { t }] = await Promise.all([
    searchParams,
    auth(),
    getGoogleStatus(userId),
    getNotionStatus(userId),
    getT(),
  ]);
  const banner = googleParam ? GOOGLE_BANNERS[googleParam] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
        {t("page.settings.title")}
      </h1>

      {banner && (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            banner.tone === "ok"
              ? "border-success/40 bg-success-bg text-success"
              : "border-danger-border bg-danger-bg text-danger"
          }`}
        >
          {t(banner.key)}
        </p>
      )}

      <Card title={t("settings.account.title")} subtitle={t("settings.account.subtitle")}>
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-azure-500 text-base font-semibold text-white shadow-[0_2px_8px_-3px_rgba(110,86,207,0.5)]"
          >
            {(session?.user?.email ?? session?.user?.name ?? "?").charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">
              {session?.user?.email ?? session?.user?.name ?? "—"}
            </p>
            <p className="text-[13px] text-neutral-500">{t("settings.account.loggedIn")}</p>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-neutral-500">{t("settings.account.privacy")}</p>
      </Card>

      <Card title={t("settings.google.title")} subtitle={t("settings.google.subtitle")}>
        <GoogleSettings status={googleStatus} />
      </Card>

      <Card title={t("settings.notion.title")} subtitle={t("settings.notion.subtitle")}>
        <NotionSettings status={notionStatus} />
      </Card>

      <Card title={t("settings.appearance.title")} subtitle={t("settings.appearance.subtitle")}>
        <ThemeSegmented />
      </Card>

      <Card title={t("settings.language.title")} subtitle={t("settings.language.subtitle")}>
        <LocaleSwitcher />
      </Card>

      {/* The policy is otherwise only linked from the landing footer, which a
          signed-in user never sees. */}
      <p className="text-center text-[13px] text-neutral-500">
        <Link href="/privacy" className="hover:text-violet-600 hover:underline">
          {t("settings.privacyPolicy")}
        </Link>
      </p>
    </div>
  );
}
