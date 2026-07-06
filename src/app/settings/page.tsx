import { requireUserId } from "@/lib/session";
import { auth } from "@/lib/auth";
import { getGoogleStatus } from "@/lib/google";
import { getNotionStatus } from "@/lib/notion";
import { Card } from "@/components/Card";
import { GoogleSettings } from "@/components/GoogleSettings";
import { NotionSettings } from "@/components/NotionSettings";
import { ThemeSegmented } from "@/components/ThemeSegmented";

export const dynamic = "force-dynamic";

const GOOGLE_BANNERS: Record<string, { text: string; tone: "ok" | "error" }> = {
  connected: { text: "Google Calendar połączony pomyślnie.", tone: "ok" },
  error: { text: "Autoryzacja Google nie powiodła się. Spróbuj ponownie.", tone: "error" },
  not_configured: {
    text: "Najpierw uzupełnij klucze Google w .env.local (instrukcja w README).",
    tone: "error",
  },
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>;
}) {
  const userId = await requireUserId();
  const [{ google: googleParam }, session, googleStatus, notionStatus] = await Promise.all([
    searchParams,
    auth(),
    getGoogleStatus(userId),
    getNotionStatus(userId),
  ]);
  const banner = googleParam ? GOOGLE_BANNERS[googleParam] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Ustawienia</h1>

      {banner && (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            banner.tone === "ok"
              ? "border-success/40 bg-success-bg text-success"
              : "border-danger-border bg-danger-bg text-danger"
          }`}
        >
          {banner.text}
        </p>
      )}

      <Card title="Konto" subtitle="Twoja tożsamość w aplikacji">
        <p className="text-sm text-neutral-800">
          Zalogowano jako{" "}
          <span className="font-medium">
            {session?.user?.email ?? session?.user?.name ?? "—"}
          </span>
        </p>
        <p className="mt-1 text-[13px] text-neutral-500">
          Twój dziennik oraz połączenia Google i Notion są prywatne — inni użytkownicy ich nie
          widzą.
        </p>
      </Card>

      <Card title="Google Calendar" subtitle="Odczyt wydarzeń z Twojego głównego kalendarza">
        <GoogleSettings status={googleStatus} />
      </Card>

      <Card title="Notion" subtitle="Publikacja Twoich zamkniętych dni jako daily brief">
        <NotionSettings status={notionStatus} />
      </Card>

      <Card title="Wygląd" subtitle="Motyw: jasny, ciemny, kolorowy lub własny">
        <ThemeSegmented />
      </Card>
    </div>
  );
}
