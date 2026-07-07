"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/actions/forum";

// Trash button for a forum message the current user may remove (own post, or
// admin/owner). Refreshes the discussion on success.
export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove() {
    if (!window.confirm("Usunąć tę wiadomość? Tej operacji nie można cofnąć.")) return;
    startTransition(async () => {
      const result = await deletePost({ id });
      if (result.ok) router.refresh();
      else window.alert(result.error);
    });
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={isPending}
      aria-label="Usuń wiadomość"
      title="Usuń wiadomość"
      className="rounded-full p-2 text-neutral-400 transition-colors outline-none hover:text-danger focus-visible:ring-2 focus-visible:ring-violet-200 disabled:opacity-50"
    >
      <Trash2 aria-hidden className="h-4 w-4" />
    </button>
  );
}
