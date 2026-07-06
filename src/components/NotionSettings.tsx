"use client";

import { useState, useTransition } from "react";
import { saveNotionSettings, disconnectNotion } from "@/actions/notion-settings";
import type { NotionStatus } from "@/lib/notion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NotionSettings({ status }: { status: NotionStatus }) {
  const [token, setToken] = useState("");
  const [parentPageId, setParentPageId] = useState("");
  const [showForm, setShowForm] = useState(status.state === "not_configured");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

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

  function disconnect() {
    if (
      !window.confirm(
        "Rozłączyć Notion? Zamknięte dni przestaną publikować się jako daily brief."
      )
    ) {
      return;
    }
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
            Połączono — strona-rodzic:{" "}
            <span className="font-medium">{status.parentTitle ?? "(bez tytułu)"}</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" onClick={() => setShowForm((v) => !v)}>
              Zmień konfigurację
            </Button>
            <Button variant="destructive" onClick={disconnect} disabled={isPending}>
              Rozłącz
            </Button>
          </div>
        </div>
      )}

      {status.state === "error" && <p className="text-sm text-danger">{status.message}</p>}

      {(showForm || status.state === "error") && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-neutral-500">
            Utwórz integrację wewnętrzną na notion.so/my-integrations, udostępnij jej stronę-rodzica
            (Connections) i wklej dane poniżej — szczegóły w README.
          </p>
          <Input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Token integracji (ntn_… lub secret_…)"
            autoComplete="off"
          />
          <Input
            value={parentPageId}
            onChange={(e) => setParentPageId(e.target.value)}
            placeholder="ID strony-rodzica (32 znaki)"
            autoComplete="off"
          />
          <div className="flex items-center gap-3">
            <Button
              onClick={save}
              disabled={isPending || !token.trim() || !parentPageId.trim()}
              className="self-start"
            >
              {isPending ? "Testowanie połączenia…" : "Zapisz i przetestuj"}
            </Button>
            {error && <span className="text-[13px] text-danger">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
