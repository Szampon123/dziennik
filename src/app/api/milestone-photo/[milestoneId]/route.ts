// Serves a user's milestone proof photo. Files live outside public/ so this
// route is the only way to reach them — and it only ever returns the photo
// belonging to the SIGNED-IN user for that milestone (no cross-user access).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { readPhoto } from "@/lib/uploads";

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

  const photo = await readPhoto(entry.photoPath);
  if (!photo) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return new NextResponse(new Blob([photo.data], { type: photo.contentType }), {
    headers: {
      "Content-Type": photo.contentType,
      // Private + revalidate: the photo can be replaced; the client busts the
      // cache with a ?v=updatedAt query param anyway.
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
