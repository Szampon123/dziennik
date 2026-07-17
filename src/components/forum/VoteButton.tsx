"use client";

import { useState, useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { togglePostVote } from "@/actions/forum";
import { useT } from "@/components/i18n/I18nProvider";

// "Pomocne" (helpful) toggle. Optimistic; the server returns the authoritative
// count. A user can't vote on their own post.
export function VoteButton({
  postId,
  initialCount,
  initialVoted,
  disabled = false,
}: {
  postId: string;
  initialCount: number;
  initialVoted: boolean;
  disabled?: boolean;
}) {
  const t = useT();
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    if (disabled) return;
    const nextVoted = !voted;
    setVoted(nextVoted);
    setCount((c) => c + (nextVoted ? 1 : -1));
    startTransition(async () => {
      const result = await togglePostVote({ postId });
      if (result.ok) {
        setVoted(result.voted);
        setCount(result.count);
      } else {
        // roll back
        setVoted(!nextVoted);
        setCount((c) => c + (nextVoted ? -1 : 1));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled || isPending}
      aria-pressed={voted}
      title={disabled ? t("forum.cantVoteOwn") : t("forum.markHelpful")}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-violet-200 disabled:opacity-50 ${
        voted
          ? "border-violet-600 bg-violet-600 text-white shadow-[0_1px_4px_-1px_rgba(110,86,207,0.5)]"
          : "border-neutral-300 bg-neutral-0 text-neutral-600 enabled:hover:border-violet-400 enabled:hover:text-violet-700"
      }`}
    >
      <ThumbsUp aria-hidden className={`h-4 w-4 ${voted ? "fill-current" : ""}`} />
      {t("forum.helpful")}
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
