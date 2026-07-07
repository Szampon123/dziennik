"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/actions/forum";
import { levelLabel } from "@/lib/forum";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";

// Compose a message in the currently selected skill+level space.
export function PostComposer({
  activitySlug,
  level,
}: {
  activitySlug: string;
  level: number | null;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!body.trim()) return;
    setError("");
    startTransition(async () => {
      const result = await createPost({ activitySlug, level, body });
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
        placeholder={`Napisz coś w: ${levelLabel(level)}…`}
        aria-label="Treść wiadomości"
      />
      {error && <p className="text-[13px] text-danger">{error}</p>}
      <Button onClick={submit} disabled={isPending || !body.trim()} className="self-start">
        {isPending ? "Wysyłanie…" : "Opublikuj"}
      </Button>
    </div>
  );
}
