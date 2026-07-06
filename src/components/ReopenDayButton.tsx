"use client";

import { useState, useTransition } from "react";
import { reopenDay } from "@/actions/day-entry";
import { Button } from "@/components/ui/Button";

export function ReopenDayButton({ date }: { date: string }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const result = await reopenDay(date);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="secondary" onClick={submit} disabled={isPending}>
        {isPending ? "Otwieranie…" : "Otwórz dzień ponownie"}
      </Button>
      {error && <span className="text-[13px] text-danger">{error}</span>}
    </div>
  );
}
