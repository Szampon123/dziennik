"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Heart, Search } from "lucide-react";
import { QUOTES, LANG_LABELS, type QuoteLang } from "@/lib/quotes";
import { setFavoriteQuote } from "@/actions/quotes";
import { QuoteBody } from "@/components/QuoteBody";
import { EmptyState } from "@/components/EmptyState";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";
import { useT } from "@/components/i18n/I18nProvider";

// All categories/languages present in the library (for the filter dropdowns).
const CATEGORIES = Array.from(new Set(QUOTES.map((q) => q.category))).sort((a, b) =>
  a.localeCompare(b, "pl")
);
const LANGS = Array.from(new Set(QUOTES.map((q) => q.lang))) as QuoteLang[];

type Sort = "default" | "category" | "author" | "lang";
const PAGE = 30;

// Browse and filter the whole quote library by theme, language, text/author, or
// favourites; save/unsave with the heart. Everything is client-side over the
// static list (only favouriting hits the server).
export function QuotesBrowser({
  favoriteIds,
  initialOnlyFavorites = false,
}: {
  favoriteIds: string[];
  initialOnlyFavorites?: boolean;
}) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [lang, setLang] = useState("all");
  const [onlyFav, setOnlyFav] = useState(initialOnlyFavorites);
  const [sort, setSort] = useState<Sort>("default");
  const [visible, setVisible] = useState(PAGE);
  const [favs, setFavs] = useState<Set<string>>(() => new Set(favoriteIds));
  const [, startTransition] = useTransition();

  // Reset the visible window whenever the filters change (not on favouriting).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(PAGE);
  }, [query, category, lang, onlyFav, sort]);

  function toggleFav(id: string) {
    const next = !favs.has(id);
    setFavs((prev) => {
      const s = new Set(prev);
      if (next) s.add(id);
      else s.delete(id);
      return s;
    });
    startTransition(async () => {
      const result = await setFavoriteQuote({ quoteId: id, favorite: next });
      if (!result.ok) {
        setFavs((prev) => {
          const s = new Set(prev);
          if (next) s.delete(id);
          else s.add(id);
          return s;
        });
      }
    });
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = QUOTES.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (lang !== "all" && item.lang !== lang) return false;
      if (onlyFav && !favs.has(item.id)) return false;
      if (needle) {
        const hay = `${item.text} ${item.author} ${item.translation ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    if (sort === "category")
      list.sort((a, b) => a.category.localeCompare(b.category, "pl") || a.author.localeCompare(b.author, "pl"));
    else if (sort === "author") list.sort((a, b) => a.author.localeCompare(b.author, "pl"));
    else if (sort === "lang")
      list.sort((a, b) => LANG_LABELS[a.lang].localeCompare(LANG_LABELS[b.lang], "pl"));
    return list;
  }, [query, category, lang, onlyFav, sort, favs]);

  const shown = filtered.slice(0, visible);
  const hasFilters = Boolean(query) || category !== "all" || lang !== "all" || onlyFav || sort !== "default";

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setLang("all");
    setOnlyFav(false);
    setSort("default");
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
        <label className="relative block">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("quotes.searchPlaceholder")}
            aria-label={t("quotes.searchAria")}
            className={`${inputClass} pl-9`}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={t("quotes.categoryAria")}
            className={`${inputClass} w-auto capitalize`}
          >
            <option value="all">{t("quotes.allCategories")}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label={t("quotes.langAria")}
            className={`${inputClass} w-auto`}
          >
            <option value="all">{t("quotes.allLangs")}</option>
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {LANG_LABELS[l]}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label={t("quotes.sortAria")}
            className={`${inputClass} w-auto`}
          >
            <option value="default">{t("quotes.sortDefault")}</option>
            <option value="category">{t("quotes.sortCategory")}</option>
            <option value="author">{t("quotes.sortAuthor")}</option>
            <option value="lang">{t("quotes.sortLang")}</option>
          </select>

          <Chip active={onlyFav} onClick={() => setOnlyFav((v) => !v)}>
            {t("quotes.onlyFavorites", { count: favs.size })}
          </Chip>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-neutral-500">
            {t("quotes.shownOf", { shown: Math.min(shown.length, filtered.length), total: filtered.length })}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[13px] font-medium text-azure-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-violet-200"
            >
              {t("quotes.clearFilters")}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          title={t("quotes.noQuotes")}
          hint={
            onlyFav
              ? t("quotes.noFavMatch")
              : t("quotes.changeFilters")
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {shown.map((item) => {
              const isFav = favs.has(item.id);
              return (
                <div
                  key={item.id}
                  className="relative rounded-card border border-neutral-200 bg-neutral-0 p-5 pr-12 shadow-card"
                >
                  <QuoteBody quote={item} />
                  <button
                    type="button"
                    onClick={() => toggleFav(item.id)}
                    aria-pressed={isFav}
                    aria-label={isFav ? t("quotes.removeFav") : t("quotes.addFav")}
                    title={isFav ? t("quotes.removeFav") : t("quotes.addFav")}
                    className="absolute right-3 top-3 rounded-lg p-1.5 text-neutral-400 outline-none transition-colors hover:text-violet-600 focus-visible:ring-2 focus-visible:ring-violet-200"
                  >
                    <Heart className={`h-5 w-5 ${isFav ? "fill-violet-600 text-violet-600" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>

          {visible < filtered.length && (
            <div className="flex justify-center">
              <Button variant="secondary" onClick={() => setVisible((v) => v + PAGE)}>
                {t("quotes.showMore", { count: filtered.length - visible })}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
