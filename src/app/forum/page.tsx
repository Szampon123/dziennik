import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { inputClass } from "@/components/ui/Input";
import { EmptyState } from "@/components/EmptyState";
import { AuthorChip } from "@/components/forum/AuthorChip";
import { ThreadComposer } from "@/components/forum/ThreadComposer";

export const dynamic = "force-dynamic";

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ activity?: string }>;
}) {
  await requireUserId();
  const { activity } = await searchParams;
  const filterSlug = activity?.trim() || "";

  const [activities, threads] = await Promise.all([
    prisma.activity.findMany({ select: { slug: true, name: true }, orderBy: { sortOrder: "asc" } }),
    prisma.forumThread.findMany({
      where: filterSlug ? { activitySlug: filterSlug } : {},
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { replies: true } },
      },
    }),
  ]);
  const nameOf = new Map(activities.map((a) => [a.slug, a.name]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.5px] text-neutral-900">Forum</h1>
        <p className="mt-1 text-[13px] text-neutral-500">
          Dyskutuj o umiejętnościach i konkretnych poziomach — dziel się doświadczeniem i pytaj.
        </p>
      </div>

      <ThreadComposer activities={activities} defaultActivity={filterSlug || undefined} />

      {/* Filter by skill (no-JS GET form) */}
      <form method="get" className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-600">Filtruj:</span>
        <select name="activity" defaultValue={filterSlug} aria-label="Filtruj po umiejętności" className={`${inputClass} w-auto py-2.5`}>
          <option value="">Wszystkie umiejętności</option>
          {activities.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
        <button type="submit" className={buttonClass("secondary")}>
          Pokaż
        </button>
        {filterSlug && (
          <Link href="/forum" className="text-[13px] font-medium text-violet-700 hover:underline">
            Wyczyść
          </Link>
        )}
      </form>

      {threads.length === 0 ? (
        <EmptyState
          title={filterSlug ? "Brak wątków dla tej umiejętności" : "Jeszcze nie ma wątków"}
          hint="Załóż pierwszy wątek — zadaj pytanie lub podziel się postępem."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {threads.map((t) => (
            <li key={t.id}>
              <Link
                href={`/forum/${t.id}`}
                className="group flex flex-col gap-2 rounded-card border border-neutral-200 bg-neutral-0 px-5 py-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-card-hover"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="violet">{nameOf.get(t.activitySlug) ?? t.activitySlug}</Badge>
                  {t.level !== null && <Badge variant="azure">Poziom {t.level}</Badge>}
                </div>
                <h2 className="text-[16px] font-semibold text-neutral-900 transition-colors group-hover:text-violet-700">
                  {t.title}
                </h2>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <AuthorChip user={t.user} createdAt={t.createdAt} />
                  <span className="inline-flex items-center gap-1.5 text-[13px] text-neutral-500">
                    <MessageSquare aria-hidden className="h-4 w-4" />
                    {t._count.replies}{" "}
                    {t._count.replies === 1
                      ? "odpowiedź"
                      : t._count.replies >= 2 && t._count.replies <= 4
                        ? "odpowiedzi"
                        : "odpowiedzi"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
