"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, issueKey } from "@/lib/action-errors";
import { requireUserId } from "@/lib/session";
import { verifyPassword } from "@/lib/passwords";
import { normalizeRole } from "@/lib/roles";
import { revokeGoogleAccess } from "@/lib/google";
import { deletePhoto } from "@/lib/uploads";
import { signOut } from "@/lib/auth";

const schema = z.object({
  // One of the two is required, decided by whether the account has a password.
  // Both are optional here and checked against the account below, so a client
  // that sends the wrong one gets "confirmation failed", not a schema error.
  password: z.string().optional().default(""),
  email: z.string().optional().default(""),
});

export type DeleteAccountResult = { ok: false; error: string };

/**
 * Erase the signed-in user: their Google grant, their photos, every row they own,
 * and the User itself. Irreversible, immediate, no grace period.
 *
 * ── Order matters, and it is not the obvious one ──────────────────────────────
 * Photos are deleted from Blob *before* the DB rows, because the rows are the
 * only record of where the files are. Delete the User first and the cascade takes
 * MilestoneEntry.photoPath and ForumPost.photoPath with it, and the blobs are
 * orphaned forever — paid for, unreachable, and still holding someone's private
 * photographs after they asked us to erase them.
 *
 * Everything before the transaction is best-effort: a Google outage or a single
 * missing blob must not strand a user who asked to be deleted. Those failures are
 * logged and swallowed. The DB deletion is the one step allowed to fail loudly —
 * if it does, nothing is lost and the user can retry.
 *
 * The cascade in schema.prisma covers every table that references User, so one
 * user.delete() is enough. VerificationToken is the exception: it is keyed on the
 * e-mail string with no relation to User, so nothing cascades to it and it is
 * deleted explicitly. See the audit in lib/legal/privacy.ts.
 */
export async function deleteAccount(
  input: z.input<typeof schema>
): Promise<DeleteAccountResult> {
  const userId = await requireUserId();

  const parsed = schema.safeParse(input);
  if (!parsed.success) return fail(issueKey(parsed.error));

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, passwordHash: true, role: true },
  });
  if (!user) return fail("errors.badRequest");

  // The owner cannot delete themselves through the app. bootstrapRole() re-grants
  // the role from OWNER_EMAIL on the next sign-in, so this would not even be a
  // clean exit — it would destroy the owner's journal and hand the rebuilt account
  // back to them empty. Deliberate, and deliberately not overridable from the UI.
  if (normalizeRole(user.role) === "owner") {
    return fail("errors.ownerCannotDelete");
  }

  // Confirmation. A password account proves it with the password; a Google-only
  // account has none, so it retypes its own address instead. Both are checked
  // server-side: the client decides which field to *show*, never which to trust.
  if (user.passwordHash) {
    const password = parsed.data.password;
    if (!password || !(await verifyPassword(password, user.passwordHash))) {
      return fail("errors.deleteWrongPassword");
    }
  } else {
    const typed = parsed.data.email.trim().toLowerCase();
    const actual = (user.email ?? "").trim().toLowerCase();
    if (!actual || typed !== actual) {
      return fail("errors.deleteWrongEmail");
    }
  }

  // 1. Hand the Google grant back before we lose the token that lets us do it.
  try {
    await revokeGoogleAccess(userId);
  } catch (error) {
    console.error("[DELETE] google revoke failed for", userId, error);
  }

  // 2. Photos, while the rows still say where they are.
  const [milestonePhotos, forumPhotos] = await Promise.all([
    prisma.milestoneEntry.findMany({
      where: { userId, photoPath: { not: null } },
      select: { photoPath: true },
    }),
    prisma.forumPost.findMany({
      where: { userId, photoPath: { not: null } },
      select: { photoPath: true },
    }),
  ]);

  const refs = [...milestonePhotos, ...forumPhotos]
    .map((row) => row.photoPath)
    .filter((ref): ref is string => Boolean(ref));

  for (const ref of refs) {
    try {
      await deletePhoto(ref);
    } catch (error) {
      // A blob that is already gone is not a reason to refuse someone erasure.
      console.error("[DELETE] photo delete failed:", ref, error);
    }
  }

  // 3. The rows. VerificationToken first — it has no FK to cascade through.
  const email = user.email;
  await prisma.$transaction(async (tx) => {
    if (email) {
      await tx.verificationToken.deleteMany({ where: { identifier: email } });
    }
    await tx.user.delete({ where: { id: userId } });
  });

  console.log("[DELETE] account erased:", userId, `(${refs.length} photos)`);

  // 4. Clear the cookie and leave. The JWT still decodes for its remaining life,
  // so signing out is what actually ends the session — though the jwt callback in
  // lib/auth.ts would also strip the claims on the next request, the User row
  // being gone.
  await signOut({ redirectTo: "/" });

  // signOut() redirects, so this is unreachable. It exists so the function has a
  // return type the caller can narrow on for the failure branches above.
  return fail("errors.badRequest");
}
