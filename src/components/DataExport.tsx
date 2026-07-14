"use client";

import { useState } from "react";
import { useT } from "@/components/i18n/I18nProvider";
import type { MessageKey } from "@/lib/i18n/messages";
import { buttonClass } from "@/components/ui/Button";

/**
 * "Download my data" — GDPR Art. 20, as a button rather than an email exchange.
 *
 * Fetched rather than linked with <a download>: the endpoint answers 429 when the
 * hourly budget is spent, and a plain link would render that JSON error in the tab
 * as if it were the export. Going through fetch lets a refusal stay a message.
 */
export function DataExport() {
  const t = useT();
  const [errorKey, setErrorKey] = useState<MessageKey | null>(null);
  const [isPending, setPending] = useState(false);

  async function download() {
    setPending(true);
    setErrorKey(null);
    try {
      const res = await fetch("/api/export");
      if (!res.ok) {
        setErrorKey(
          res.status === 429 ? "settings.account.exportRateLimited" : "settings.account.exportFailed"
        );
        return;
      }

      // The filename the server chose (vincendio-export-YYYY-MM-DD.json) — parsed
      // back out of the header rather than rebuilt here, so there is one source of it.
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? "vincendio-export.json";

      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setErrorKey("settings.account.exportFailed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        onClick={download}
        disabled={isPending}
        className={buttonClass("secondary", "w-full sm:w-auto")}
      >
        {isPending ? t("settings.account.exportPreparing") : t("settings.account.exportData")}
      </button>
      <p className="mt-2 text-[13px] text-neutral-500">{t("settings.account.exportHint")}</p>
      {errorKey && <p className="text-danger mt-2 text-[13px]">{t(errorKey)}</p>}
    </div>
  );
}
