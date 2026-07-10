import { authorName, authorInitial } from "@/lib/forum";
import { getT } from "@/lib/i18n/server";
import { formatDate } from "@/lib/dates";

// Author byline: a small gradient initial avatar + display name + timestamp.
export async function AuthorChip({
  user,
  createdAt,
}: {
  user: { name: string | null; email: string | null };
  createdAt: Date;
}) {
  const { t, locale } = await getT();
  const fallback = t("forum.anonymousAuthor");
  return (
    <div className="flex items-center gap-2 text-[13px] text-neutral-500">
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-azure-500 text-[11px] font-semibold text-white"
      >
        {authorInitial(user, fallback)}
      </span>
      <span className="font-medium text-neutral-700">{authorName(user, fallback)}</span>
      <span aria-hidden>·</span>
      <time dateTime={createdAt.toISOString()}>{formatDate(createdAt, locale)}</time>
    </div>
  );
}
