"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteThread, deleteReply } from "@/actions/forum";

// Small trash button for a forum post the current user may remove (own post, or
// admin/owner). Threads route back to the list on success; replies just refresh.
export function DeletePostButton({
  id,
  kind,
  label,
}: {
  id: string;
  kind: "thread" | "reply";
  label: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove() {
    if (!window.confirm(`Usunąć ${label}? Tej operacji nie można cofnąć.`)) return;
    startTransition(async () => {
      const result = kind === "thread" ? await deleteThread({ id }) : await deleteReply({ id });
      if (result.ok) {
        if (kind === "thread") router.push("/forum");
        else router.refresh();
      } else {
        window.alert(result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={isPending}
      aria-label={`Usuń ${label}`}
      title={`Usuń ${label}`}
      className="rounded-full p-2 text-neutral-400 transition-colors outline-none hover:text-danger focus-visible:ring-2 focus-visible:ring-violet-200 disabled:opacity-50"
    >
      <Trash2 aria-hidden className="h-4 w-4" />
    </button>
  );
}
