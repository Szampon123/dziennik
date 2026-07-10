// Forum domain helpers (client-safe): limits, level labels, author formatting.
import type { MessageKey } from "@/lib/i18n/messages";

/** Structurally what both getT()'s `t` and useT() satisfy, without importing
 *  either (this file stays free of the server-only cookies() dependency). */
type Translate = (key: MessageKey, params?: Record<string, string | number>) => string;

export const MAX_POST_BODY = 5000;
export const MAX_LINK = 500;
export const MAX_LEVEL = 99;

/** Accept only http(s) links (blocks javascript:, data:, etc.). */
export function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Short host label for a link chip, e.g. "youtube.com". */
export function linkHost(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

type AuthorLike = { name?: string | null; email?: string | null };

/**
 * Public display name for a post author (never leaks the full e-mail).
 * `fallback` is shown only when there is neither a name nor an email — the
 * caller passes the localized "User" string.
 */
export function authorName(user: AuthorLike | null | undefined, fallback: string): string {
  const name = user?.name?.trim();
  if (name) return name;
  const local = user?.email?.split("@")[0]?.trim();
  return local || fallback;
}

/** First letter for the avatar chip. */
export function authorInitial(user: AuthorLike | null | undefined, fallback: string): string {
  return authorName(user, fallback).charAt(0).toUpperCase();
}

/** Human label for a discussion space's level (null = the whole skill). */
export function levelLabel(level: number | null, t: Translate): string {
  return level === null ? t("forum.levelGeneral") : t("forum.levelN", { level });
}

/** Parse a `?level=` search param into null (General) or a valid 1..99 level. */
export function parseLevelParam(value: string | undefined): number | null {
  if (!value || value === "ogolne") return null;
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n >= 1 && n <= MAX_LEVEL ? n : null;
}
