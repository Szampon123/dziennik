// Curated learning resources attached to a milestone — a small, ordered list of
// links (a video, an article, a course, reference docs, a tool). Unlike the
// instrument `videoJson` (YouTube-specific), a resource can point at any
// verified page. Client-safe (pure types + a tolerant parser).

import type { MessageKey } from "@/lib/i18n/messages";

export const RESOURCE_KINDS = ["video", "article", "course", "reference", "tool"] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export type MilestoneResource = {
  kind: ResourceKind;
  url: string;
  title: string;
};

const KINDS = new Set<string>(RESOURCE_KINDS);

function isHttpUrl(u: unknown): u is string {
  return typeof u === "string" && /^https:\/\/[^\s]+$/i.test(u) && u.length <= 2048;
}

/** Parse the stored resourcesJson (an array). Tolerant of null/garbage. */
export function parseResources(json: string | null): MilestoneResource[] {
  if (!json) return [];
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    const out: MilestoneResource[] = [];
    for (const r of arr) {
      if (
        r &&
        typeof r === "object" &&
        KINDS.has(r.kind) &&
        isHttpUrl(r.url) &&
        typeof r.title === "string" &&
        r.title.trim().length > 0
      ) {
        out.push({ kind: r.kind, url: r.url, title: r.title.slice(0, 120) });
      }
    }
    return out;
  } catch {
    return [];
  }
}

/** Message key for a resource kind (used as a fallback / a11y hint). */
export const RESOURCE_KIND_KEY: Record<ResourceKind, MessageKey> = {
  video: "resource.kind.video",
  article: "resource.kind.article",
  course: "resource.kind.course",
  reference: "resource.kind.reference",
  tool: "resource.kind.tool",
};
