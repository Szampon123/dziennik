# STAGE 3 — Rate limiting (brute-force and spam protection)

## Goal

Add rate limiting to protect against brute-force login attacks, registration spam, API abuse, and forum flooding. Use an in-memory store (zero external dependencies) as the initial backend — it works in Node.js runtime (server actions, API routes) but NOT in Edge Runtime (the proxy). Therefore, rate limiting is applied inside the server actions and API route handlers, NOT in `src/proxy.ts`.

## Project context

- **Framework**: Next.js 16.2.10 (App Router), server actions + API route handlers
- **Auth**: NextAuth v5 (beta 31), JWT sessions, credentials provider in `src/lib/auth.ts`
- **Proxy**: `src/proxy.ts` — Edge Runtime, JWT-only check. Do NOT add rate limiting here (in-memory Map is not shared across Edge isolates and would be ineffective).
- **Login flow**: user submits email+password → `CredentialsLoginForm` (client) calls `signIn("credentials", ...)` → NextAuth credentials provider `authorize()` in `src/lib/auth.ts` (~line 37-48) → returns user or null
- **Registration flow**: `RegisterForm` (client) calls server action `registerAccount()` in `src/actions/account.ts`
- **API routes**: `src/app/api/calendar/events/route.ts` (GET), `src/app/api/notion/sync/route.ts` (POST)
- **Forum actions**: `createPost()`, `deletePost()`, `togglePostVote()` in `src/actions/forum.ts`

## Detailed requirements

### 1. Create `src/lib/rate-limit.ts`

A self-contained in-memory rate limiter with zero dependencies. Design:

```typescript
type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/**
 * Check if an action is allowed for the given key.
 * @param key   - unique identifier (e.g. IP address, userId, or "login:email@example.com")
 * @param limit - max number of requests allowed in the window
 * @param windowSeconds - sliding window duration in seconds
 */
export function rateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult
```

Implementation details:
- Use a `Map<string, number[]>` storing timestamps of recent requests per key
- On each call, filter out timestamps older than `windowSeconds`, then check if `timestamps.length < limit`
- If allowed: push current timestamp, return `{ allowed: true }`
- If blocked: calculate `retryAfterSeconds` from the oldest timestamp in the window, return `{ allowed: false, retryAfterSeconds }`
- **Automatic cleanup**: periodically (e.g. every 60 seconds via `setInterval`) sweep the Map to remove keys whose all timestamps have expired. This prevents unbounded memory growth.
- The cleanup interval must NOT prevent Node.js process exit — use `unref()` on the interval timer.
- Export the `rateLimit` function and the `RateLimitResult` type.

### 2. Add rate limiting to login — modify `src/lib/auth.ts`

The credentials provider's `authorize()` function (~line 37-48) is the place to rate-limit logins. This runs in Node.js runtime (not Edge), so the in-memory store works.

Rate limit: **5 attempts per 15 minutes per email address**.

```typescript
// Inside authorize(), BEFORE the DB lookup:
import { rateLimit } from "@/lib/rate-limit";

const rl = rateLimit(`login:${email}`, 5, 15 * 60);
if (!rl.allowed) return null;
// (returning null = "invalid credentials" from NextAuth's perspective)
```

Why per-email, not per-IP: NextAuth's `authorize()` does not receive the raw request/IP. The `email` field is available and sufficient — an attacker brute-forcing a specific account sends the same email repeatedly. This blocks that vector.

**Important**: do NOT modify the Google provider, the dev-login provider, or any NextAuth callbacks. Only touch the credentials `authorize()`.

### 3. Add rate limiting to registration — modify `src/actions/account.ts`

Rate limit: **3 registrations per hour per IP address**.

The server action `registerAccount()` does not have direct access to the request IP. Next.js server actions can read headers via `import { headers } from "next/headers"`:

```typescript
import { headers } from "next/headers";

// At the top of registerAccount(), BEFORE validation:
const headersList = await headers();
const ip = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
const rl = rateLimit(`register:${ip}`, 3, 60 * 60);
if (!rl.allowed) {
  return { ok: false, error: "Zbyt wiele prób rejestracji. Spróbuj ponownie później." };
}
```

### 4. Add rate limiting to API routes

#### `src/app/api/calendar/events/route.ts`

Rate limit: **60 requests per minute per userId**.

Apply AFTER the `getSessionUserId()` check (we need the userId). If blocked, return 429:

```typescript
import { rateLimit } from "@/lib/rate-limit";

// After userId is resolved:
const rl = rateLimit(`api:calendar:${userId}`, 60, 60);
if (!rl.allowed) {
  return NextResponse.json(
    { status: "rate_limited", error: "Too many requests. Try again later.", events: [] },
    { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
  );
}
```

#### `src/app/api/notion/sync/route.ts`

Rate limit: **10 requests per minute per userId**.

Same pattern — after userId check, before processing:

```typescript
const rl = rateLimit(`api:notion:${userId}`, 10, 60);
if (!rl.allowed) {
  return NextResponse.json(
    { ok: false, error: "Zbyt wiele żądań synchronizacji. Spróbuj ponownie za chwilę." },
    { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
  );
}
```

### 5. Add rate limiting to forum — modify `src/actions/forum.ts`

#### `createPost()`

Rate limit: **10 posts per minute per userId**.

Apply AFTER `requireUserId()`:

```typescript
import { rateLimit } from "@/lib/rate-limit";

const rl = rateLimit(`forum:post:${userId}`, 10, 60);
if (!rl.allowed) {
  return { ok: false, error: "Publikujesz za szybko. Poczekaj chwilę." };
}
```

#### `togglePostVote()`

Rate limit: **30 votes per minute per userId**.

Same pattern after `requireUserId()`:

```typescript
const rl = rateLimit(`forum:vote:${userId}`, 30, 60);
if (!rl.allowed) {
  return { ok: false, error: "Zbyt wiele głosów. Poczekaj chwilę." };
}
```

#### `deletePost()` — NO rate limiting needed (destructive action is already auth-gated + ownership-checked).

## Files to CREATE

- `src/lib/rate-limit.ts` — NEW

## Files to MODIFY

- `src/lib/auth.ts` — rate limit in credentials `authorize()` only
- `src/actions/account.ts` — rate limit at top of `registerAccount()`
- `src/app/api/calendar/events/route.ts` — rate limit after auth check
- `src/app/api/notion/sync/route.ts` — rate limit after auth check
- `src/actions/forum.ts` — rate limit in `createPost()` and `togglePostVote()`

## Files to NOT modify

- `src/proxy.ts` — do NOT add rate limiting to the Edge proxy
- `prisma/schema.prisma` — no schema changes
- `src/lib/session.ts` — no changes
- `src/lib/crypto.ts` — no changes
- Any UI components — no changes

## Rate limit summary table

| Target             | Key pattern            | Limit      | Window    | Response when blocked                    |
|--------------------|------------------------|------------|-----------|------------------------------------------|
| Login              | `login:{email}`        | 5 attempts | 15 min    | return null (= invalid credentials)      |
| Registration       | `register:{ip}`        | 3 attempts | 1 hour    | `{ ok: false, error: "..." }`            |
| Calendar API       | `api:calendar:{userId}`| 60 req     | 1 min     | 429 + Retry-After header                 |
| Notion sync API    | `api:notion:{userId}`  | 10 req     | 1 min     | 429 + Retry-After header                 |
| Forum post         | `forum:post:{userId}`  | 10 posts   | 1 min     | `{ ok: false, error: "..." }`            |
| Forum vote         | `forum:vote:{userId}`  | 30 votes   | 1 min     | `{ ok: false, error: "..." }`            |

## Testing

After implementation:
1. **Login brute-force**: try logging in with wrong password 6 times rapidly with the same email — the 6th should be silently rejected (returns null, user sees "invalid credentials")
2. **Registration spam**: try registering 4 accounts from the same IP within an hour — the 4th should return an error message
3. **API abuse**: call `/api/calendar/events` more than 60 times in a minute — should get 429
4. **Forum spam**: post 11 messages in a minute — the 11th should return an error
5. **Normal usage**: verify that normal single-user flows (login, post, vote) work without hitting limits
6. **Cleanup**: verify the Map doesn't grow forever — timestamps older than the window are pruned

## Expected result

1 new file (`src/lib/rate-limit.ts`), 5 modified files. No new dependencies. No schema changes. Brute-force and spam protection across all entry points. Transparent to normal users.
