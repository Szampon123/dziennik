// Password hashing for email+password accounts. Server-only (bcryptjs).
import bcrypt from "bcryptjs";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 100;

const SALT_ROUNDS = 10;

export type PasswordValidation = { valid: true } | { valid: false; error: string };

/**
 * Complexity rules for new passwords. Deliberately no special-character rule:
 * it pushes people toward "Password1!" without adding real entropy, and bcrypt
 * plus the login rate limiter already cover offline and online guessing.
 */
export function validatePasswordStrength(password: string): PasswordValidation {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.` };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, error: "Hasło jest za długie." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Hasło musi zawierać co najmniej jedną małą literę." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Hasło musi zawierać co najmniej jedną wielką literę." };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: "Hasło musi zawierać co najmniej jedną cyfrę." };
  }
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
