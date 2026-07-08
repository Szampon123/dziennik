// Notion integration — publishes closed days as subpages of the user's
// configured parent page. Each user stores their own integration token and
// parent page id (Settings view → User row). Notion is a copy/publication
// target, never the source of truth; sync failures must never block local writes.
import { Client, APIResponseError } from "@notionhq/client";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { parsePriorities, parsePrioritiesDone, NOTE_TYPE_LABELS, type NoteType } from "@/lib/day";
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

/** Human-readable message for common Notion API failures. */
function describeError(e: unknown): string {
  if (e instanceof APIResponseError) {
    switch (e.code) {
      case "rate_limited":
        return "Notion ograniczył liczbę zapytań (rate limit). Spróbuj ponownie za chwilę.";
      case "unauthorized":
        return "Nieprawidłowy token Notion. Sprawdź token w Ustawieniach.";
      case "object_not_found":
        return "Nie znaleziono strony w Notion. Sprawdź ID strony-rodzica i udostępnij ją integracji.";
      default:
        return `Błąd API Notion: ${e.code}`;
    }
  }
  if (e instanceof Error && "code" in e && (e as NodeJS.ErrnoException).code === "ENOTFOUND") {
    return "Brak połączenia z internetem — nie udało się połączyć z Notion.";
  }
  return "Nieznany błąd synchronizacji z Notion.";
}

/** Verify a token by fetching the parent page. Used by Settings (form test + status). */
export async function testNotionConnection(config: NotionConfig): Promise<NotionStatus> {
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
    return { state: "error", message: describeError(e) };
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
function buildBlocks(day: DayWithNotes): Block[] {
  const blocks: Block[] = [];
  const priorities = parsePriorities(day.prioritiesJson);
  const prioritiesDone = parsePrioritiesDone(day.prioritiesDoneJson, priorities.length);

  blocks.push(heading("Intencja"));
  blocks.push(paragraph(day.morningIntent?.trim() || "—"));

  blocks.push(heading("Priorytety"));
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

  blocks.push(heading("Notatki z dnia"));
  if (day.notes.length === 0) {
    blocks.push(paragraph("—"));
  } else {
    for (const note of day.notes) {
      const time = formatTime(new Date(note.createdAt));
      const label = NOTE_TYPE_LABELS[note.type as NoteType] ?? note.type;
      blocks.push({
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: richText(`${time} · ${label} — ${note.content}`) },
      });
    }
  }

  blocks.push(heading("Refleksja"));
  blocks.push(paragraph(`Co poszło dobrze: ${day.reflectionGood?.trim() || "—"}`));
  blocks.push(paragraph(`Do poprawy: ${day.reflectionBad?.trim() || "—"}`));

  blocks.push(heading("Oceny"));
  blocks.push(paragraph(`Ocena dnia: ${day.dayRating ?? "—"}/5 · Poziom energii: ${day.energyLevel ?? "—"}/5`));

  // Day-progress line: calendar checkpoints (snapshot taken at close) + priorities.
  const progressParts: string[] = [];
  if (day.tasksTotal !== null && day.tasksTotal > 0) {
    const pct = Math.round(((day.tasksDone ?? 0) / day.tasksTotal) * 100);
    progressParts.push(`kalendarz ${day.tasksDone ?? 0}/${day.tasksTotal} (${pct}%)`);
  }
  if (priorities.length > 0) {
    progressParts.push(
      `priorytety ${prioritiesDone.filter(Boolean).length}/${priorities.length}`
    );
  }
  if (progressParts.length > 0) {
    blocks.push(heading("Postęp dnia"));
    blocks.push(paragraph(`Zadania: ${progressParts.join(" · ")}`));
  }

  return blocks;
}

function pageTitle(day: DayWithNotes): string {
  return `${day.date} — ${formatDayLong(day.date)}`;
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
  const day = await prisma.dayEntry.findUnique({
    where: { userId_date: { userId, date } },
    include: { notes: { orderBy: { createdAt: "asc" } } },
  });
  if (!day) return { ok: false, error: "Nie znaleziono wpisu dla tego dnia." };

  const config = await getNotionConfig(userId);
  if (!config) {
    const error = "Integracja Notion nieskonfigurowana — uzupełnij token i stronę-rodzica w Ustawieniach.";
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
  const blocks = buildBlocks(day);

  try {
    let pageId = day.notionPageId;

    if (pageId) {
      // Update path: refresh title and replace all content blocks.
      try {
        await notion.pages.update({
          page_id: pageId,
          properties: { title: { title: richText(pageTitle(day)) } },
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
        properties: { title: { title: richText(pageTitle(day)) } },
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
    const error = describeError(e);
    await prisma.dayEntry.update({
      where: { id: day.id },
      data: { syncStatus: "error", syncError: error },
    });
    return { ok: false, error };
  }
}
