"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { normalizeRole, isAdminRole } from "@/lib/roles";
import { MAX_POST_BODY, MAX_LINK, MAX_LEVEL, isValidHttpUrl } from "@/lib/forum";
import { PHOTO_TYPES, MAX_PHOTO_BYTES, savePhoto, deletePhoto } from "@/lib/uploads";
import type { ActionResult } from "@/actions/day-entry";

export type CreatePostResult = { ok: true; id: string } | { ok: false; error: string };

function revalidateSkill(slug: string, postId?: string) {
  revalidatePath(`/forum/${slug}`);
  if (postId) revalidatePath(`/forum/${slug}/${postId}`);
}

/**
 * Create a message (top-level in a skill+level space, or a reply when parentId
 * is set). Accepts FormData so an optional photo File can ride along; an
 * optional linkUrl points at helpful material. Returns the new post id.
 */
export async function createPost(formData: FormData): Promise<CreatePostResult> {
  const userId = await requireUserId();

  const activitySlug = String(formData.get("activitySlug") ?? "").trim();
  const parentId = String(formData.get("parentId") ?? "").trim() || null;
  const levelRaw = String(formData.get("level") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const linkRaw = String(formData.get("linkUrl") ?? "").trim();
  const photo = formData.get("photo");

  if (!body) return { ok: false, error: "Napisz wiadomość." };
  if (body.length > MAX_POST_BODY)
    return { ok: false, error: `Wiadomość może mieć maks. ${MAX_POST_BODY} znaków.` };

  let linkUrl: string | null = null;
  if (linkRaw) {
    if (linkRaw.length > MAX_LINK || !isValidHttpUrl(linkRaw))
      return { ok: false, error: "Podaj poprawny link (http/https)." };
    linkUrl = linkRaw;
  }

  // A reply inherits its parent's skill+level; a top-level post takes them from
  // the form (validated against the activity list).
  let slug = activitySlug;
  let level: number | null = null;
  if (parentId) {
    const parent = await prisma.forumPost.findUnique({
      where: { id: parentId },
      select: { activitySlug: true, level: true },
    });
    if (!parent) return { ok: false, error: "Komentarz nie istnieje." };
    slug = parent.activitySlug;
    level = parent.level;
  } else {
    if (levelRaw) {
      const n = parseInt(levelRaw, 10);
      if (!Number.isInteger(n) || n < 1 || n > MAX_LEVEL)
        return { ok: false, error: `Poziom musi być liczbą 1–${MAX_LEVEL}.` };
      level = n;
    }
    const activity = await prisma.activity.findUnique({
      where: { slug },
      select: { slug: true },
    });
    if (!activity) return { ok: false, error: "Nieznana umiejętność." };
  }

  const post = await prisma.forumPost.create({
    data: { userId, activitySlug: slug, level, parentId, body, linkUrl },
    select: { id: true },
  });

  // Optional photo: validate type/size, store, attach.
  if (photo instanceof File && photo.size > 0) {
    const ext = PHOTO_TYPES[photo.type];
    if (!ext) {
      await prisma.forumPost.delete({ where: { id: post.id } });
      return { ok: false, error: "Zdjęcie musi być JPG, PNG, WEBP lub GIF." };
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      await prisma.forumPost.delete({ where: { id: post.id } });
      return { ok: false, error: "Zdjęcie może mieć maks. 4 MB." };
    }
    const bytes = Buffer.from(await photo.arrayBuffer());
    const ref = await savePhoto(`forum/${post.id}.${ext}`, bytes, photo.type);
    await prisma.forumPost.update({ where: { id: post.id }, data: { photoPath: ref } });
  }

  revalidateSkill(slug, parentId ?? undefined);
  return { ok: true, id: post.id };
}

export async function deletePost(input: { id: string }): Promise<ActionResult> {
  const userId = await requireUserId();
  const id = String(input?.id ?? "");
  if (!id) return { ok: false, error: "Nieprawidłowe żądanie." };

  const post = await prisma.forumPost.findUnique({
    where: { id },
    select: {
      userId: true,
      activitySlug: true,
      parentId: true,
      photoPath: true,
      replies: { select: { photoPath: true } },
    },
  });
  if (!post) return { ok: false, error: "Wiadomość nie istnieje." };

  const isOwn = post.userId === userId;
  if (!isOwn) {
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!isAdminRole(normalizeRole(me?.role)))
      return { ok: false, error: "Brak uprawnień do usunięcia tej wiadomości." };
  }

  await prisma.forumPost.delete({ where: { id } }); // cascade removes replies + votes
  // Best-effort disk/blob cleanup (DB cascade doesn't touch stored files).
  for (const ref of [post.photoPath, ...post.replies.map((r) => r.photoPath)]) {
    if (ref) await deletePhoto(ref);
  }

  revalidateSkill(post.activitySlug, post.parentId ?? undefined);
  return { ok: true };
}

/** Toggle the current user's "Pomocne" vote on a post. */
export async function togglePostVote(input: {
  postId: string;
}): Promise<{ ok: true; voted: boolean; count: number } | { ok: false; error: string }> {
  const userId = await requireUserId();
  const postId = String(input?.postId ?? "");
  if (!postId) return { ok: false, error: "Nieprawidłowe żądanie." };

  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
    select: { id: true, activitySlug: true, parentId: true },
  });
  if (!post) return { ok: false, error: "Wiadomość nie istnieje." };

  const existing = await prisma.forumVote.findUnique({
    where: { userId_postId: { userId, postId } },
    select: { userId: true },
  });

  let voted: boolean;
  if (existing) {
    await prisma.forumVote.delete({ where: { userId_postId: { userId, postId } } });
    voted = false;
  } else {
    await prisma.forumVote.create({ data: { userId, postId } });
    voted = true;
  }

  const count = await prisma.forumVote.count({ where: { postId } });
  revalidateSkill(post.activitySlug, post.parentId ?? postId);
  return { ok: true, voted, count };
}
