// Why a reset attempt failed, and the message key that explains it.
//
// Its own module (rather than living in src/lib/password-reset.ts) because the
// reset *form* is a client component: importing the code→key map must not drag
// Prisma into the browser bundle. Pure data, no server imports.
import type { MessageKey } from "@/lib/i18n/messages";

export type ResetErrorCode = "invalid" | "expired" | "used" | "weak";

/** `rate` comes from the action's rate limiter, not from token validation. */
export type ResetFailure = ResetErrorCode | "rate";

export const RESET_ERROR_KEY: Record<ResetFailure, MessageKey> = {
  invalid: "auth.resetInvalidLink",
  expired: "auth.resetExpired",
  used: "auth.resetAlreadyUsed",
  weak: "auth.passwordMinLength",
  rate: "auth.resetTooManyRequests",
};
