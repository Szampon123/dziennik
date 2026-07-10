"use client";

import { useState, useTransition } from "react";
import { reopenDay } from "@/actions/day-entry";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/i18n/I18nProvider";

export function ReopenDayButton({ date }: { date: string }) {
  const t = useT();
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
        {isPending ? t("day.opening") : t("day.reopen")}
      </Button>
      {error && <span className="text-[13px] text-danger">{error}</span>}
    </div>
  );
}
