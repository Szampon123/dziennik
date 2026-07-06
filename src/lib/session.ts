// Session helpers — every page/action/route resolves the current user
// through these, so data access is always scoped to the signed-in user.
// JWT sessions can outlive their User row (e.g. after a DB reset), so we
// verify the user still exists before trusting the token.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function resolveUserId(): Promise<string | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  return user?.id ?? null;
}

/** For pages and server actions: returns the user id or redirects to /login. */
export async function requireUserId(): Promise<string> {
  const userId = await resolveUserId();
  if (!userId) redirect("/login");
  return userId;
}

/** For API route handlers: returns the user id or null (caller sends 401). */
export async function getSessionUserId(): Promise<string | null> {
  return resolveUserId();
}
