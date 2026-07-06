// Storage for user-uploaded files (milestone proof photos).
// Files live OUTSIDE public/ (privacy: multi-user app) and are served only
// through the authorized API route. Paths stored in DB are relative to
// UPLOADS_ROOT and always built server-side — never from user input.
import path from "path";

export const UPLOADS_ROOT = path.join(process.cwd(), "uploads");

// Allowed photo types → file extension. Screenshots are png/jpeg/webp.
export const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_PHOTO_BYTES = 6 * 1024 * 1024; // 6 MB (action body limit is 8 MB)

/** Absolute path for a stored relative photo path, guarded against traversal. */
export function absolutePhotoPath(relativePath: string): string | null {
  const abs = path.resolve(UPLOADS_ROOT, relativePath);
  if (!abs.startsWith(path.resolve(UPLOADS_ROOT) + path.sep)) return null;
  return abs;
}

export function contentTypeForPath(relativePath: string): string {
  const ext = path.extname(relativePath).toLowerCase();
  for (const [mime, e] of Object.entries(PHOTO_TYPES)) {
    if (`.${e}` === ext) return mime;
  }
  return "application/octet-stream";
}
