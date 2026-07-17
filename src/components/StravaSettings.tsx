"use client";

import { useState, useTransition } from "react";
import { disconnectStravaAction, syncStravaAction } from "@/actions/strava";
import type { StravaStatus } from "@/lib/strava";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useT } from "@/components/i18n/I18nProvider";

export function StravaSettings({ status }: { status: StravaStatus }) {
  const t = useT();
  const [error, setError] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { confirm, dialog } = useConfirm();

  async function disconnect() {
    if (!(await confirm({ body: t("strava.disconnectConfirm"), variant: "danger" }))) return;
    startTransition(async () => {
      const result = await disconnectStravaAction();
      if (!result.ok) setError(result.error);
    });
  }

  function syncNow() {
    setError("");
    setSyncMessage("");
    startTransition(async () => {
      const result = await syncStravaAction();
      if (result.ok) {
        setSyncMessage(t("strava.syncDone", { count: result.imported }));
      } else {
        setError(result.error);
      }
    });
  }

  if (status.state === "not_configured") {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">{t("strava.noKeys")}</p>
        <Badge variant="neutral" className="shrink-0">
          {t("strava.notConfigured")}
        </Badge>
      </div>
    );
  }

  if (status.state === "not_connected") {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">{t("strava.keysConfigured")}</p>
        <Button onClick={() => window.location.assign("/api/auth/strava")} className="shrink-0">
          {t("strava.connect")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-800">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
          {status.athleteName
            ? t("strava.connectedAs", { name: status.athleteName })
            : t("strava.connected")}
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" onClick={syncNow} disabled={isPending}>
            {isPending ? t("strava.syncing") : t("strava.sync")}
          </Button>
          <Button variant="destructive" onClick={disconnect} disabled={isPending}>
            {isPending ? t("strava.disconnecting") : t("strava.disconnect")}
          </Button>
        </div>
      </div>
      <p className="text-[13px] text-neutral-500">{t("strava.autoSyncHint")}</p>
      {syncMessage && <p className="text-[13px] text-success">{syncMessage}</p>}
      {error && <p className="text-[13px] text-danger">{error}</p>}
      {dialog}
    </div>
  );
}
