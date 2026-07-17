import Link from "next/link";
import { ExternalLink, MessageSquare } from "lucide-react";
import { linkHost } from "@/lib/forum";
import { getT } from "@/lib/i18n/server";
import { plural } from "@/lib/i18n/plural";
import { AuthorChip } from "@/components/forum/AuthorChip";
import { VoteButton } from "@/components/forum/VoteButton";
import { DeletePostButton } from "@/components/forum/DeletePostButton";

export type PostCardData = {
  id: string;
  userId: string;
  body: string;
  linkUrl: string | null;
  photoPath: string | null;
  createdAt: Date;
  user: { name: string | null; email: string | null };
  voteCount: number;
  votedByMe: boolean;
  replyCount?: number;
};

// One forum post: author, body, optional link + photo attachment, a "Pomocne"
// vote, delete (when allowed), and — on the level list — an "open" footer that
// links into the comment's own page + reply count.
export async function PostCard({
  post,
  currentUserId,
  isAdmin,
  href,
}: {
  post: PostCardData;
  currentUserId: string;
  isAdmin: boolean;
  href?: string;
}) {
  const { t, locale } = await getT();
  const canDelete = post.userId === currentUserId || isAdmin;
  const isOwn = post.userId === currentUserId;

  return (
    <div className="rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <AuthorChip user={post.user} createdAt={post.createdAt} />
        {canDelete && <DeletePostButton id={post.id} />}
      </div>

      <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-800">
        {post.body}
      </p>

      {post.linkUrl && (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noreferrer nofollow ugc"
          className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[13px] font-medium text-azure-700 transition-colors hover:border-azure-500 hover:bg-azure-100"
          title={post.linkUrl}
        >
          <ExternalLink aria-hidden className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{linkHost(post.linkUrl)}</span>
        </a>
      )}

      {post.photoPath && (
        <a
          href={`/api/forum-photo/${post.id}?v=${post.createdAt.getTime()}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block w-fit"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/forum-photo/${post.id}?v=${post.createdAt.getTime()}`}
            alt={t("forum.attachedPhoto")}
            className="max-h-80 rounded-lg border border-neutral-200 object-contain"
          />
        </a>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <VoteButton
          postId={post.id}
          initialCount={post.voteCount}
          initialVoted={post.votedByMe}
          disabled={isOwn}
        />
        {href && (
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-600 transition-colors hover:text-violet-700"
          >
            <MessageSquare aria-hidden className="h-4 w-4" />
            {(post.replyCount ?? 0) === 0
              ? t("forum.openAndReply")
              : plural(locale, "forum.replyCountOpen", post.replyCount ?? 0)}
          </Link>
        )}
      </div>
    </div>
  );
}
