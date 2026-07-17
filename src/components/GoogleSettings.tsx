"use client";

import { useState, useTransition } from "react";
import { disconnectGoogleAction } from "@/actions/google";
import type { GoogleStatus } from "@/lib/google";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useT } from "@/components/i18n/I18nProvider";

export function GoogleSettings({ status }: { status: GoogleStatus }) {
  const t = useT();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { confirm, dialog } = useConfirm();

  async function disconnect() {
    if (!(await confirm({ body: t("google.disconnectConfirm"), variant: "danger" }))) return;
    startTransition(async () => {
      const result = await disconnectGoogleAction();
      if (!result.ok) setError(result.error);
    });
  }

  if (status.state === "not_configured") {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">{t("google.noKeys")}</p>
        <Badge variant="neutral" className="shrink-0">
          {t("google.notConfigured")}
        </Badge>
      </div>
    );
  }

  if (status.state === "not_connected") {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          {t("google.keysConfigured")}
        </p>
        <Button onClick={() => window.location.assign("/api/auth/google")} className="shrink-0">
          {t("google.connect")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-800">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
          {status.email ? t("google.connectedAs", { email: status.email }) : t("google.connected")}
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" onClick={() => window.location.assign("/api/auth/google")}>
            {t("google.reauthorize")}
          </Button>
          <Button variant="destructive" onClick={disconnect} disabled={isPending}>
            {isPending ? t("google.disconnecting") : t("google.disconnect")}
          </Button>
        </div>
      </div>
      {error && <p className="text-[13px] text-danger">{error}</p>}
      {dialog}
    </div>
  );
}
