"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { createThread } from "@/actions/forum";
import { MAX_THREAD_TITLE, MAX_LEVEL } from "@/lib/forum";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, inputClass } from "@/components/ui/Input";

export function ThreadComposer({
  activities,
  defaultActivity,
}: {
  activities: { slug: string; name: string }[];
  defaultActivity?: string;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [activitySlug, setActivitySlug] = useState(defaultActivity ?? "");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError("");
    startTransition(async () => {
      // On success the server action redirects to the new thread; only an
      // error result comes back here.
      const result = await createThread({
        activitySlug,
        level: level.trim() === "" ? null : level.trim(),
        title,
        body,
      });
      if (result && !result.ok) setError(result.error);
    });
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="self-start">
        <Plus aria-hidden className="h-4 w-4" /> Nowy wątek
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">Umiejętność</span>
          <select
            value={activitySlug}
            onChange={(e) => setActivitySlug(e.target.value)}
            aria-label="Umiejętność"
            className={inputClass}
          >
            <option value="">— wybierz —</option>
            {activities.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex w-28 flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">Poziom</span>
          <input
            type="number"
            min={1}
            max={MAX_LEVEL}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="opc."
            aria-label="Poziom (opcjonalnie)"
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-neutral-800">Tytuł</span>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_THREAD_TITLE}
          placeholder="O czym chcesz podyskutować?"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-neutral-800">Treść</span>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Podziel się doświadczeniem, zadaj pytanie, poproś o wskazówki…"
        />
      </label>

      {error && <p className="text-[13px] text-danger">{error}</p>}

      <div className="flex items-center gap-2">
        <Button onClick={submit} disabled={isPending || !activitySlug || !title.trim() || !body.trim()}>
          {isPending ? "Publikowanie…" : "Opublikuj wątek"}
        </Button>
        <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
          Anuluj
        </Button>
      </div>
    </div>
  );
}
