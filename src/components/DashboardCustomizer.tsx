"use client";

import { useState, useTransition } from "react";
import {
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { DASHBOARD_WIDGETS, DASHBOARD_WIDGET_IDS } from "@/lib/dashboard";
import { saveDashboard, resetDashboard } from "@/actions/dashboard";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/i18n/I18nProvider";

const WIDGET = Object.fromEntries(DASHBOARD_WIDGETS.map((w) => [w.id, w]));

// "Dostosuj widok" — lets the user show/hide and reorder the Dziś widgets.
// Optional: the trigger is a quiet ghost button; the default view needs no
// interaction. Saving persists per user and the page re-renders in the new
// layout.
export function DashboardCustomizer({
  order,
  hidden,
}: {
  order: string[];
  hidden: string[];
}) {
  const [open, setOpen] = useState(false);
  const [ord, setOrd] = useState<string[]>(order);
  const [hid, setHid] = useState<Set<string>>(() => new Set(hidden));
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const [isPending, startTransition] = useTransition();
  const t = useT();

  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= ord.length) return;
    setOrd((prev) => {
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
    setStatus("idle");
  }

  function toggle(id: string) {
    setHid((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
    setStatus("idle");
  }

  function save() {
    startTransition(async () => {
      const result = await saveDashboard({ order: ord, hidden: [...hid] });
      if (result.ok) setStatus("saved");
    });
  }

  function reset() {
    setOrd(DASHBOARD_WIDGET_IDS);
    setHid(new Set());
    startTransition(async () => {
      await resetDashboard();
      setStatus("saved");
    });
  }

  const visibleCount = ord.filter((id) => !hid.has(id)).length;

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200"
      >
        <SlidersHorizontal aria-hidden className="h-3.5 w-3.5" />
        {t("today.customize")}
      </button>

      {open && (
        <div className="w-full rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
          <p className="mb-3 text-[13px] text-neutral-500">
            {t("dashboard.intro")}
          </p>

          <ul className="flex flex-col gap-1.5">
            {ord.map((id, i) => {
              const w = WIDGET[id];
              if (!w) return null;
              const visible = !hid.has(id);
              return (
                <li
                  key={id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                    visible ? "border-neutral-200 bg-neutral-0" : "border-neutral-200 bg-neutral-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    aria-pressed={visible}
                    aria-label={visible ? t("dashboard.hideAria", { label: t(w.labelKey) }) : t("dashboard.showAria", { label: t(w.labelKey) })}
                    title={visible ? t("dashboard.hide") : t("dashboard.show")}
                    className={`shrink-0 rounded-md p-1.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-violet-200 ${
                      visible
                        ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                        : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    }`}
                  >
                    {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm font-medium ${
                        visible ? "text-neutral-900" : "text-neutral-400"
                      }`}
                    >
                      {t(w.labelKey)}
                    </p>
                    <p className="truncate text-[12px] text-neutral-400">{t(w.descriptionKey)}</p>
                  </div>

                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label={t("dashboard.moveUpAria", { label: t(w.labelKey) })}
                      title={t("dashboard.moveUp")}
                      className="rounded p-1 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === ord.length - 1}
                      aria-label={t("dashboard.moveDownAria", { label: t(w.labelKey) })}
                      title={t("dashboard.moveDown")}
                      className="rounded p-1 text-neutral-500 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-violet-200 disabled:pointer-events-none disabled:opacity-30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button onClick={save} disabled={isPending}>
              {isPending ? t("common.saving") : t("dashboard.saveLayout")}
            </Button>
            <Button variant="ghost" onClick={reset} disabled={isPending}>
              <RotateCcw aria-hidden className="h-4 w-4" />
              {t("dashboard.defaultLayout")}
            </Button>
            {status === "saved" ? (
              <span className="text-[13px] text-success">{t("common.saved")}</span>
            ) : (
              <span className="text-[13px] text-neutral-400">
                Widoczne sekcje: {visibleCount}/{ord.length}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
