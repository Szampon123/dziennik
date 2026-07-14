import { requireUserId } from "@/lib/session";
import { rateLimitPersistent } from "@/lib/rate-limit-redis";
import { buildUserExport, exportFilename } from "@/lib/export";

// Reads the signed-in user's whole record; there is nothing here to cache, and a
// cached copy of somebody's journal is the last thing this app should produce.
export const dynamic = "force-dynamic";

/**
 * GDPR Art. 20 in one request: everything we hold about you, as a JSON download.
 *
 * A route handler rather than a server action because the result is a *file*.
 * Actions return values to React; this has to arrive with Content-Disposition so
 * the browser saves it, and be fetchable by pointing the window at a URL.
 *
 * Authorisation is the whole security model here: requireUserId() decides whose
 * data is assembled, and lib/export.ts only ever queries by that id. There is no
 * user parameter to tamper with, because taking one would be the bug.
 */
export async function GET() {
  const userId = await requireUserId();

  // Same shape as the verification-mail budget: an export is a heavy query over
  // every table this user touches, and nobody needs more than a few a day. The
  // limit is per user, not per IP — it is their own data, so the thing worth
  // bounding is the cost, not the identity.
  const limit = await rateLimitPersistent(`export:${userId}`, 3, 60 * 60);
  if (!limit.allowed) {
    return Response.json(
      { error: "rate_limited", retryAfterSeconds: limit.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds ?? 3600) } }
    );
  }

  const exportedAt = new Date();
  const data = await buildUserExport(userId, exportedAt);

  // The session says the user exists and the row says otherwise: deleted mid-flight.
  if (!data) return Response.json({ error: "not_found" }, { status: 404 });

  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${exportFilename(exportedAt)}"`,
      // Belt and braces with `dynamic` above: no shared cache should ever hold this.
      "Cache-Control": "no-store, private",
    },
  });
}
