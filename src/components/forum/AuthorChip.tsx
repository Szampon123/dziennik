import { authorName, authorInitial } from "@/lib/forum";

// Author byline: a small gradient initial avatar + display name + timestamp.
export function AuthorChip({
  user,
  createdAt,
}: {
  user: { name: string | null; email: string | null };
  createdAt: Date;
}) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-neutral-500">
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-azure-500 text-[11px] font-semibold text-white"
      >
        {authorInitial(user)}
      </span>
      <span className="font-medium text-neutral-700">{authorName(user)}</span>
      <span aria-hidden>·</span>
      <time dateTime={createdAt.toISOString()}>
        {createdAt.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" })}
      </time>
    </div>
  );
}
