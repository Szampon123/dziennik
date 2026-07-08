"use client";

import { useState, useTransition } from "react";
import { saveMorning, setPriorityCheck } from "@/actions/day-entry";
import { MAX_PRIORITIES } from "@/lib/day";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Textarea } from "@/components/ui/Input";
import { useT } from "@/components/i18n/I18nProvider";

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
  const t = useT();

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
        <span className="text-[13px] font-medium text-neutral-800">{t("morning.intent")}</span>
        <Textarea
          value={intent}
          onChange={(e) => {
            setIntent(e.target.value);
            setStatus("idle");
          }}
          disabled={disabled}
          rows={2}
          placeholder={t("morning.intentPlaceholder")}
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-neutral-800">{t("morning.priorities")}</span>
        {priorities.map((p, i) => {
          const savedText = initialPriorities[i];
          const checkable = Boolean(savedText) && !disabled;
          return (
            <div key={i} className="flex items-center gap-3">
              <Checkbox
                checked={done[i]}
                disabled={!checkable}
                onChange={() => toggleDone(i)}
                size="sm"
                aria-label={t("morning.priorityDone", { n: i + 1 })}
                title={checkable ? t("morning.markDone") : t("morning.saveFirst")}
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
                aria-label={t("morning.priorityN", { n: i + 1 })}
                placeholder={
                  i === 0 ? t("morning.priorityFirst") : t("morning.priorityN", { n: i + 1 })
                }
                className={done[i] && savedText ? "line-through text-neutral-400" : ""}
              />
            </div>
          );
        })}
      </div>

      {!disabled && (
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={save} disabled={isPending}>
            {isPending ? t("common.saving") : t("morning.save")}
          </Button>
          {status === "saved" ? (
            <span className="text-[13px] text-success">{t("common.saved")}</span>
          ) : status === "error" ? (
            <span className="text-[13px] text-danger">{error}</span>
          ) : (
            notionConfigured && (
              <span className="text-[13px] text-neutral-500">{t("morning.notionHint")}</span>
            )
          )}
        </div>
      )}
    </div>
  );
}
