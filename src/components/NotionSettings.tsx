"use client";

import { useState, useTransition } from "react";
import { Unplug } from "lucide-react";
import { saveNotionSettings, disconnectNotion } from "@/actions/notion-settings";
import type { NotionStatus } from "@/lib/notion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useT } from "@/components/i18n/I18nProvider";

export function NotionSettings({ status }: { status: NotionStatus }) {
  const t = useT();
  const [token, setToken] = useState("");
  const [parentPageId, setParentPageId] = useState("");
  const [showForm, setShowForm] = useState(status.state === "not_configured");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { confirm, dialog } = useConfirm();

  function save() {
    startTransition(async () => {
      const result = await saveNotionSettings({ token, parentPageId });
      if (result.ok) {
        setError("");
        setToken("");
        setParentPageId("");
        setShowForm(false);
      } else {
        setError(result.error);
      }
    });
  }

  async function disconnect() {
    if (
      !(await confirm({
        title: t("notion.disconnectTitle"),
        body: t("notion.disconnectConfirm"),
        variant: "danger",
        icon: Unplug,
      }))
    )
      return;
    startTransition(async () => {
      const result = await disconnectNotion();
      if (result.ok) {
        setShowForm(true);
        setError("");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {status.state === "ok" && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-neutral-800">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
            {t("notion.connectedParent")}{" "}
            <span className="font-medium">{status.parentTitle ?? t("notion.untitled")}</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
              {t("notion.changeConfig")}
            </Button>
            <Button variant="destructive" onClick={disconnect} disabled={isPending}>
              {t("notion.disconnect")}
            </Button>
          </div>
        </div>
      )}

      {status.state === "error" && <p className="text-sm text-danger">{status.message}</p>}

      {(showForm || status.state === "error") && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-neutral-500">
            {t("notion.setupHint")}
          </p>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={t("notion.tokenPlaceholder")}
            autoComplete="off"
          />
          <Input
            value={parentPageId}
            onChange={(e) => setParentPageId(e.target.value)}
            placeholder={t("notion.parentIdPlaceholder")}
            autoComplete="off"
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={save}
              disabled={isPending || !token.trim() || !parentPageId.trim()}
              className="self-start"
            >
              {isPending ? t("notion.testing") : t("notion.saveTest")}
            </Button>
            {error && <span className="text-[13px] text-danger">{error}</span>}
          </div>
        </div>
      )}
      {dialog}
    </div>
  );
}
