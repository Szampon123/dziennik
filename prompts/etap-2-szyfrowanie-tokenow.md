# STAGE 2 — Encrypt tokens at rest (OAuth + Notion)

## Goal

Encrypt all sensitive tokens stored in the database so that a database leak (backup exposure, SQL injection, unauthorized Neon access) does NOT give an attacker access to users' Google Calendar or Notion accounts. Tokens must be encrypted on write and decrypted on read, with the encryption key stored exclusively in an environment variable.

## Project context

- **Database**: PostgreSQL (Neon), Prisma ORM
- **Sensitive fields — `OAuthToken` table**:
  - `accessToken` (String) — Google OAuth access token
  - `refreshToken` (String?) — Google OAuth refresh token
- **Sensitive fields — `User` table**:
  - `notionToken` (String?) — Notion integration token
  - `notionParentPageId` (String?) — Notion page ID (not a secret — do NOT encrypt this one; encrypting it would hinder debugging with no security benefit)

### Files that WRITE tokens (write paths):

1. **`src/lib/google.ts`** — function `saveCredentials()` (~line 55-73):
   - Writes `accessToken`, `refreshToken`, `expiryDate`, `scope`, `accountEmail` to `OAuthToken` via `prisma.oAuthToken.upsert()`
   - Called from `handleOAuthCallback()` and from the `client.on("tokens", ...)` callback
   - **Encrypt**: `accessToken` and `refreshToken` before writing to DB

2. **`src/actions/notion-settings.ts`** — function `saveNotionSettings()` (~line 36-39):
   - Writes `notionToken` and `notionParentPageId` to `User` via `prisma.user.update()`
   - **Encrypt**: `notionToken` before writing to DB

3. **`src/actions/notion-settings.ts`** — function `disconnectNotion()` (~line 48-51):
   - Sets `notionToken: null, notionParentPageId: null` — no encryption needed (null is null)

### Files that READ tokens (read paths):

1. **`src/lib/google.ts`** — function `getAuthorizedClient()` (~line 94-112):
   - Reads `OAuthToken` from DB: `stored.accessToken`, `stored.refreshToken`
   - Passes them to `client.setCredentials()`
   - **Decrypt** before passing to the Google client

2. **`src/lib/notion.ts`** — function `getNotionConfig()` (~line 21-28):
   - Reads `user.notionToken` and `user.notionParentPageId` from `User`
   - Returns as `{ token, parentPageId }`
   - **Decrypt** `notionToken` before returning

3. **`src/actions/notion-settings.ts`** — function `saveNotionSettings()` (~line 30-31):
   - Before saving, calls `testNotionConnection({ token, parentPageId })` with the PLAIN TEXT value from the user's form — do NOT decrypt here, the value comes straight from the form (not yet encrypted)

## Detailed requirements

### 1. Create `src/lib/crypto.ts`

New module with two exported functions:

```typescript
export function encrypt(plaintext: string): string
export function decrypt(ciphertext: string): string
```

Requirements:
- **Algorithm**: AES-256-GCM (authenticated encryption)
- **Key**: from `process.env.ENCRYPTION_KEY` — 32-byte key encoded as hex (64 characters)
- **IV**: random 12 bytes, generated fresh for every `encrypt()` call
- **Output format**: `iv:authTag:ciphertext` — all encoded as hex (be consistent throughout)
- **Validation**: `decrypt()` must verify the authTag (GCM does this automatically) and throw if data has been tampered with
- **Missing key**: if `ENCRYPTION_KEY` is not set, both `encrypt()` and `decrypt()` must throw a clear error (never fall back to plaintext — that would be dangerous)
- **Node.js crypto**: use the built-in `crypto` module (zero external dependencies)

### 2. Modify `src/lib/google.ts`

- **`saveCredentials()`**: call `encrypt()` on `accessToken` and `refreshToken` BEFORE writing to Prisma
  - `refreshToken` can be `undefined` (keep existing) — only encrypt when it's a string
- **`getAuthorizedClient()`**: call `decrypt()` on `stored.accessToken` and `stored.refreshToken` AFTER reading from Prisma
  - `refreshToken` can be `null` — only decrypt when it's a string
- **Callback `client.on("tokens", ...)`** (~line 108-109): this callback calls `saveCredentials()` — no changes needed here since `saveCredentials` will already encrypt

### 3. Modify `src/lib/notion.ts`

- **`getNotionConfig()`**: call `decrypt()` on `user.notionToken` AFTER reading from Prisma, BEFORE returning in the `{ token, parentPageId }` object
- `notionParentPageId` — do NOT encrypt (it's a public page identifier, not a secret)

### 4. Modify `src/actions/notion-settings.ts`

- **`saveNotionSettings()`**: call `encrypt()` on `token` (the form value) BEFORE `prisma.user.update()`. IMPORTANT ordering — `testNotionConnection()` must receive the PLAIN TEXT token (line 31), so encryption must happen AFTER the test but BEFORE the database write.

### 5. Create migration script `prisma/scripts/encrypt-existing-tokens.ts`

One-time script to encrypt tokens already existing in the database:

```typescript
// Run manually: npx tsx prisma/scripts/encrypt-existing-tokens.ts
// 1. Fetch all OAuthToken rows
// 2. For each: encrypt(accessToken), encrypt(refreshToken) if not null
// 3. Save encrypted values
// 4. Fetch all User rows where notionToken is not null
// 5. For each: encrypt(notionToken)
// 6. Save encrypted values
// 7. Log how many records were migrated
```

The script must:
- Be idempotent: if a token already looks encrypted (matches the `iv:authTag:ciphertext` hex format), skip it
- Log progress: `Migrating OAuthToken 3/15...`
- Run inside a Prisma transaction (all or nothing)

### 6. Update `.env.local.example`

Add:
```
# --- Token encryption at rest ---
# 32-byte AES-256 key (64 hex characters). Generate with:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=
```

## Files to CREATE

- `src/lib/crypto.ts` — NEW
- `prisma/scripts/encrypt-existing-tokens.ts` — NEW

## Files to MODIFY

- `src/lib/google.ts` — encrypt/decrypt in saveCredentials + getAuthorizedClient
- `src/lib/notion.ts` — decrypt in getNotionConfig
- `src/actions/notion-settings.ts` — encrypt in saveNotionSettings (after test, before DB write)
- `.env.local.example` — add ENCRYPTION_KEY

## Files to NOT modify

- `prisma/schema.prisma` — columns stay as String (ciphertext is still a string)
- `src/components/NotionSettings.tsx` — no UI changes
- `src/components/GoogleSettings.tsx` — no UI changes
- `src/proxy.ts` — middleware unchanged

## Testing

After implementation:
1. Generate ENCRYPTION_KEY: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and add to `.env.local`
2. If you have existing tokens in the database — run the migration script: `npx tsx prisma/scripts/encrypt-existing-tokens.ts`
3. Test Google Calendar: disconnect and reconnect in Settings → calendar should work normally
4. Test Notion: disconnect and reconnect → day sync should work normally
5. Inspect the database directly (e.g. Neon console): tokens should look like `a1b2c3:d4e5f6:789abc...` (not plain text)
6. Verify that a missing ENCRYPTION_KEY in env produces a clear error when trying to read/write a token

## Expected result

2 new files, 3 modified, 1 updated example. Tokens in the database are AES-256-GCM ciphertexts — useless without the key from env. The application behaves identically from the user's perspective.
