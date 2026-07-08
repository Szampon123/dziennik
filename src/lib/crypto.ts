// AES-256-GCM encryption for sensitive tokens stored at rest (Google OAuth
// access/refresh tokens, Notion integration token). The ciphertext is useless
// without ENCRYPTION_KEY, which lives only in the environment — so a database
// leak alone (backup, SQLi, unauthorized Neon access) never exposes a usable
// token. Never falls back to plaintext: a missing/invalid key throws.
//
// Wire format: "iv:authTag:ciphertext", each part lowercase hex.
//   iv         – 12 random bytes (24 hex chars), fresh per encrypt() call
//   authTag    – 16-byte GCM tag (32 hex chars), verified on decrypt()
//   ciphertext – variable-length hex (empty when plaintext was "")
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const KEY_BYTES = 32;

// Matches our wire format, so callers (e.g. the one-time migration) can tell an
// already-encrypted value apart from plaintext.
const ENCRYPTED_RE = /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]*$/i;

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex) {
    throw new Error(
      "ENCRYPTION_KEY is not set — refusing to read/write tokens. Generate one with: " +
        `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
    );
  }
  const key = Buffer.from(hex, "hex");
  if (key.length !== KEY_BYTES) {
    throw new Error(
      `ENCRYPTION_KEY must be ${KEY_BYTES} bytes as ${KEY_BYTES * 2} hex characters ` +
        `(decoded to ${key.length} bytes).`
    );
  }
  return key;
}

/** Encrypt a UTF-8 string. Returns "iv:authTag:ciphertext" (hex). */
export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
}

/** Decrypt a value produced by encrypt(). Throws if malformed or tampered with. */
export function decrypt(payload: string): string {
  const key = getKey();
  const parts = payload.split(":");
  if (parts.length !== 3) {
    throw new Error("Malformed ciphertext — expected 'iv:authTag:ciphertext'.");
  }
  const [ivHex, tagHex, dataHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(tagHex, "hex");
  const ciphertext = Buffer.from(dataHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag); // GCM verifies integrity in final()
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}

/** True when `value` is already in our encrypt() wire format (idempotency guard). */
export function isEncrypted(value: string): boolean {
  return ENCRYPTED_RE.test(value);
}
