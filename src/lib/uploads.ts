// Storage for user-uploaded files (milestone proof photos).
//
// Two backends, chosen at runtime:
//   • Local filesystem (default, local dev) — files live OUTSIDE public/ under
//     ./uploads and are served only through the authorized API route.
//   • Vercel Blob (when BLOB_READ_WRITE_TOKEN is set, i.e. on Vercel) — the
//     serverless filesystem is ephemeral/read-only, so photos go to Blob.
//
// The DB column `photoPath` stores whichever reference the active backend
// returns: a relative key (filesystem) or an https:// URL (Blob). Reads detect
// the kind by the `http(s)://` prefix, so a photo saved on one backend is still
// readable after switching. Blob URLs stay server-side only (streamed through
// the authorized route), preserving the per-user privacy guarantee.
import path from "path";

export const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

// Allowed photo types → file extension. Screenshots are png/jpeg/webp.
export const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Kept under Vercel's ~4.5 MB serverless request-body limit (photos travel
// through a Server Action). The next.config bodySizeLimit leaves the overhead.
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024; // 4 MB

/** Deterministic storage key for a user's photo of a given milestone. */
export function photoStorageKey(userId: string, milestoneId: string, ext: string): string {
  return `milestones/${userId}/${milestoneId}.${ext}`;
}

function isBlobRef(ref: string): boolean {
  return /^https?:\/\//i.test(ref);
}

function blobEnabled(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

/** Absolute path for a stored relative photo key, guarded against traversal. */
export function absolutePhotoPath(relativePath: string): string | null {
  const abs = path.resolve(UPLOADS_ROOT, relativePath);
  if (!abs.startsWith(path.resolve(UPLOADS_ROOT) + path.sep)) return null;
  return abs;
}

export function contentTypeForPath(ref: string): string {
  const ext = path.extname(ref).toLowerCase();
  for (const [mime, e] of Object.entries(PHOTO_TYPES)) {
    if (`.${e}` === ext) return mime;
  }
  return "application/octet-stream";
}

/**
 * Persist a photo and return the reference to store in the DB.
 * Blob backend → https:// URL; filesystem backend → the relative key.
 */
export async function savePhoto(
  key: string,
  bytes: Buffer,
  contentType: string
): Promise<string> {
  if (blobEnabled()) {
    const { put } = await import("@vercel/blob");
    // Unique URL per upload; the caller deletes the previous ref, so re-uploads
    // never collide (no overwrite needed) and stale blobs get cleaned up.
    const { url } = await put(key, bytes, {
      access: "public",
      contentType,
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return url;
  }
  const abs = absolutePhotoPath(key);
  if (!abs) throw new Error("Invalid photo path");
  const { mkdir, writeFile } = await import("fs/promises");
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, bytes);
  return key;
}

/** Read a stored photo by its DB reference. Returns null if missing. */
export async function readPhoto(
  ref: string
): Promise<{ data: Uint8Array<ArrayBuffer>; contentType: string } | null> {
  if (isBlobRef(ref)) {
    try {
      const res = await fetch(ref, { cache: "no-store" });
      if (!res.ok) return null;
      const data = new Uint8Array(await res.arrayBuffer());
      return { data, contentType: res.headers.get("content-type") || contentTypeForPath(ref) };
    } catch {
      return null;
    }
  }
  const abs = absolutePhotoPath(ref);
  if (!abs) return null;
  try {
    const { readFile } = await import("fs/promises");
    const data = await readFile(abs);
    return { data: new Uint8Array(data), contentType: contentTypeForPath(ref) };
  } catch {
    return null;
  }
}

/** Delete a stored photo by its DB reference. Best-effort (never throws). */
export async function deletePhoto(ref: string): Promise<void> {
  if (isBlobRef(ref)) {
    try {
      const { del } = await import("@vercel/blob");
      await del(ref, { token: process.env.BLOB_READ_WRITE_TOKEN });
    } catch {
      // ignore — a missing blob is fine
    }
    return;
  }
  const abs = absolutePhotoPath(ref);
  if (!abs) return;
  try {
    const { rm } = await import("fs/promises");
    await rm(abs, { force: true });
  } catch {
    // ignore
  }
}
