"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { LANG_LABELS, type Quote } from "@/lib/quotes";

// Presentational quote: original text + author + language, with the Polish
// translation revealed on click. Remounted (via key) when the quote changes,
// so the translation collapses for each new quote.
export function QuoteBody({ quote }: { quote: Quote }) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Badge variant="violet" className="self-start capitalize">
        {quote.category}
      </Badge>

      <blockquote className="text-lg font-medium italic leading-snug text-neutral-900">
        „{quote.text}”
      </blockquote>

      <p className="text-sm text-neutral-600">
        — {quote.author}
        <span className="text-neutral-400"> · {LANG_LABELS[quote.lang]}</span>
      </p>

      {quote.translation && (
        <div>
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            aria-expanded={showTranslation}
            className="text-[13px] font-medium text-azure-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-violet-200"
          >
            {showTranslation ? "Ukryj tłumaczenie" : "Pokaż tłumaczenie"}
          </button>
          {showTranslation && (
            <p className="mt-1.5 text-[15px] leading-snug text-neutral-700">
              „{quote.translation}”
            </p>
          )}
        </div>
      )}
    </div>
  );
}
