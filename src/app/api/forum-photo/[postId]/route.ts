// Serves a forum post's attached photo. Files live outside public/, so this
// route is the only way to reach them. The forum is shared among all users, so
// any signed-in user may view an attachment (auth still required).
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/session";
import { readPhoto } from "@/lib/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { postId } = await params;
  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
    select: { photoPath: true },
  });
  if (!post?.photoPath) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const photo = await readPhoto(post.photoPath);
  if (!photo) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return new NextResponse(new Blob([photo.data], { type: photo.contentType }), {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
