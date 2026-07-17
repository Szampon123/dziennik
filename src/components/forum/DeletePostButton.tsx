"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePost } from "@/actions/forum";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useT } from "@/components/i18n/I18nProvider";

// Trash button for a forum message the current user may remove (own post, or
// admin/owner). Refreshes the discussion on success.
export function DeletePostButton({ id }: { id: string }) {
  const t = useT();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { confirm, dialog } = useConfirm();

  async function remove() {
    if (
      !(await confirm({
        title: t("forum.deletePostTitle"),
        body: t("forum.confirmDeletePost"),
        variant: "danger",
        icon: Trash2,
      }))
    )
      return;
    setError("");
    startTransition(async () => {
      const result = await deletePost({ id });
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  return (
    <>
      {dialog}
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
      {error && <span className="text-[12px] text-danger">{error}</span>}
    </>
  );
}
