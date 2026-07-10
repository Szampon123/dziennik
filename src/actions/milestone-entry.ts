"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { getLocale } from "@/lib/i18n/server";
import { getMilestoneTitle, getMilestoneDetail } from "@/lib/i18n/translate";
import { requireUserId } from "@/lib/session";
import {
  PHOTO_TYPES,
  MAX_PHOTO_BYTES,
  photoStorageKey,
  savePhoto,
  deletePhoto,
} from "@/lib/uploads";
import type { ActionResult } from "@/actions/day-entry";

const MAX_NOTE_LENGTH = 500;
const MAX_TITLE_LENGTH = 200;
const MAX_DETAIL_LENGTH = 500;

async function findMilestoneSlug(milestoneId: string) {
  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    select: { id: true, activity: { select: { slug: true } } },
  });
  return milestone ? milestone.activity.slug : null;
}

function revalidateActivity(slug: string) {
  revalidatePath("/activities");
  revalidatePath(`/activities/${slug}`);
}

/** Deletes the entry row when it holds no note, photo, or level customisation. */
async function pruneEmptyEntry(userId: string, milestoneId: string) {
  const entry = await prisma.milestoneEntry.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
    select: { note: true, photoPath: true, customTitle: true, customDetail: true },
  });
  if (entry && !entry.note && !entry.photoPath && !entry.customTitle && !entry.customDetail) {
    await prisma.milestoneEntry.delete({
      where: { userId_milestoneId: { userId, milestoneId } },
    });
  }
}

const noteSchema = z.object({
  milestoneId: z.string().min(1),
  note: z.string().max(MAX_NOTE_LENGTH, "errors.milestoneNoteTooLong"),
});

export async function saveMilestoneNote(
  input: z.input<typeof noteSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error), { maxNote: MAX_NOTE_LENGTH, maxTitle: MAX_TITLE_LENGTH, maxDetail: MAX_DETAIL_LENGTH });
  }
  const { milestoneId } = parsed.data;
  const note = parsed.data.note.trim() || null;

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return fail("errors.milestoneNotFound");

  await prisma.milestoneEntry.upsert({
    where: { userId_milestoneId: { userId, milestoneId } },
    update: { note },
    create: { userId, milestoneId, note },
  });
  await pruneEmptyEntry(userId, milestoneId);

  revalidateActivity(slug);
  return { ok: true };
}

const levelSchema = z.object({
  milestoneId: z.string().min(1),
  customTitle: z.string().max(MAX_TITLE_LENGTH, "errors.levelTitleTooLong"),
  customDetail: z.string().max(MAX_DETAIL_LENGTH, "errors.levelDetailTooLong"),
});

/**
 * Per-user override of a level's displayed goal. The seeded original is never
 * touched — a custom value that matches the original is stored as null (no
 * redundant override), so this doubles as "restore original" when unchanged.
 */
export async function saveMilestoneLevel(
  input: z.input<typeof levelSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = levelSchema.safeParse(input);
  if (!parsed.success) {
    return fail(issueKey(parsed.error), { maxNote: MAX_NOTE_LENGTH, maxTitle: MAX_TITLE_LENGTH, maxDetail: MAX_DETAIL_LENGTH });
  }
  const { milestoneId } = parsed.data;

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    select: {
      title: true,
      titleEn: true,
      titleDe: true,
      titleEs: true,
      detail: true,
      detailEn: true,
      detailDe: true,
      detailEs: true,
      activity: { select: { slug: true } },
    },
  });
  if (!milestone) return fail("errors.milestoneNotFound");

  if (!parsed.data.customTitle.trim()) {
    return fail("errors.levelTitleEmpty");
  }

  // Only store what actually differs from the seeded original — and "original"
  // means the text this user was shown, i.e. the seed resolved to their locale.
  // Comparing against the raw Polish would turn "opened the form in English and
  // saved it untouched" into a permanent per-user override of every level.
  const locale = await getLocale();
  const seededTitle = getMilestoneTitle(milestone, locale);
  const seededDetail = getMilestoneDetail(milestone, locale);

  const title = parsed.data.customTitle.trim();
  const detail = parsed.data.customDetail.trim();
  const customTitle = title === seededTitle.trim() ? null : title;
  const customDetail = detail === (seededDetail ?? "").trim() ? null : detail || null;

  await prisma.milestoneEntry.upsert({
    where: { userId_milestoneId: { userId, milestoneId } },
    update: { customTitle, customDetail },
    create: { userId, milestoneId, customTitle, customDetail },
  });
  await pruneEmptyEntry(userId, milestoneId);

  revalidateActivity(milestone.activity.slug);
  return { ok: true };
}

/** Restore the seeded original for a level, dropping the user's customisation. */
export async function resetMilestoneLevel(
  input: z.input<typeof deleteSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) return fail("errors.badRequest");
  const { milestoneId } = parsed.data;

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return fail("errors.milestoneNotFound");

  const entry = await prisma.milestoneEntry.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
    select: { customTitle: true, customDetail: true },
  });
  if (entry && (entry.customTitle || entry.customDetail)) {
    await prisma.milestoneEntry.update({
      where: { userId_milestoneId: { userId, milestoneId } },
      data: { customTitle: null, customDetail: null },
    });
    await pruneEmptyEntry(userId, milestoneId);
  }

  revalidateActivity(slug);
  return { ok: true };
}

export async function uploadMilestonePhoto(formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();

  const milestoneId = formData.get("milestoneId");
  const file = formData.get("photo");
  if (typeof milestoneId !== "string" || !milestoneId || !(file instanceof File)) {
    return fail("errors.badRequest");
  }

  const ext = PHOTO_TYPES[file.type];
  if (!ext) {
    return fail("errors.photoFormats");
  }
  if (file.size === 0) {
    return fail("errors.fileEmpty");
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return fail("errors.photoTooLarge");
  }

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return fail("errors.milestoneNotFound");

  // One photo per (user, milestone): a re-upload replaces the previous file.
  const previous = await prisma.milestoneEntry.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
    select: { photoPath: true },
  });

  const key = photoStorageKey(userId, milestoneId, ext);
  let photoRef: string;
  try {
    photoRef = await savePhoto(key, Buffer.from(await file.arrayBuffer()), file.type);
  } catch {
    return fail("errors.fileWriteFailed");
  }

  // Same milestone re-uploaded with a different extension → remove the old file.
  if (previous?.photoPath && previous.photoPath !== photoRef) {
    await deletePhoto(previous.photoPath);
  }

  await prisma.milestoneEntry.upsert({
    where: { userId_milestoneId: { userId, milestoneId } },
    update: { photoPath: photoRef },
    create: { userId, milestoneId, photoPath: photoRef },
  });

  revalidateActivity(slug);
  return { ok: true };
}

const deleteSchema = z.object({ milestoneId: z.string().min(1) });

export async function deleteMilestonePhoto(
  input: z.input<typeof deleteSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = deleteSchema.safeParse(input);
  if (!parsed.success) return fail("errors.badRequest");
  const { milestoneId } = parsed.data;

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return fail("errors.milestoneNotFound");

  const entry = await prisma.milestoneEntry.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
    select: { photoPath: true },
  });
  if (entry?.photoPath) {
    await deletePhoto(entry.photoPath);
    await prisma.milestoneEntry.update({
      where: { userId_milestoneId: { userId, milestoneId } },
      data: { photoPath: null },
    });
    await pruneEmptyEntry(userId, milestoneId);
  }

  revalidateActivity(slug);
  return { ok: true };
}
