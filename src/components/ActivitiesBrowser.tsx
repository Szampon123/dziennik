"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { setFavorite } from "@/actions/favorites";
import { CATEGORIES, categoryLabelKey, type CategoryKey } from "@/lib/activity-categories";
import { ActivityIcon } from "@/lib/activity-icons";
import { formatDate } from "@/lib/dates";
import type { ActivityListItem } from "@/lib/activities";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { Input, inputClass } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { useT, useLocale } from "@/components/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";

type StatusFilter = "all" | "started" | "notStarted" | "completed";
type SortKey =
  | "default"
  | "favorite"
  | "levelDesc"
  | "levelAsc"
  | "progress"
  | "name"
  | "recent";

const STATUS_OPTIONS: { key: StatusFilter; labelKey: MessageKey }[] = [
  { key: "all", labelKey: "act.status.all" },
  { key: "started", labelKey: "act.status.started" },
  { key: "notStarted", labelKey: "act.status.notStarted" },
  { key: "completed", labelKey: "act.status.completed" },
];

const SORT_OPTIONS: { key: SortKey; labelKey: MessageKey }[] = [
  { key: "default", labelKey: "act.sort.default" },
  { key: "favorite", labelKey: "act.sort.favorite" },
  { key: "levelDesc", labelKey: "act.sort.levelDesc" },
  { key: "levelAsc", labelKey: "act.sort.levelAsc" },
  { key: "progress", labelKey: "act.sort.progress" },
  { key: "name", labelKey: "act.sort.name" },
  { key: "recent", labelKey: "act.sort.recent" },
];

export function ActivitiesBrowser({ activities }: { activities: ActivityListItem[] }) {
  const [query, setQuery] = useState("");
  const [cats, setCats] = useState<Set<CategoryKey>>(new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("default");
  // Optimistic favorite state so the star flips instantly.
  const [favOverrides, setFavOverrides] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();
  const t = useT();
  const locale = useLocale();

  const isFav = (a: ActivityListItem) => favOverrides[a.slug] ?? a.favorite;

  function toggleFav(a: ActivityListItem) {
    const next = !isFav(a);
    setFavOverrides((prev) => ({ ...prev, [a.slug]: next }));
    startTransition(async () => {
      const result = await setFavorite({ activitySlug: a.slug, favorite: next });
      if (!result.ok) {
        // Roll back on failure.
        setFavOverrides((prev) => ({ ...prev, [a.slug]: !next }));
      }
    });
  }

  function toggleCat(key: CategoryKey) {
    setCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setCats(new Set());
    setFavoritesOnly(false);
    setStatus("all");
    setSort("default");
  }

  const filtersActive =
    query.trim() !== "" || cats.size > 0 || favoritesOnly || status !== "all" || sort !== "default";

  const visible = useMemo(() => {
    const fav = (a: ActivityListItem) => favOverrides[a.slug] ?? a.favorite;
    const q = query.trim().toLowerCase();
    let list = activities.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q)) return false;
      if (cats.size > 0 && !cats.has(a.category as CategoryKey)) return false;
      if (favoritesOnly && !fav(a)) return false;
      if (status === "started" && !a.started) return false;
      if (status === "notStarted" && a.started) return false;
      if (status === "completed" && !a.completed) return false;
      return true;
    });

    const pct = (a: ActivityListItem) => a.completedCount / a.maxLevel;
    list = [...list].sort((a, b) => {
      switch (sort) {
        case "favorite":
          return Number(fav(b)) - Number(fav(a));
        case "levelDesc":
          return b.completedCount - a.completedCount;
        case "levelAsc":
          return a.completedCount - b.completedCount;
        case "progress":
          return pct(b) - pct(a);
        case "name":
          return a.name.localeCompare(b.name, locale);
        case "recent":
          return (b.lastActiveAt ?? 0) - (a.lastActiveAt ?? 0);
        default:
          return 0; // preserve server order (sortOrder)
      }
    });
    return list;
  }, [activities, query, cats, favoritesOnly, status, sort, favOverrides, locale]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search + sort row */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("act.search")}
          className="min-w-48 flex-1"
        />
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          {t("act.sort")}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={`${inputClass} w-auto py-2.5`}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {t(o.labelKey)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Category chips — one horizontally scrollable row, names only */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORIES.map((c) => (
          <Chip key={c.key} active={cats.has(c.key)} onClick={() => toggleCat(c.key)}>
            {t(c.labelKey)}
          </Chip>
        ))}
      </div>

      {/* Status segments + favorites toggle */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg bg-neutral-100 p-1">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setStatus(o.key)}
              aria-pressed={status === o.key}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                status === o.key
                  ? "bg-neutral-0 text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {t(o.labelKey)}
            </button>
          ))}
        </div>
        <Chip active={favoritesOnly} onClick={() => setFavoritesOnly((v) => !v)}>
          <Star
            aria-hidden
            className={`mr-1 inline h-3.5 w-3.5 ${favoritesOnly ? "fill-current" : ""}`}
          />
          {t("act.favoritesOnly")}
        </Chip>
      </div>

      {/* Result count + clear */}
      <div className="flex items-center justify-between text-[13px] text-neutral-500">
        <span>{t("act.shown", { n: visible.length, total: activities.length })}</span>
        {filtersActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-violet-700 hover:underline"
          >
            {t("act.clearFilters")}
          </button>
        )}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <EmptyState title={t("act.noneTitle")} hint={t("act.noneHint")} />
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((a) => {
            const fav = isFav(a);
            return (
              <li key={a.id} className="relative">
                <Link
                  href={`/activities/${a.slug}`}
                  className="group flex items-center gap-4 rounded-card border border-neutral-200 bg-neutral-0 px-5 py-4 pr-14 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-card-hover"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 p-2 transition-colors group-hover:bg-violet-100">
                    <ActivityIcon slug={a.slug} category={a.category} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[15px] font-semibold text-neutral-900 transition-colors group-hover:text-violet-700">
                        {a.name}
                      </span>
                      <Badge variant="neutral" className="shrink-0">
                        {t("act.level", { done: a.completedCount, max: a.maxLevel })}
                      </Badge>
                    </span>
                    <Progress value={a.completedCount} max={a.maxLevel} className="mt-2" />
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-neutral-500">
                      <span>{t(categoryLabelKey(a.category))}</span>
                      {a.levelAchievedAt !== null && (
                        <span className="font-medium text-success">
                          {t("act.levelAchieved", { date: formatDate(a.levelAchievedAt, locale) })}
                        </span>
                      )}
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => toggleFav(a)}
                  aria-label={fav ? t("act.removeFav") : t("act.addFav")}
                  aria-pressed={fav}
                  title={fav ? t("act.removeFav") : t("act.addFav")}
                  className={`absolute right-2 top-2 rounded-full p-2.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                    fav ? "text-violet-600" : "text-neutral-400 hover:text-violet-600"
                  }`}
                >
                  <Star aria-hidden className={`h-5 w-5 ${fav ? "fill-current" : ""}`} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
