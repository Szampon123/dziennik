import { requireUserId } from "@/lib/session";
import { favoriteQuoteIds } from "@/lib/queries";
import { QuotesBrowser } from "@/components/QuotesBrowser";

export const dynamic = "force-dynamic";

export default async function CytatyPage({
  searchParams,
}: {
  searchParams: Promise<{ fav?: string }>;
}) {
  const [userId, { fav }] = await Promise.all([requireUserId(), searchParams]);
  const ids = await favoriteQuoteIds(userId);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Cytaty</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Przeglądaj i filtruj po dziedzinie, języku lub treści; zapisuj ulubione sercem.
        </p>
      </div>

      <QuotesBrowser favoriteIds={ids} initialOnlyFavorites={fav === "1"} />
    </div>
  );
}
