"use server";

import { mkdir, rm, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { PHOTO_TYPES, MAX_PHOTO_BYTES, absolutePhotoPath } from "@/lib/uploads";
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
  note: z.string().max(MAX_NOTE_LENGTH, `Notatka może mieć maks. ${MAX_NOTE_LENGTH} znaków.`),
});

export async function saveMilestoneNote(
  input: z.input<typeof noteSchema>
): Promise<ActionResult> {
  const userId = await requireUserId();
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe żądanie." };
  }
  const { milestoneId } = parsed.data;
  const note = parsed.data.note.trim() || null;

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return { ok: false, error: "Nie znaleziono poziomu." };

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
  customTitle: z.string().max(MAX_TITLE_LENGTH, `Nazwa poziomu może mieć maks. ${MAX_TITLE_LENGTH} znaków.`),
  customDetail: z.string().max(MAX_DETAIL_LENGTH, `Opis może mieć maks. ${MAX_DETAIL_LENGTH} znaków.`),
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
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Nieprawidłowe żądanie." };
  }
  const { milestoneId } = parsed.data;

  const milestone = await prisma.milestone.findUnique({
    where: { id: milestoneId },
    select: { title: true, detail: true, activity: { select: { slug: true } } },
  });
  if (!milestone) return { ok: false, error: "Nie znaleziono poziomu." };

  if (!parsed.data.customTitle.trim()) {
    return { ok: false, error: "Nazwa poziomu nie może być pusta." };
  }

  // Only store what actually differs from the seeded original.
  const title = parsed.data.customTitle.trim();
  const detail = parsed.data.customDetail.trim();
  const customTitle = title === milestone.title.trim() ? null : title;
  const customDetail =
    detail === (milestone.detail ?? "").trim() ? null : detail || null;

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
  if (!parsed.success) return { ok: false, error: "Nieprawidłowe żądanie." };
  const { milestoneId } = parsed.data;

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return { ok: false, error: "Nie znaleziono poziomu." };

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
    return { ok: false, error: "Nieprawidłowe żądanie." };
  }

  const ext = PHOTO_TYPES[file.type];
  if (!ext) {
    return { ok: false, error: "Obsługiwane formaty: JPG, PNG, WEBP, GIF." };
  }
  if (file.size === 0) {
    return { ok: false, error: "Plik jest pusty." };
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return { ok: false, error: "Zdjęcie może mieć maks. 6 MB." };
  }

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return { ok: false, error: "Nie znaleziono poziomu." };

  // One photo per (user, milestone): a re-upload replaces the previous file.
  const previous = await prisma.milestoneEntry.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
    select: { photoPath: true },
  });

  const relativePath = path.join("milestones", userId, `${milestoneId}.${ext}`);
  const absPath = absolutePhotoPath(relativePath);
  if (!absPath) return { ok: false, error: "Błąd zapisu pliku." };

  await mkdir(path.dirname(absPath), { recursive: true });
  await writeFile(absPath, Buffer.from(await file.arrayBuffer()));

  // Same milestone re-uploaded with a different extension → remove the old file.
  if (previous?.photoPath && previous.photoPath !== relativePath) {
    const oldAbs = absolutePhotoPath(previous.photoPath);
    if (oldAbs) await rm(oldAbs, { force: true });
  }

  await prisma.milestoneEntry.upsert({
    where: { userId_milestoneId: { userId, milestoneId } },
    update: { photoPath: relativePath },
    create: { userId, milestoneId, photoPath: relativePath },
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
  if (!parsed.success) return { ok: false, error: "Nieprawidłowe żądanie." };
  const { milestoneId } = parsed.data;

  const slug = await findMilestoneSlug(milestoneId);
  if (!slug) return { ok: false, error: "Nie znaleziono poziomu." };

  const entry = await prisma.milestoneEntry.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
    select: { photoPath: true },
  });
  if (entry?.photoPath) {
    const abs = absolutePhotoPath(entry.photoPath);
    if (abs) await rm(abs, { force: true });
    await prisma.milestoneEntry.update({
      where: { userId_milestoneId: { userId, milestoneId } },
      data: { photoPath: null },
    });
    await pruneEmptyEntry(userId, milestoneId);
  }

  revalidateActivity(slug);
  return { ok: true };
}
