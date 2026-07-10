"use server";

// Admin panel server actions. A Server Function is reachable as a POST to the
// route it is used on, so the proxy's route gating is NOT a permission check
// for these — every action authorises the caller itself, before it reads or
// writes anything.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { fail } from "@/lib/action-errors";
import { requireAdmin } from "@/lib/session";
import { normalizeRole, isOwnerRole, isAdminRole, type Role, ROLES } from "@/lib/roles";

export type AdminUserRow = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  createdAt: string; // ISO string for serialisation
};

export type RoleChangeRow = {
  id: string;
  targetEmail: string | null;
  targetName: string | null;
  changerEmail: string | null;
  changerName: string | null;
  oldRole: string;
  newRole: string;
  reason: string | null;
  createdAt: string;
};

/** List all users (admin+ only). */
export async function listUsers(): Promise<AdminUserRow[]> {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));
}

/**
 * Change a user's role, recording an audit row in the same transaction.
 *
 * Permission matrix:
 *   - the owner's role is immutable here (only the OWNER_EMAIL env var sets it)
 *   - "owner" can never be assigned through the UI
 *   - promoting to / demoting from "admin" → owner only
 *   - suspending / restoring a regular user → any admin or the owner
 */
export async function changeUserRole(input: {
  targetUserId: string;
  newRole: string;
  reason?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  // Authorise first: everything below leaks whether a user id exists and what
  // role it holds, so no caller reaches it without at least admin rights.
  const actorId = await requireAdmin();

  const { targetUserId, newRole: newRoleRaw, reason } = input;
  if (!(ROLES as readonly string[]).includes(newRoleRaw)) {
    return fail("errors.invalidRole");
  }
  const newRole = newRoleRaw as Role;

  const [actor, target] = await Promise.all([
    prisma.user.findUnique({ where: { id: actorId }, select: { role: true } }),
    prisma.user.findUnique({ where: { id: targetUserId }, select: { id: true, role: true } }),
  ]);
  if (!target) return fail("errors.userNotFound");

  const actorIsOwner = isOwnerRole(normalizeRole(actor?.role));
  const oldRole = normalizeRole(target.role);
  if (oldRole === newRole) return { ok: true }; // no-op

  if (isOwnerRole(oldRole)) {
    return fail("errors.ownerRoleImmutable");
  }
  if (isOwnerRole(newRole)) {
    return fail("errors.ownerRoleEnvOnly");
  }
  // Touching an admin — either promoting to or demoting from — is owner-only.
  if ((isAdminRole(oldRole) || isAdminRole(newRole)) && !actorIsOwner) {
    return fail("errors.ownerOnlyAdmins");
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: targetUserId }, data: { role: newRole } }),
    prisma.roleChange.create({
      data: { targetId: targetUserId, changedBy: actorId, oldRole, newRole, reason },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/history");
  return { ok: true };
}

/** Recent role changes (admin+ only). */
export async function listRoleChanges(limit = 50): Promise<RoleChangeRow[]> {
  await requireAdmin();
  const changes = await prisma.roleChange.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      target: { select: { email: true, name: true } },
      changer: { select: { email: true, name: true } },
    },
  });
  return changes.map((c) => ({
    id: c.id,
    targetEmail: c.target.email,
    targetName: c.target.name,
    changerEmail: c.changer.email,
    changerName: c.changer.name,
    oldRole: c.oldRole,
    newRole: c.newRole,
    reason: c.reason,
    createdAt: c.createdAt.toISOString(),
  }));
}
