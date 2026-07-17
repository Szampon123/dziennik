import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { getLocale, getT } from "@/lib/i18n/server";
import { getActivityName } from "@/lib/i18n/translate";
import { normalizeRole, isAdminRole } from "@/lib/roles";
import { parseLevelParam, levelLabel } from "@/lib/forum";
import { ActivityIcon } from "@/lib/activity-icons";
import { Card } from "@/components/Card";
import { Badge } from "@/components/ui/Badge";
import { LevelPicker } from "@/components/forum/LevelPicker";
import { PostComposer } from "@/components/forum/PostComposer";
import { PostCard } from "@/components/forum/PostCard";

export const dynamic = "force-dynamic";

export default async function SkillForumPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const userId = await requireUserId();
  const { slug } = await params;
  const { level: levelParam } = await searchParams;
  const level = parseLevelParam(levelParam);
  const locale = await getLocale();
  const { t } = await getT();

  const [activity, me, counts, posts] = await Promise.all([
    prisma.activity.findUnique({
      where: { slug },
      select: { name: true, nameEn: true, nameDe: true, nameEs: true, category: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
    prisma.forumPost.groupBy({
      by: ["level"],
      where: { activitySlug: slug },
      _count: { _all: true },
    }),
    prisma.forumPost.findMany({
      where: { activitySlug: slug, level, parentId: null },
      orderBy: { createdAt: "asc" },
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { votes: true, replies: true } },
      },
    }),
  ]);
  if (!activity) notFound();

  const isAdmin = isAdminRole(normalizeRole(me?.role));

  // Which of these posts the current user has upvoted.
  const myVotes = await prisma.forumVote.findMany({
    where: { userId, postId: { in: posts.map((p) => p.id) } },
    select: { postId: true },
  });
  const votedIds = new Set(myVotes.map((v) => v.postId));

  // Post counts split into the general space (level null) and per-level.
  let generalCount = 0;
  const levelCounts: Record<number, number> = {};
  for (const c of counts) {
    if (c.level === null) generalCount = c._count._all;
    else levelCounts[c.level] = c._count._all;
  }
  const activeLevels = Object.keys(levelCounts)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/forum"
          className="group inline-flex items-center gap-1 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft aria-hidden className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {t("nav.forum")}
        </Link>
        <div className="mt-2 flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 shadow-[0_2px_8px_-3px_rgba(110,86,207,0.4)]">
            <ActivityIcon slug={slug} category={activity.category} className="h-6 w-6 text-violet-700" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">
              {getActivityName(activity, locale)}
            </h1>
            <p className="mt-0.5 text-[13px] text-neutral-500">{t("forum.headerSubtitle")}</p>
          </div>
        </div>
      </div>

      {/* Where has anyone written? */}
      <div className="rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-card">
        <div className="flex flex-col gap-4">
          <LevelPicker
            slug={slug}
            current={level}
            generalCount={generalCount}
            levelCounts={levelCounts}
          />
          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] font-medium text-neutral-800">{t("forum.whereWritten")}</p>
            {generalCount === 0 && activeLevels.length === 0 ? (
              <p className="text-[13px] text-neutral-500">
                {t("forum.noPostsInSkill")}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {generalCount > 0 && (
                  <Link href={`/forum/${slug}`}>
                    <Badge variant={level === null ? "violet" : "neutral"}>
                      {t("forum.generalWithCount", { count: generalCount })}
                    </Badge>
                  </Link>
                )}
                {activeLevels.map((lvl) => (
                  <Link key={lvl} href={`/forum/${slug}?level=${lvl}`}>
                    <Badge variant={level === lvl ? "violet" : "neutral"}>
                      {t("forum.levelWithCount", { level: lvl, count: levelCounts[lvl] })}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected space */}
      <Card
        title={levelLabel(level, t)}
        subtitle={
          level === null
            ? t("forum.generalDiscussion")
            : t("forum.levelDiscussion", { level })
        }
      >
        {posts.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-neutral-500">
            {t("forum.beFirst")}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {posts.map((p) => (
              <li key={p.id}>
                <PostCard
                  post={{
                    id: p.id,
                    userId: p.userId,
                    body: p.body,
                    linkUrl: p.linkUrl,
                    photoPath: p.photoPath,
                    createdAt: p.createdAt,
                    user: p.user,
                    voteCount: p._count.votes,
                    votedByMe: votedIds.has(p.id),
                    replyCount: p._count.replies,
                  }}
                  currentUserId={userId}
                  isAdmin={isAdmin}
                  href={`/forum/${slug}/${p.id}`}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 border-t border-neutral-200 pt-5">
          <p className="mb-2 text-[13px] font-medium text-neutral-800">{t("forum.addMessage")}</p>
          <PostComposer activitySlug={slug} level={level} />
        </div>
      </Card>
    </div>
  );
}
