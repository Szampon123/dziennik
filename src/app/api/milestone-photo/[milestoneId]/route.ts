// Serves a user's milestone proof photo. Files live outside public/ so this
// route is the only way to reach them — and it only ever returns the photo
// belonging to the SIGNED-IN user for that milestone (no cross-user access).
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { absolutePhotoPath, contentTypeForPath } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ milestoneId: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { milestoneId } = await params;
  const entry = await prisma.milestoneEntry.findUnique({
    where: { userId_milestoneId: { userId, milestoneId } },
    select: { photoPath: true },
  });
  if (!entry?.photoPath) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const abs = absolutePhotoPath(entry.photoPath);
  if (!abs) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let data: Buffer;
  try {
    data = await readFile(abs);
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentTypeForPath(entry.photoPath),
      // Private + revalidate: the photo can be replaced; the client busts the
      // cache with a ?v=updatedAt query param anyway.
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
