// Session helpers — every page/action/route resolves the current user
// through these, so data access is always scoped to the signed-in user.
// JWT sessions can outlive their User row (e.g. after a DB reset), so we
// verify the user still exists before trusting the token.
//
// These helpers — not the proxy — are what actually enforces suspension. The
// proxy decodes the session *cookie*, and calling auth() while rendering an RSC
// cannot rewrite that cookie, so a freshly suspended user carries a stale
// "role" claim until the cookie next rotates. Reading the role from the DB here
// costs nothing (the existence check already queries this row) and makes the
// lockout immediate; the proxy stays the fast first-line filter.
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeRole, isAdminRole, isOwnerRole, isSuspendedRole, type Role } from "@/lib/roles";

/** `userId` is null for "no usable session"; `suspended` says why. */
type Resolved = { userId: string | null; suspended: boolean };

async function resolveUser(): Promise<Resolved> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { userId: null, suspended: false };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user) return { userId: null, suspended: false };
  if (isSuspendedRole(normalizeRole(user.role))) return { userId: null, suspended: true };
  return { userId: user.id, suspended: false };
}

/**
 * Resolves the signed-in user and checks their *current* DB role against
 * `allow`. Unauthenticated → /login; wrong role → / (never a 403 page, so an
 * admin URL is indistinguishable from a typo to a regular user).
 */
async function requireRole(allow: (role: Role) => boolean): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
  if (!user) redirect("/login");

  const role = normalizeRole(user.role);
  if (isSuspendedRole(role) || !allow(role)) redirect("/");

  return user.id;
}

/** For pages and server actions: returns the user id or redirects away. */
export async function requireUserId(): Promise<string> {
  const resolved = await resolveUser();
  if (resolved.userId) return resolved.userId;
  redirect(resolved.suspended ? "/suspended" : "/login");
}

/** For API route handlers: returns the user id or null (caller sends 401). */
export async function getSessionUserId(): Promise<string | null> {
  return (await resolveUser()).userId;
}

/** For admin pages/actions: returns the user id or redirects if not admin+. */
export async function requireAdmin(): Promise<string> {
  return requireRole(isAdminRole);
}

/** For owner-only actions (e.g. managing admins): returns the user id or redirects. */
export async function requireOwner(): Promise<string> {
  return requireRole(isOwnerRole);
}
