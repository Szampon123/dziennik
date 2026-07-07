"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addReply } from "@/actions/forum";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

export function ReplyComposer({ threadId }: { threadId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!body.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await addReply({ threadId, body });
      if (result.ok) {
        setBody("");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Dodaj odpowiedź…"
        aria-label="Treść odpowiedzi"
      />
      {error && <p className="text-[13px] text-danger">{error}</p>}
      <Button onClick={submit} disabled={isPending || !body.trim()} className="self-start">
        {isPending ? "Wysyłanie…" : "Odpowiedz"}
      </Button>
    </div>
  );
}
