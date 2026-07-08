import { requireUserId } from "@/lib/session";
import { favoriteQuoteIds } from "@/lib/queries";
import { getT } from "@/lib/i18n/server";
import { QuotesBrowser } from "@/components/QuotesBrowser";

export const dynamic = "force-dynamic";

export default async function CytatyPage({
  searchParams,
}: {
  searchParams: Promise<{ fav?: string }>;
}) {
  const [userId, { fav }, { t }] = await Promise.all([requireUserId(), searchParams, getT()]);
  const ids = await favoriteQuoteIds(userId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
          {t("page.quotes.title")}
        </h1>
        <p className="mt-1 text-[13px] text-neutral-500">{t("page.quotes.subtitle")}</p>
      </div>

      <QuotesBrowser favoriteIds={ids} initialOnlyFavorites={fav === "1"} />
    </div>
  );
}
