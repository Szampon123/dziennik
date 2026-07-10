// Notion integration — publishes closed days as subpages of the user's
// configured parent page. Each user stores their own integration token and
// parent page id (Settings view → User row). Notion is a copy/publication
// target, never the source of truth; sync failures must never block local writes.
import { Client, APIResponseError } from "@notionhq/client";
import { prisma } from "@/lib/prisma";
import { getLocale, translate } from "@/lib/i18n/server";
import type { MessageKey } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/config";
import { decrypt } from "@/lib/crypto";
import { parsePriorities, parsePrioritiesDone } from "@/lib/day";
import { formatDayLong, formatTime } from "@/lib/dates";
import type { DayEntry, Note } from "@prisma/client";

type DayWithNotes = DayEntry & { notes: Note[] };

export type NotionStatus =
  | { state: "not_configured" }
  | { state: "ok"; parentTitle: string | null }
  | { state: "error"; message: string };

type NotionConfig = { token: string; parentPageId: string };

/** The user's Notion config, or null when not set up. */
export async function getNotionConfig(userId: string): Promise<NotionConfig | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notionToken: true, notionParentPageId: true },
  });
  if (!user?.notionToken || !user.notionParentPageId) return null;
  // notionToken is stored encrypted; parentPageId is a public id (kept plain).
  return { token: decrypt(user.notionToken), parentPageId: user.notionParentPageId };
}

export async function isNotionConfigured(userId: string): Promise<boolean> {
  return (await getNotionConfig(userId)) !== null;
}

/** Human-readable message for common Notion API failures, in `locale`. */
function describeError(e: unknown, locale: Locale): string {
  if (e instanceof APIResponseError) {
    switch (e.code) {
      case "rate_limited":
        return translate(locale, "notion.errRateLimited");
      case "unauthorized":
        return translate(locale, "notion.errUnauthorized");
      case "object_not_found":
        return translate(locale, "notion.errNotFound");
      default:
        return translate(locale, "notion.errApi", { code: e.code });
    }
  }
  if (e instanceof Error && "code" in e && (e as NodeJS.ErrnoException).code === "ENOTFOUND") {
    return translate(locale, "notion.errNoInternet");
  }
  return translate(locale, "notion.errUnknown");
}

/** Verify a token by fetching the parent page. Used by Settings (form test + status). */
export async function testNotionConnection(config: NotionConfig): Promise<NotionStatus> {
  const locale = await getLocale();
  try {
    const notion = new Client({ auth: config.token });
    const page = await notion.pages.retrieve({ page_id: config.parentPageId });
    let parentTitle: string | null = null;
    if ("properties" in page) {
      const titleProp = Object.values(page.properties).find((p) => p.type === "title");
      if (titleProp && titleProp.type === "title") {
        parentTitle = titleProp.title.map((t) => t.plain_text).join("") || null;
      }
    }
    return { state: "ok", parentTitle };
  } catch (e) {
    return { state: "error", message: describeError(e, locale) };
  }
}

export async function getNotionStatus(userId: string): Promise<NotionStatus> {
  const config = await getNotionConfig(userId);
  if (!config) return { state: "not_configured" };
  return testNotionConnection(config);
}

type Block = Parameters<Client["blocks"]["children"]["append"]>[0]["children"][number];

const richText = (content: string) => [{ type: "text" as const, text: { content } }];

function heading(text: string): Block {
  return { type: "heading_2", heading_2: { rich_text: richText(text) } };
}

function paragraph(text: string): Block {
  return { type: "paragraph", paragraph: { rich_text: richText(text) } };
}

/** Build the daily-brief block list for a day entry. */
function buildBlocks(day: DayWithNotes, locale: Locale): Block[] {
  const blocks: Block[] = [];
  const priorities = parsePriorities(day.prioritiesJson);
  const prioritiesDone = parsePrioritiesDone(day.prioritiesDoneJson, priorities.length);

  blocks.push(heading(translate(locale, "notion.intention")));
  blocks.push(paragraph(day.morningIntent?.trim() || "—"));

  blocks.push(heading(translate(locale, "notion.priorities")));
  if (priorities.length === 0) {
    blocks.push(paragraph("—"));
  } else {
    priorities.forEach((p, i) => {
      blocks.push({
        type: "to_do",
        to_do: { rich_text: richText(p), checked: prioritiesDone[i] },
      });
    });
  }

  blocks.push(heading(translate(locale, "notion.dayNotes")));
  if (day.notes.length === 0) {
    blocks.push(paragraph("—"));
  } else {
    for (const note of day.notes) {
      const time = formatTime(new Date(note.createdAt), locale);
      const label = translate(locale, `note.type.${note.type}` as MessageKey);
      blocks.push({
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: richText(`${time} · ${label} — ${note.content}`) },
      });
    }
  }

  blocks.push(heading(translate(locale, "notion.reflection")));
  blocks.push(paragraph(translate(locale, "notion.wentWell", { text: day.reflectionGood?.trim() || "—" })));
  blocks.push(paragraph(translate(locale, "notion.toImprove", { text: day.reflectionBad?.trim() || "—" })));

  blocks.push(heading(translate(locale, "notion.ratings")));
  blocks.push(paragraph(translate(locale, "notion.ratingLine", { rating: day.dayRating ?? "—", energy: day.energyLevel ?? "—" })));

  // Day-progress line: calendar checkpoints (snapshot taken at close) + priorities.
  const progressParts: string[] = [];
  if (day.tasksTotal !== null && day.tasksTotal > 0) {
    const pct = Math.round(((day.tasksDone ?? 0) / day.tasksTotal) * 100);
    progressParts.push(translate(locale, "notion.calendarPart", { done: day.tasksDone ?? 0, total: day.tasksTotal, pct }));
  }
  if (priorities.length > 0) {
    progressParts.push(
      translate(locale, "notion.prioritiesPart", { done: prioritiesDone.filter(Boolean).length, total: priorities.length })
    );
  }
  if (progressParts.length > 0) {
    blocks.push(heading(translate(locale, "notion.dayProgress")));
    blocks.push(paragraph(translate(locale, "notion.tasksLine", { parts: progressParts.join(" · ") })));
  }

  return blocks;
}

function pageTitle(day: DayWithNotes, locale: Locale): string {
  return `${day.date} — ${formatDayLong(day.date, locale)}`;
}

/** Remove all existing content blocks from a page (used before re-sync). */
async function clearPageBlocks(notion: Client, pageId: string): Promise<void> {
  let cursor: string | undefined;
  const ids: string[] = [];
  do {
    const res = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });
    ids.push(...res.results.map((b) => b.id));
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  for (const id of ids) {
    await notion.blocks.delete({ block_id: id });
  }
}

export type SyncResult = { ok: true } | { ok: false; error: string };

/**
 * Create or update the Notion daily-brief page for the user's given date.
 * Persists notionPageId / syncStatus / syncError on the DayEntry.
 */
export async function syncDayToNotion(userId: string, date: string): Promise<SyncResult> {
  const locale = await getLocale();
  const day = await prisma.dayEntry.findUnique({
    where: { userId_date: { userId, date } },
    include: { notes: { orderBy: { createdAt: "asc" } } },
  });
  if (!day) return { ok: false, error: translate(locale, "errors.dayEntryNotFound") };

  const config = await getNotionConfig(userId);
  if (!config) {
    const error = translate(locale, "notion.errNotConfigured");
    await prisma.dayEntry.update({
      where: { id: day.id },
      data: { syncStatus: "error", syncError: error },
    });
    return { ok: false, error };
  }

  await prisma.dayEntry.update({
    where: { id: day.id },
    data: { syncStatus: "pending", syncError: null },
  });

  const notion = new Client({ auth: config.token });
  // The Notion page is written for the person who owns it, so it follows the
  // locale of the request that triggered the sync (a server action or the
  // /api/notion/sync route — both carry the cookie).
  const blocks = buildBlocks(day, locale);

  try {
    let pageId = day.notionPageId;

    if (pageId) {
      // Update path: refresh title and replace all content blocks.
      try {
        await notion.pages.update({
          page_id: pageId,
          properties: { title: { title: richText(pageTitle(day, locale)) } },
        });
        await clearPageBlocks(notion, pageId);
        await notion.blocks.children.append({ block_id: pageId, children: blocks });
      } catch (e) {
        // Page was deleted/archived in Notion — fall back to creating a new one.
        if (e instanceof APIResponseError && e.code === "object_not_found") {
          pageId = null;
        } else {
          throw e;
        }
      }
    }

    if (!pageId) {
      const page = await notion.pages.create({
        parent: { page_id: config.parentPageId },
        properties: { title: { title: richText(pageTitle(day, locale)) } },
        children: blocks,
      });
      pageId = page.id;
    }

    await prisma.dayEntry.update({
      where: { id: day.id },
      data: { notionPageId: pageId, syncStatus: "synced", syncError: null },
    });
    return { ok: true };
  } catch (e) {
    console.error("Notion sync failed:", e);
    const error = describeError(e, locale);
    await prisma.dayEntry.update({
      where: { id: day.id },
      data: { syncStatus: "error", syncError: error },
    });
    return { ok: false, error };
  }
}
