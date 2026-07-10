// Failure results for server actions, rendered in the caller's locale.
//
// Two conventions live here:
//
//  1. `fail()` resolves the locale itself. Server actions are request-scoped,
//     so the cookie is available — threading a `t` through every action just to
//     build an error string would be noise.
//
//  2. Zod `message` slots in src/actions carry a MessageKey, not prose. A schema
//     is built once at module load, long before we know who is asking, so the
//     message cannot be a translated string. `issueKey()` reads it back out.
import type { ZodError } from "zod";
import { getT } from "@/lib/i18n/server";
import { MESSAGES, type MessageKey } from "@/lib/i18n/messages";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Interpolation values for a message key, e.g. `{ max: 500 }`. */
export type ErrorParams = Record<string, string | number>;

/** Polish is the source block, so its keys are the full set. */
const KNOWN_KEYS = new Set(Object.keys(MESSAGES.pl));

/**
 * The MessageKey stashed in the first Zod issue's `message`.
 *
 * Only validators we gave a message to carry a key. A bare `.max(5)` emits
 * Zod's own English prose, and translate() falls back to echoing an unknown
 * key verbatim — so an unrecognised message must become a generic error rather
 * than leak "Number must be less than or equal to 5" into the UI.
 */
export function issueKey(error: ZodError): MessageKey {
  const message = error.issues[0]?.message;
  return message && KNOWN_KEYS.has(message) ? (message as MessageKey) : "errors.badRequest";
}

/**
 * A failure result whose message is translated for whoever called.
 *
 * Returns only the failure branch, never the full ActionResult union: several
 * actions succeed with extra fields (`{ ok: true; id }`), and a return type of
 * ActionResult would make `fail()` unassignable to them.
 */
export async function fail(
  key: MessageKey,
  params?: ErrorParams
): Promise<{ ok: false; error: string }> {
  const { t } = await getT();
  return { ok: false, error: t(key, params) };
}
