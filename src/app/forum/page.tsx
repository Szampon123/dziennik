import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { SkillForumList } from "@/components/forum/SkillForumList";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  await requireUserId();

  const [activities, counts] = await Promise.all([
    prisma.activity.findMany({
      select: { slug: true, name: true, category: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.forumPost.groupBy({ by: ["activitySlug"], _count: { _all: true } }),
  ]);
  const countBySlug = new Map(counts.map((c) => [c.activitySlug, c._count._all]));

  const skills = activities.map((a) => ({
    slug: a.slug,
    name: a.name,
    category: a.category,
    count: countBySlug.get(a.slug) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Forum</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Każda umiejętność ma własną przestrzeń dyskusji. Wejdź, wybierz poziom i zobacz, co
          napisali inni — albo zacznij rozmowę.
        </p>
      </div>

      <SkillForumList skills={skills} />
    </div>
  );
}
