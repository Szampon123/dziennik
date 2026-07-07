// Forum domain helpers (client-safe: limits + author display formatting).

export const MAX_THREAD_TITLE = 140;
export const MAX_THREAD_BODY = 5000;
export const MAX_REPLY_BODY = 5000;
export const MAX_LEVEL = 99;

type AuthorLike = { name?: string | null; email?: string | null };

/** Public display name for a post author (never leaks the full e-mail). */
export function authorName(user: AuthorLike | null | undefined): string {
  const name = user?.name?.trim();
  if (name) return name;
  const local = user?.email?.split("@")[0]?.trim();
  return local || "Użytkownik";
}

/** First letter for the avatar chip. */
export function authorInitial(user: AuthorLike | null | undefined): string {
  return authorName(user).charAt(0).toUpperCase();
}
