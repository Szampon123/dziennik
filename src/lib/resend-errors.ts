// Why a "resend the verification link" attempt failed, and the message key that
// explains it.
//
// Mirrors src/lib/verification-errors.ts: pure data, no server imports, so both
// the layout banner and the settings card can render it without dragging Prisma
// along — and neither owns the mapping the other has to copy.
import type { MessageKey } from "@/lib/i18n/messages";

/**
 * "sendFailed" and "misconfigured" are both a failure to send, and they are kept
 * apart because they ask the reader for opposite things: one is worth retrying,
 * the other cannot be retried into working and would only burn the hourly budget.
 */
export type ResendFailure = "rate" | "noEmail" | "sendFailed" | "misconfigured";

export const RESEND_ERROR_KEY: Record<ResendFailure, MessageKey> = {
  rate: "auth.verifyTooManyRequests",
  noEmail: "auth.verifyNoEmail",
  sendFailed: "auth.verifySendFailed",
  misconfigured: "auth.verifySendMisconfigured",
};
