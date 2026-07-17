import Link from "next/link";
import type { Metadata } from "next";
import { requireUserId } from "@/lib/session";
import { auth } from "@/lib/auth";
import { getGoogleStatus } from "@/lib/google";
import { getNotionStatus } from "@/lib/notion";
import { getStravaStatus } from "@/lib/strava";
import { Card } from "@/components/Card";
import { GoogleSettings } from "@/components/GoogleSettings";
import { NotionSettings } from "@/components/NotionSettings";
import { StravaSettings } from "@/components/StravaSettings";
import { ThemeSegmented } from "@/components/ThemeSegmented";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { DeleteAccount } from "@/components/DeleteAccount";
import { EmailVerificationStatus } from "@/components/EmailVerificationStatus";
import { DataExport } from "@/components/DataExport";
import { prisma } from "@/lib/prisma";
import { normalizeRole } from "@/lib/roles";
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

const STRAVA_BANNERS: Record<string, { key: MessageKey; tone: "ok" | "error" }> = {
  connected: { key: "settings.stravaConnected", tone: "ok" },
  error: { key: "settings.stravaFailed", tone: "error" },
  not_configured: { key: "settings.stravaNoKeys", tone: "error" },
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string; strava?: string }>;
}) {
  const userId = await requireUserId();
  const [params, session, googleStatus, notionStatus, stravaStatus, { t }, account] =
    await Promise.all([
      searchParams,
      auth(),
      getGoogleStatus(userId),
      getNotionStatus(userId),
      getStravaStatus(userId),
      getT(),
      // Which proof the delete form asks for depends on whether this account has a
      // password at all — a Google-only user has none and confirms with their
      // address instead. The server re-derives both and re-checks the answer.
      prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, passwordHash: true, role: true, emailVerified: true },
      }),
    ]);
  const banner =
    (params.google ? GOOGLE_BANNERS[params.google] : undefined) ??
    (params.strava ? STRAVA_BANNERS[params.strava] : undefined);

  // The owner is not offered the card at all: bootstrapRole() re-grants the role
  // from OWNER_EMAIL on the next sign-in, so deleting would destroy the owner's
  // journal and hand back an empty account. The action refuses it server-side
  // regardless — this only spares them a button that cannot work.
  const isOwner = normalizeRole(account?.role) === "owner";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
          {t("page.settings.title")}
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">{t("settings.subtitle")}</p>
      </div>

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
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 text-base font-semibold text-violet-700"
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
        <EmailVerificationStatus verified={account?.emailVerified != null} />
        <DataExport />
        <p className="mt-3 text-[13px] text-neutral-500">{t("settings.account.privacy")}</p>
      </Card>

      <Card title={t("settings.google.title")} subtitle={t("settings.google.subtitle")}>
        <GoogleSettings status={googleStatus} />
      </Card>

      <Card title={t("settings.strava.title")} subtitle={t("settings.strava.subtitle")}>
        <StravaSettings status={stravaStatus} />
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

      {!isOwner && (
        <Card title={t("settings.danger.title")} subtitle={t("settings.danger.subtitle")}>
          <DeleteAccount
            hasPassword={Boolean(account?.passwordHash)}
            email={account?.email ?? ""}
          />
        </Card>
      )}

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
