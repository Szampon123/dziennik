"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/i18n/I18nProvider";

export function RetrySyncButton({ date }: { date: string }) {
  const t = useT();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function retry() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/notion/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date }),
        });
        const data = await res.json();
        setError(data.ok ? "" : data.error);
      } catch {
        setError(t("calendar.connectFailed"));
      }
      router.refresh();
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <Button variant="secondary" onClick={retry} disabled={isPending}>
        {isPending ? t("sync.syncing") : t("sync.retry")}
      </Button>
      {error && <span className="text-[13px] text-danger">{error}</span>}
    </span>
  );
}
