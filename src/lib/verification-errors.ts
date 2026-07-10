// Why a verification attempt failed, and the message key that explains it.
//
// Mirrors src/lib/password-reset-errors.ts: the token check runs on the server,
// but the message is rendered in the reader's locale, so the two must not be
// the same string. Pure data, no server imports — safe to pull into a client
// component without dragging Prisma along.
import type { MessageKey } from "@/lib/i18n/messages";

export type VerificationErrorCode = "invalid" | "expired" | "noAccount";

export const VERIFICATION_ERROR_KEY: Record<VerificationErrorCode, MessageKey> = {
  invalid: "auth.verifyInvalidLink",
  expired: "auth.verifyExpired",
  noAccount: "auth.verifyNoAccount",
};
