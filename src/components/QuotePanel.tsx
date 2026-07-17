"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, Shuffle, Star } from "lucide-react";
import { QUOTE_BY_ID, randomQuoteId } from "@/lib/quotes";
import { setFavoriteQuote } from "@/actions/quotes";
import { QuoteBody } from "@/components/QuoteBody";
import { Card } from "@/components/Card";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/i18n/I18nProvider";

// "Cytat na dziś" panel: a stable quote for the day plus a shuffle for a fresh
// one, and a heart to save favourites (persisted per user).
export function QuotePanel({
  dailyId,
  favoriteIds,
}: {
  dailyId: string;
  favoriteIds: string[];
}) {
  const [currentId, setCurrentId] = useState(dailyId);
  const [favs, setFavs] = useState<Set<string>>(() => new Set(favoriteIds));
  const [, startTransition] = useTransition();
  const t = useT();

  const quote = QUOTE_BY_ID[currentId];
  const isFav = favs.has(currentId);
  const isDaily = currentId === dailyId;

  function toggleFav() {
    const next = !isFav;
    setFavs((prev) => {
      const s = new Set(prev);
      if (next) s.add(currentId);
      else s.delete(currentId);
      return s;
    });
    startTransition(async () => {
      const result = await setFavoriteQuote({ quoteId: currentId, favorite: next });
      if (!result.ok) {
        setFavs((prev) => {
          const s = new Set(prev);
          if (next) s.delete(currentId);
          else s.add(currentId);
          return s;
        });
      }
    });
  }

  return (
    <Card
      title={t("quote.title")}
      subtitle={isDaily ? t("quote.daily") : t("quote.random")}
      action={
        <Link
          href="/cytaty?fav=1"
          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-azure-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-violet-200"
        >
          <Star aria-hidden className="h-3.5 w-3.5" />
          {t("quote.favorites", { n: favs.size })}
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        <QuoteBody key={quote.id} quote={quote} />

        <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 pt-4">
          <Button variant="secondary" onClick={() => setCurrentId((id) => randomQuoteId(id))}>
            <Shuffle aria-hidden className="h-4 w-4" />
            {t("quote.new")}
          </Button>
          <button
            type="button"
            onClick={toggleFav}
            aria-pressed={isFav}
            className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-200 ${
              isFav
                ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <Heart
              aria-hidden
              className={`h-4 w-4 ${isFav ? "fill-violet-600 text-violet-600" : ""}`}
            />
            {isFav ? t("quote.inFav") : t("quote.toFav")}
          </button>
        </div>
      </div>
    </Card>
  );
}
