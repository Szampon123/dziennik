"use client";

import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/i18n/I18nProvider";

// Catch-all boundary for render/server errors. Next.js redacts `error.message`
// in production; we never render it anyway. The digest is a safe hash that
// correlates with the server log entry.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md rounded-card border border-neutral-200 bg-neutral-0 p-8 text-center shadow-card">
        <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <TriangleAlert aria-hidden className="h-6 w-6" />
        </span>
        <h1 className="text-xl font-semibold text-neutral-900">{t("error.title")}</h1>
        <p className="mt-2 text-sm text-neutral-600">{t("error.body")}</p>
        {error.digest && (
          <p className="mt-3 text-xs text-neutral-400">{t("error.code", { code: error.digest })}</p>
        )}
        <Button onClick={reset} className="mt-6">
          {t("error.retry")}
        </Button>
      </div>
    </div>
  );
}
