"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { ActivityIcon } from "@/lib/activity-icons";
import { ONBOARDING_GROUPS } from "@/lib/onboarding-activities";
import { useT } from "@/components/i18n/I18nProvider";

export type OnboardingActivity = { slug: string; name: string; category: string };

export function StepActivities({
  activities,
  selected,
  onToggle,
}: {
  activities: OnboardingActivity[];
  selected: Set<string>;
  onToggle: (slug: string) => void;
}) {
  const t = useT();
  const [category, setCategory] = useState<string | null>(null);

  const bySlug = new Map(activities.map((a) => [a.slug, a]));
  const groups = category
    ? ONBOARDING_GROUPS.filter((g) => g.category === category)
    : ONBOARDING_GROUPS;

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-[-0.5px] text-neutral-900 sm:text-3xl">
          {t("onboarding.activities.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-relaxed text-neutral-600">
          {t("onboarding.activities.subtitle")}
        </p>
        <p className="mt-1.5 text-[13px] text-neutral-500">
          {t("onboarding.activities.hint")}
          {selected.size > 0 && (
            <>
              {" · "}
              <span className="font-medium text-violet-600">
                {t("onboarding.activities.selected", { count: selected.size })}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Category chips. Scrolls horizontally rather than wrapping, so the grid
          below never jumps as the row grows. */}
      <div className="-mx-6 mt-7 overflow-x-auto px-6 pb-1">
        <div className="flex w-max items-center gap-2">
          <Chip active={category === null} onClick={() => setCategory(null)}>
            All
          </Chip>
          {ONBOARDING_GROUPS.map((g) => (
            <Chip
              key={g.category}
              active={category === g.category}
              onClick={() => setCategory(g.category)}
            >
              {g.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-7">
        {groups.map((group) => (
          <section key={group.category}>
            <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-neutral-500">
              {group.label}
            </h2>
            <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {group.slugs.map((slug) => {
                const activity = bySlug.get(slug);
                // A slug missing from the DB means the seed changed; drop the
                // card rather than render a nameless tile.
                if (!activity) return null;
                const isSelected = selected.has(slug);
                return (
                  <li key={slug}>
                    <button
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onToggle(slug)}
                      className={`relative flex w-full items-center gap-2.5 rounded-xl border p-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                        isSelected
                          ? "border-violet-600 bg-violet-100/60"
                          : "border-neutral-200 bg-neutral-0 hover:bg-neutral-50"
                      }`}
                    >
                      <ActivityIcon
                        slug={activity.slug}
                        category={activity.category}
                        className={`h-5 w-5 shrink-0 ${isSelected ? "text-violet-700" : "text-neutral-600"}`}
                      />
                      <span
                        className={`truncate text-[13px] font-medium ${
                          isSelected ? "text-violet-700" : "text-neutral-800"
                        }`}
                      >
                        {activity.name}
                      </span>
                      {isSelected && (
                        <span
                          aria-hidden
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-white"
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
        active
          ? "bg-violet-100 font-semibold text-violet-700"
          : "font-medium text-neutral-600 hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}
