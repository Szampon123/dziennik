import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { normalizeRole, isAdminRole } from "@/lib/roles";
import { Card } from "@/components/Card";
import { Badge } from "@/components/ui/Badge";
import { AuthorChip } from "@/components/forum/AuthorChip";
import { ReplyComposer } from "@/components/forum/ReplyComposer";
import { DeletePostButton } from "@/components/forum/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  const { id } = await params;

  const [thread, me] = await Promise.all([
    prisma.forumThread.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        replies: {
          orderBy: { createdAt: "asc" },
          include: { user: { select: { name: true, email: true } } },
        },
      },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
  ]);
  if (!thread) notFound();

  const activity = await prisma.activity.findUnique({
    where: { slug: thread.activitySlug },
    select: { name: true },
  });

  const isAdmin = isAdminRole(normalizeRole(me?.role));
  const canDelete = (authorId: string) => authorId === userId || isAdmin;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/forum"
          className="group inline-flex items-center gap-1 text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span> Forum
        </Link>
      </div>

      {/* Original post */}
      <section className="rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-card">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link href={`/forum?activity=${thread.activitySlug}`}>
            <Badge variant="violet">{activity?.name ?? thread.activitySlug}</Badge>
          </Link>
          {thread.level !== null && <Badge variant="azure">Poziom {thread.level}</Badge>}
        </div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-[24px] font-semibold tracking-[-0.3px] text-neutral-900">
            {thread.title}
          </h1>
          {canDelete(thread.userId) && (
            <DeletePostButton id={thread.id} kind="thread" label="wątek" />
          )}
        </div>
        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-800">
          {thread.body}
        </p>
        <div className="mt-4 border-t border-neutral-100 pt-3">
          <AuthorChip user={thread.user} createdAt={thread.createdAt} />
        </div>
      </section>

      {/* Replies */}
      <Card
        title={`Odpowiedzi (${thread.replies.length})`}
        subtitle="Bądź uprzejmy i konkretny — pomóż innym rozwijać tę umiejętność"
      >
        {thread.replies.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-neutral-500">
            Jeszcze nikt nie odpowiedział. Bądź pierwszy!
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {thread.replies.map((r) => (
              <li key={r.id} className="border-b border-neutral-100 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <AuthorChip user={r.user} createdAt={r.createdAt} />
                  {canDelete(r.userId) && (
                    <DeletePostButton id={r.id} kind="reply" label="odpowiedź" />
                  )}
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-800">
                  {r.body}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 border-t border-neutral-200 pt-5">
          <ReplyComposer threadId={thread.id} />
        </div>
      </Card>
    </div>
  );
}
