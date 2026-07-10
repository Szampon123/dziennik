"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/actions/forum";
import { useT } from "@/components/i18n/I18nProvider";

// Trash button for a forum message the current user may remove (own post, or
// admin/owner). Refreshes the discussion on success.
export function DeletePostButton({ id }: { id: string }) {
  const t = useT();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function remove() {
    if (!window.confirm(t("forum.confirmDeletePost"))) return;
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
      aria-label={t("forum.deletePost")}
      title={t("forum.deletePost")}
      className="rounded-full p-2 text-neutral-400 transition-colors outline-none hover:text-danger focus-visible:ring-2 focus-visible:ring-violet-200 disabled:opacity-50"
    >
      <Trash2 aria-hidden className="h-4 w-4" />
    </button>
  );
}
