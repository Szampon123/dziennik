// Password hashing for email+password accounts. Server-only (bcryptjs).
import bcrypt from "bcryptjs";
import type { PasswordErrorCode } from "@/lib/password-errors";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;

const SALT_ROUNDS = 10;

// A code, not a message: this runs on the server but the text is shown in the
// reader's locale, resolved via PASSWORD_ERROR_KEY at the render site.
export type PasswordValidation = { valid: true } | { valid: false; error: PasswordErrorCode };

/**
 * Complexity rules for new passwords. Deliberately no special-character rule:
 * it pushes people toward "Password1!" without adding real entropy, and bcrypt
 * plus the login rate limiter already cover offline and online guessing.
 */
export function validatePasswordStrength(password: string): PasswordValidation {
  if (password.length < MIN_PASSWORD_LENGTH) return { valid: false, error: "tooShort" };
  if (password.length > MAX_PASSWORD_LENGTH) return { valid: false, error: "tooLong" };
  if (!/[a-z]/.test(password)) return { valid: false, error: "noLower" };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "noUpper" };
  if (!/\d/.test(password)) return { valid: false, error: "noDigit" };
  return { valid: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
