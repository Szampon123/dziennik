import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { normalizeRole, isAdminRole } from "@/lib/roles";
import { levelLabel } from "@/lib/forum";
import { getT } from "@/lib/i18n/server";
import { Card } from "@/components/Card";
import { Badge } from "@/components/ui/Badge";
import { PostCard } from "@/components/forum/PostCard";
import { PostComposer } from "@/components/forum/PostComposer";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string; postId: string }>;
}) {
  const userId = await requireUserId();
  const { t } = await getT();
  const { slug, postId } = await params;

  const [post, me] = await Promise.all([
    prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { votes: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: {
            user: { select: { name: true, email: true } },
            _count: { select: { votes: true } },
          },
        },
      },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
  ]);
  // Only a real top-level post of this skill has its own page.
  if (!post || post.activitySlug !== slug || post.parentId !== null) notFound();

  const isAdmin = isAdminRole(normalizeRole(me?.role));

  const ids = [post.id, ...post.replies.map((r) => r.id)];
  const myVotes = await prisma.forumVote.findMany({
    where: { userId, postId: { in: ids } },
    select: { postId: true },
  });
  const votedIds = new Set(myVotes.map((v) => v.postId));

  const backHref = post.level === null ? `/forum/${slug}` : `/forum/${slug}?level=${post.level}`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={backHref}
          className="group inline-flex items-center gap-1 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>{" "}
          {t("forum.backToDiscussion")}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Link href={`/forum/${slug}`}>
            <Badge variant="violet">{post.activitySlug}</Badge>
          </Link>
          <Link href={backHref}>
            <Badge variant="azure">{levelLabel(post.level, t)}</Badge>
          </Link>
        </div>
      </div>

      <PostCard
        post={{
          id: post.id,
          userId: post.userId,
          body: post.body,
          linkUrl: post.linkUrl,
          photoPath: post.photoPath,
          createdAt: post.createdAt,
          user: post.user,
          voteCount: post._count.votes,
          votedByMe: votedIds.has(post.id),
        }}
        currentUserId={userId}
        isAdmin={isAdmin}
      />

      <Card
        title={t("forum.repliesHeading", { count: post.replies.length })}
        subtitle={t("forum.replyPlaceholder")}
      >
        {post.replies.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-neutral-500">
            {t("forum.noRepliesYet")}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {post.replies.map((r) => (
              <li key={r.id}>
                <PostCard
                  post={{
                    id: r.id,
                    userId: r.userId,
                    body: r.body,
                    linkUrl: r.linkUrl,
                    photoPath: r.photoPath,
                    createdAt: r.createdAt,
                    user: r.user,
                    voteCount: r._count.votes,
                    votedByMe: votedIds.has(r.id),
                  }}
                  currentUserId={userId}
                  isAdmin={isAdmin}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 border-t border-neutral-200 pt-5">
          <p className="mb-2 text-[13px] font-medium text-neutral-800">{t("forum.yourReply")}</p>
          <PostComposer
            activitySlug={slug}
            level={post.level}
            parentId={post.id}
            variant="reply"
          />
        </div>
      </Card>
    </div>
  );
}
