// Why a password was rejected, and the message key that explains it.
//
// validatePasswordStrength() runs server-side, but the message is rendered in
// the reader's locale — so, like password-reset-errors.ts, it returns a code
// and the render site translates. Pure data, no server imports.
import type { MessageKey } from "@/lib/i18n/messages";

export type PasswordErrorCode = "tooShort" | "tooLong" | "noLower" | "noUpper" | "noDigit";

export const PASSWORD_ERROR_KEY: Record<PasswordErrorCode, MessageKey> = {
  tooShort: "auth.passwordMinLength",
  tooLong: "auth.passwordTooLong",
  noLower: "auth.passwordMinLength",
  noUpper: "auth.passwordMinLength",
  noDigit: "auth.passwordMinLength",
};
