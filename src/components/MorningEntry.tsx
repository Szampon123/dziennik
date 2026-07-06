"use client";

import { useState, useTransition } from "react";
import { saveMorning, setPriorityCheck } from "@/actions/day-entry";
import { MAX_PRIORITIES } from "@/lib/day";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

export function MorningEntry({
  date,
  initialIntent,
  initialPriorities,
  initialPrioritiesDone = [],
  disabled,
  notionConfigured = false,
}: {
  date: string;
  initialIntent: string;
  initialPriorities: string[];
  initialPrioritiesDone?: boolean[];
  disabled: boolean;
  notionConfigured?: boolean;
}) {
  const [intent, setIntent] = useState(initialIntent);
  const [priorities, setPriorities] = useState<string[]>(
    Array.from({ length: MAX_PRIORITIES }, (_, i) => initialPriorities[i] ?? "")
  );
  // Checkpoint flags refer to the SAVED priorities (optimistic local copy).
  const [done, setDone] = useState<boolean[]>(
    Array.from({ length: MAX_PRIORITIES }, (_, i) => initialPrioritiesDone[i] ?? false)
  );
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function setPriority(i: number, value: string) {
    setPriorities((prev) => prev.map((p, j) => (j === i ? value : p)));
    setStatus("idle");
  }

  function toggleDone(i: number) {
    const next = !done[i];
    setDone((prev) => prev.map((f, j) => (j === i ? next : f)));
    startTransition(async () => {
      const result = await setPriorityCheck({ date, index: i, checked: next });
      if (!result.ok) {
        setDone((prev) => prev.map((f, j) => (j === i ? !next : f)));
        setStatus("error");
        setError(result.error);
      }
    });
  }

  function save() {
    startTransition(async () => {
      const result = await saveMorning({ date, morningIntent: intent, priorities });
      if (result.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-neutral-800">Intencja dnia</span>
        <Textarea
          value={intent}
          onChange={(e) => {
            setIntent(e.target.value);
            setStatus("idle");
          }}
          disabled={disabled}
          rows={2}
          placeholder="Na czym dziś naprawdę mi zależy?"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-neutral-800">Priorytety (max 3)</span>
        {priorities.map((p, i) => {
          const savedText = initialPriorities[i];
          const checkable = Boolean(savedText) && !disabled;
          return (
            <div key={i} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={done[i]}
                disabled={!checkable}
                onChange={() => toggleDone(i)}
                aria-label={`Priorytet ${i + 1} wykonany`}
                title={
                  checkable
                    ? "Oznacz priorytet jako wykonany"
                    : "Zapisz treść priorytetu, aby móc go odhaczyć"
                }
                className="h-4 w-4 shrink-0 accent-[var(--violet-600)] disabled:opacity-40"
              />
              <span
                aria-hidden
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done[i] && savedText
                    ? "bg-success-bg text-success"
                    : i === 0
                      ? "bg-violet-100 text-violet-700"
                      : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {done[i] && savedText ? "✓" : i + 1}
              </span>
              <Input
                value={p}
                onChange={(e) => setPriority(i, e.target.value)}
                disabled={disabled}
                aria-label={`Priorytet ${i + 1}`}
                placeholder={i === 0 ? "Najważniejsza rzecz dnia" : `Priorytet ${i + 1}`}
                className={done[i] && savedText ? "line-through text-neutral-400" : ""}
              />
            </div>
          );
        })}
      </div>

      {!disabled && (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={save} disabled={isPending}>
            {isPending ? "Zapisywanie…" : "Zapisz wpis poranny"}
          </Button>
          {status === "saved" ? (
            <span className="text-[13px] text-success">Zapisano ✓</span>
          ) : status === "error" ? (
            <span className="text-[13px] text-danger">{error}</span>
          ) : (
            notionConfigured && (
              <span className="text-[13px] text-neutral-500">
                Zapisze się też jako daily brief w Notion
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}
