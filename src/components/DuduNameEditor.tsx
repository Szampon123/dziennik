"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X } from "lucide-react";
import { setDuduName } from "@/actions/dudu";
import { normalizeDuduName, DEFAULT_DUDU_NAME_KEY, MAX_DUDU_NAME } from "@/lib/dudu";
import { useT } from "@/components/i18n/I18nProvider";

// The companion's name with pencil-to-edit. Shows the localized default label
// when unnamed; saving an empty value clears it back to the default.
export function DuduNameEditor({ initialName }: { initialName: string | null }) {
  const [name, setName] = useState<string | null>(initialName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialName ?? "");
  const t = useT();
  const [isPending, startTransition] = useTransition();

  const display = normalizeDuduName(name) ?? t(DEFAULT_DUDU_NAME_KEY);

  function open() {
    setDraft(name ?? "");
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
  }

  function submit() {
    const next = normalizeDuduName(draft);
    const previous = name;
    setName(next);
    setEditing(false);
    startTransition(async () => {
      const result = await setDuduName(draft);
      if (!result.ok) setName(previous); // rollback
    });
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            } else if (e.key === "Escape") {
              cancel();
            }
          }}
          maxLength={MAX_DUDU_NAME}
          placeholder={t(DEFAULT_DUDU_NAME_KEY)}
          aria-label={t("dudu.nameAria")}
          className="w-40 rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-1.5 text-center text-[15px] font-semibold text-neutral-900 outline-none focus-visible:ring-2 focus-visible:ring-violet-200"
        />
        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          aria-label={t("dudu.nameSave")}
          className="rounded-full p-1.5 text-violet-600 transition-colors outline-none hover:bg-violet-100 focus-visible:ring-2 focus-visible:ring-violet-200"
        >
          <Check aria-hidden className="h-4 w-4" strokeWidth={3} />
        </button>
        <button
          type="button"
          onClick={cancel}
          aria-label={t("dudu.nameCancel")}
          className="rounded-full p-1.5 text-neutral-500 transition-colors outline-none hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-violet-200"
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[17px] font-semibold text-neutral-900">{display}</span>
      <button
        type="button"
        onClick={open}
        aria-label={t("dudu.nameEdit")}
        title={t("dudu.nameEditTitle")}
        className="rounded-full p-1.5 text-neutral-400 transition-colors outline-none hover:bg-neutral-100 hover:text-violet-600 focus-visible:ring-2 focus-visible:ring-violet-200"
      >
        <Pencil aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
