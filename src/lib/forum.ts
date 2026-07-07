// Forum domain helpers (client-safe): limits, level labels, author formatting.

export const MAX_POST_BODY = 5000;
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

/** Human label for a discussion space's level (null = the whole skill). */
export function levelLabel(level: number | null): string {
  return level === null ? "Ogólne" : `Poziom ${level}`;
}

/** Parse a `?level=` search param into null (Ogólne) or a valid 1..99 level. */
export function parseLevelParam(value: string | undefined): number | null {
  if (!value || value === "ogolne") return null;
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n >= 1 && n <= MAX_LEVEL ? n : null;
}
