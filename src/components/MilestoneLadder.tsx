"use client";

import { useState, useTransition } from "react";
import {
  ChevronDown,
  GraduationCap,
  Image as ImageIcon,
  Play,
  StickyNote,
  FileText,
  BookOpen,
  Wrench,
} from "lucide-react";
import { setMilestone } from "@/actions/milestones";
import { TIERS } from "@/lib/activity-tiers";
import { formatDate } from "@/lib/dates";
import type { MilestoneResource, ResourceKind } from "@/lib/milestone-resources";
import { parseCriteria, implies } from "@/lib/milestone-criteria";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Checkbox } from "@/components/ui/Checkbox";
import { MilestoneEntryEditor } from "@/components/MilestoneEntryEditor";

export type MilestoneItem = {
  id: string;
  level: number;
  title: string; // effective (user's custom value if set, else original)
  detail: string | null;
  originalTitle: string; // seeded original — kept for reference / restore
  originalDetail: string | null;
  customTitle: string | null; // per-user override, null when not customised
  customDetail: string | null;
  customized: boolean;
  criteriaJson: string | null;
  done: boolean;
  auto: boolean; // engine-managed completion (proven by a logged workout)
  completedAt: number | null; // epoch ms of the check-off
  note: string | null;
  hasPhoto: boolean;
  entryVersion: number | null;
  // curated video (piece performance or technique demo) + tutorial search
  video: { yt: string; tut: string; kind: "piece" | "technika" } | null;
  // curated learning resources (videos + verified sites)
  resources: MilestoneResource[];
};

const RESOURCE_ICON: Record<ResourceKind, typeof Play> = {
  video: Play,
  article: FileText,
  course: GraduationCap,
  reference: BookOpen,
  tool: Wrench,
};

type View = "all" | "todo" | "next";

const VIEWS: { key: View; label: string }[] = [
  { key: "all", label: "Wszystkie" },
  { key: "todo", label: "Nieukończone" },
  { key: "next", label: "Kolejne cele" },
];

const NEXT_COUNT = 8;

export function MilestoneLadder({
  milestones,
  currentLevel,
}: {
  milestones: MilestoneItem[];
  currentLevel: number;
}) {
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [view, setView] = useState<View>("all");
  const [, startTransition] = useTransition();

  function toggle(m: MilestoneItem) {
    const next = !m.done;
    let cascade = false;
    if (next) {
      const stronger = parseCriteria(m.criteriaJson);
      const impliedUnchecked = stronger
        ? milestones.filter((x) => {
            if (x.level >= m.level || x.done) return false;
            const weaker = parseCriteria(x.criteriaJson);
            return weaker !== null && implies(stronger, weaker);
          })
        : [];
      if (impliedUnchecked.length > 0) {
        cascade = window.confirm(
          `Ten wynik udowadnia też ${impliedUnchecked.length} ${
            impliedUnchecked.length === 1 ? "niższy poziom" : "niższych poziomów"
          } (poziomy: ${impliedUnchecked.map((x) => x.level).join(", ")}). Zaznaczyć je również? ` +
            `Pozostałych niższych nie ruszamy — nie wynikają z tego osiągnięcia.`
        );
      }
    }
    setPendingId(m.id);
    startTransition(async () => {
      const result = await setMilestone({ milestoneId: m.id, done: next, cascade });
      setError(result.ok ? "" : result.error);
      setPendingId(null);
    });
  }

  // One milestone row (shared by the grouped tiers and the flat "next goals" view).
  function itemLi(m: MilestoneItem) {
    const open = openId === m.id;
    return (
      <li
        key={m.id}
        className={`border-b border-neutral-200 last:border-b-0 ${m.done && !open ? "opacity-80" : ""}`}
      >
        <div className="flex items-start gap-3 rounded-lg px-4 py-2.5 transition-colors hover:bg-neutral-50">
          <Checkbox
            checked={m.done}
            disabled={pendingId !== null || m.auto}
            onChange={() => toggle(m)}
            size="sm"
            aria-label={`Poziom ${m.level}: ${m.title}`}
            title={
              m.auto
                ? "Zaliczone automatycznie na podstawie treningu — usuń trening, aby cofnąć."
                : undefined
            }
            className="mt-1"
          />
          <span
            className={`mt-0.5 w-8 shrink-0 text-right font-mono text-[13px] ${
              m.done ? "font-medium text-violet-700" : "text-neutral-500"
            }`}
          >
            {m.level}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={`block text-[15px] text-neutral-800 ${
                m.done ? "line-through decoration-neutral-300" : ""
              }`}
            >
              {m.title}
              {m.auto && (
                <Badge variant="success" className="ml-2" title="Zaliczone automatycznie na podstawie treningu">
                  auto
                </Badge>
              )}
              {m.customized && (
                <Badge
                  variant="neutral"
                  className="ml-2 align-middle no-underline"
                  title="Ten poziom dostosowałeś — oryginał jest zachowany"
                >
                  zmodyfikowany
                </Badge>
              )}
            </span>
            {m.detail && <span className="mt-0.5 block text-[13px] text-neutral-500">{m.detail}</span>}
            {m.video && (
              <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px]">
                <a
                  href={`https://www.youtube.com/watch?v=${m.video.yt}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-1 font-medium text-violet-700 transition-colors hover:bg-violet-200"
                  title={
                    m.video.kind === "technika"
                      ? "Obejrzyj lekcję tej techniki na YouTube"
                      : "Obejrzyj wzorcowe wykonanie na YouTube"
                  }
                >
                  <Play aria-hidden className="h-3.5 w-3.5 fill-current" />{" "}
                  {m.video.kind === "technika" ? "Lekcja" : "Wykonanie"}
                </a>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(m.video.tut)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-azure-100 px-2.5 py-1 font-medium text-azure-700 transition-colors hover:bg-azure-300"
                  title="Znajdź więcej materiałów na YouTube"
                >
                  <GraduationCap aria-hidden className="h-3.5 w-3.5" />{" "}
                  {m.video.kind === "technika" ? "Więcej ćwiczeń" : "Jak zagrać"}
                </a>
              </span>
            )}
            {m.resources.length > 0 && (
              <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px]">
                {m.resources.map((res) => {
                  const Icon = RESOURCE_ICON[res.kind];
                  return (
                    <a
                      key={res.url}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-0 px-2.5 py-1 font-medium text-neutral-700 transition-colors hover:border-azure-500 hover:bg-azure-100 hover:text-azure-700"
                      title={res.url}
                    >
                      <Icon aria-hidden className="h-3.5 w-3.5" /> {res.title}
                    </a>
                  );
                })}
              </span>
            )}
            {(m.done || m.note || m.hasPhoto) && (
              <span className="mt-1 flex flex-wrap items-center gap-2 text-[13px]">
                {m.done && m.completedAt !== null && (
                  <span className="font-medium text-success">✓ Zaliczono {formatDate(m.completedAt)}</span>
                )}
                {m.note && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700"
                    title="Poziom ma notatkę"
                  >
                    <StickyNote aria-hidden className="h-3.5 w-3.5" /> notatka
                  </span>
                )}
                {m.hasPhoto && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700"
                    title="Poziom ma zdjęcie"
                  >
                    <ImageIcon aria-hidden className="h-3.5 w-3.5" /> zdjęcie
                  </span>
                )}
              </span>
            )}
          </span>
          {pendingId === m.id && <span className="text-[13px] text-neutral-500">…</span>}
          <button
            type="button"
            onClick={() => setOpenId(open ? null : m.id)}
            aria-expanded={open}
            aria-label={`Notatka i zdjęcie — poziom ${m.level}`}
            title="Notatka i zdjęcie"
            className={`rounded-lg p-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
              m.note || m.hasPhoto
                ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
        {open && (
          <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-4 pl-[76px]">
            <MilestoneEntryEditor
              milestoneId={m.id}
              initialNote={m.note}
              hasPhoto={m.hasPhoto}
              entryVersion={m.entryVersion}
              effectiveTitle={m.title}
              effectiveDetail={m.detail}
              originalTitle={m.originalTitle}
              originalDetail={m.originalDetail}
              customized={m.customized}
            />
          </div>
        )}
      </li>
    );
  }

  // The tier the user is currently working through stays expanded.
  const activeTier = TIERS.find((t) => currentLevel + 1 >= t.from && currentLevel + 1 <= t.to);
  const nextGoals = milestones.filter((m) => !m.done).slice(0, NEXT_COUNT);

  return (
    <div className="flex flex-col gap-3">
      {/* View controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex rounded-lg bg-neutral-100 p-1">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => setView(v.key)}
              aria-pressed={view === v.key}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${
                view === v.key
                  ? "bg-neutral-0 text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-[13px] text-danger">{error}</p>}

      {view === "next" ? (
        nextGoals.length === 0 ? (
          <div className="rounded-card border border-neutral-200 bg-neutral-0 p-6 text-center shadow-card">
            <p className="text-[15px] font-medium text-success">Wszystkie poziomy zaliczone! 🏆</p>
          </div>
        ) : (
          <div className="rounded-card border border-neutral-200 bg-neutral-0 shadow-card">
            <p className="px-4 py-3 text-sm font-semibold text-neutral-900">
              Kolejne cele
              <span className="ml-2 font-normal text-neutral-500">
                najbliższe {nextGoals.length} do zaliczenia
              </span>
            </p>
            <ul className="flex flex-col border-t border-neutral-200">{nextGoals.map(itemLi)}</ul>
          </div>
        )
      ) : (
        TIERS.map((tier) => {
          const all = milestones.filter((m) => m.level >= tier.from && m.level <= tier.to);
          if (all.length === 0) return null;
          const doneCount = all.filter((m) => m.done).length;
          const items = view === "todo" ? all.filter((m) => !m.done) : all;
          // In "todo" view hide fully-completed tiers entirely.
          if (items.length === 0) return null;
          const openByDefault = view === "todo" ? true : tier === activeTier;
          return (
            <details
              key={tier.name}
              open={openByDefault}
              className="rounded-card border border-neutral-200 bg-neutral-0 shadow-card"
            >
              <summary className="flex min-h-10 cursor-pointer items-center justify-between gap-3 px-4 py-3">
                <span className="text-sm font-semibold text-neutral-900">
                  {tier.name}
                  <span className="ml-2 font-normal text-neutral-500">
                    poziomy {tier.from}–{tier.to}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Progress value={doneCount} max={all.length} className="hidden h-1.5 w-20 sm:block" />
                  <Badge variant={doneCount === all.length ? "success" : "neutral"}>
                    {doneCount}/{all.length}
                  </Badge>
                </span>
              </summary>
              <ul className="flex flex-col border-t border-neutral-200">{items.map(itemLi)}</ul>
            </details>
          );
        })
      )}
    </div>
  );
}
