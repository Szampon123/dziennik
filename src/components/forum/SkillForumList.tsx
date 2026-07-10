"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { ActivityIcon } from "@/lib/activity-icons";
import { Input } from "@/components/ui/Input";
import { useT, useLocale } from "@/components/i18n/I18nProvider";
import { plural } from "@/lib/i18n/plural";
import { EmptyState } from "@/components/EmptyState";

type SkillItem = { slug: string; name: string; category: string; count: number };

// Searchable board of every skill: each is a permanent discussion space. The
// count badge shows how many messages have been posted across all its levels.
export function SkillForumList({ skills }: { skills: SkillItem[] }) {
  const t = useT();
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter((s) => s.name.toLowerCase().includes(q));
  }, [skills, query]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("forum.searchSkills")}
        aria-label={t("forum.searchSkillsAria")}
      />

      {visible.length === 0 ? (
        <EmptyState title={t("forum.noMatchingSkills")} hint={t("forum.changeSearch")} />
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {visible.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/forum/${s.slug}`}
                className="group flex h-full items-center gap-3 rounded-card border border-neutral-200 bg-neutral-0 px-4 py-3 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-card-hover"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 p-2 transition-colors group-hover:bg-violet-100">
                  <ActivityIcon slug={s.slug} category={s.category} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-neutral-900 transition-colors group-hover:text-violet-700">
                    {s.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-neutral-500">
                    <MessageSquare aria-hidden className="h-3.5 w-3.5" />
                    {s.count === 0
                      ? t("forum.noMessages")
                      : plural(locale, "forum.messageCount", s.count)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
