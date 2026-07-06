"use client";

import { useState, useTransition } from "react";
import { updateDayTasks } from "@/actions/day-entry";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Direct correction of the day's completed-tasks count. Past days can't be
// re-checked against the live calendar, so the number is editable by hand and
// stays available even on a closed day (it only fixes a recorded figure).
export function TasksEditor({
  date,
  tasksDone,
  tasksTotal,
}: {
  date: string;
  tasksDone: number | null;
  tasksTotal: number | null;
}) {
  const [done, setDone] = useState(tasksDone?.toString() ?? "");
  const [total, setTotal] = useState(tasksTotal?.toString() ?? "");
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const doneNum = done === "" ? null : Number(done);
  const totalNum = total === "" ? null : Number(total);
  const pct =
    totalNum !== null && totalNum > 0
      ? Math.round(((Math.min(doneNum ?? 0, totalNum)) / totalNum) * 100)
      : null;

  function run(nextDone: number | null, nextTotal: number | null) {
    startTransition(async () => {
      const result = await updateDayTasks({
        date,
        tasksDone: nextDone,
        tasksTotal: nextTotal,
      });
      if (result.ok) {
        setStatus("saved");
        setError("");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  function save() {
    run(doneNum, totalNum);
  }

  function clear() {
    setDone("");
    setTotal("");
    run(null, null);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">Wykonane</span>
          <Input
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            value={done}
            onChange={(e) => {
              setDone(e.target.value);
              setStatus("idle");
            }}
            aria-label="Liczba wykonanych zadań"
            className="w-24"
          />
        </label>
        <span className="pb-2.5 text-neutral-400">/</span>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-neutral-800">Wszystkie</span>
          <Input
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            value={total}
            onChange={(e) => {
              setTotal(e.target.value);
              setStatus("idle");
            }}
            aria-label="Łączna liczba zadań"
            className="w-24"
          />
        </label>
        {pct !== null && (
          <span className="pb-2.5 text-[13px] font-medium text-success">{pct}%</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Zapisywanie…" : "Zapisz liczbę zadań"}
        </Button>
        {(done !== "" || total !== "") && (
          <Button variant="ghost" onClick={clear} disabled={isPending}>
            Wyczyść
          </Button>
        )}
        {status === "saved" ? (
          <span className="text-[13px] text-success">Zapisano ✓</span>
        ) : status === "error" ? (
          <span className="text-[13px] text-danger">{error}</span>
        ) : (
          <span className="text-[13px] text-neutral-500">
            Ile zadań z kalendarza udało się wykonać tego dnia
          </span>
        )}
      </div>
    </div>
  );
}
