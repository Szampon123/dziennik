"use client";

import { useState, useTransition } from "react";
import { disconnectGoogleAction } from "@/actions/google";
import type { GoogleStatus } from "@/lib/google";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function GoogleSettings({ status }: { status: GoogleStatus }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function disconnect() {
    if (
      !window.confirm(
        "Rozłączyć Google Calendar? Wydarzenia przestaną się pokazywać do czasu ponownej autoryzacji."
      )
    ) {
      return;
    }
    startTransition(async () => {
      const result = await disconnectGoogleAction();
      if (!result.ok) setError(result.error);
    });
  }

  if (status.state === "not_configured") {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Brak kluczy API. Uzupełnij <code className="font-mono text-[13px]">GOOGLE_CLIENT_ID</code>{" "}
          i <code className="font-mono text-[13px]">GOOGLE_CLIENT_SECRET</code> w{" "}
          <code className="font-mono text-[13px]">.env.local</code> — instrukcja krok po kroku w
          README.
        </p>
        <Badge variant="neutral" className="shrink-0">
          Nieskonfigurowane
        </Badge>
      </div>
    );
  }

  if (status.state === "not_connected") {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-600">
          Klucze skonfigurowane — autoryzuj dostęp do kalendarza.
        </p>
        <Button onClick={() => window.location.assign("/api/auth/google")} className="shrink-0">
          Połącz z Google
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-neutral-800">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
          Połączono{status.email ? ` jako ${status.email}` : ""}
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" onClick={() => window.location.assign("/api/auth/google")}>
            Autoryzuj ponownie
          </Button>
          <Button variant="destructive" onClick={disconnect} disabled={isPending}>
            {isPending ? "Rozłączanie…" : "Rozłącz"}
          </Button>
        </div>
      </div>
      {error && <p className="text-[13px] text-danger">{error}</p>}
    </div>
  );
}
