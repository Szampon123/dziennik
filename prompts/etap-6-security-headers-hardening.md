# STAGE 6 — Security headers, OAuth state validation, final hardening

## Goal

The final hardening stage. Three areas:

1. **Security headers** — add standard HTTP security headers (CSP, HSTS, X-Content-Type-Options, etc.) via `next.config.ts`.
2. **Google Calendar OAuth state parameter** — add CSRF protection to the incremental-consent OAuth flow in `src/lib/google.ts` and the callback route.
3. **Sanitize error responses** — ensure no stack traces or internal details leak to the client in production.

## Project context

- **Framework**: Next.js 16.2.10 (App Router)
- **Config**: `next.config.ts` — currently only has `serverActions.bodySizeLimit`
- **Proxy**: `src/proxy.ts` — Edge Runtime, auth gate + suspended check. Runs on every request.
- **Google OAuth (Calendar)**: `src/lib/google.ts` — `getAuthUrl()` generates the consent URL, `handleOAuthCallback()` exchanges code for tokens. Routes: `src/app/api/auth/google/route.ts` (start flow) and `src/app/api/auth/google/callback/route.ts` (handle callback).
- **NextAuth login OAuth**: handled by NextAuth internally (`/api/auth/*`) — NextAuth manages its own CSRF/state tokens; do NOT modify.
- **Fonts**: Google Fonts loaded via `next/font/google` (Inter, Roboto Mono) in `src/app/layout.tsx` — CSP must allow `fonts.googleapis.com` and `fonts.gstatic.com`
- **Theme script**: inline `<script>` in `layout.tsx` (line 49) applies theme from localStorage before first paint — CSP must accommodate this with `'unsafe-inline'` for scripts (or a nonce, but Next.js 16 doesn't support nonces for inline scripts in the App Router without custom middleware)
- **Recharts**: uses inline SVG styles — CSP `style-src` needs `'unsafe-inline'`
- **External resources**: Google Fonts only. No external CDN scripts.
- **Vercel Blob**: photo URLs come from `*.public.blob.vercel-storage.com` — CSP `img-src` must allow this domain
- **API routes**: `/api/calendar/events`, `/api/notion/sync`, `/api/auth/google/*`, `/api/forum-photo/*`, `/api/milestone-photo/*`

## Detailed requirements

### 1. Security headers — modify `next.config.ts`

Add a `headers()` function to the Next.js config that applies security headers to all routes. This is the standard Next.js way to set response headers.

```typescript
import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevent MIME type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Prevent clickjacking — only allow our own origin to frame pages
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Control Referer header — send origin only for cross-origin requests
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // DNS prefetch control
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    // HSTS — force HTTPS for 1 year, include subdomains
    // Only effective over HTTPS (ignored on localhost HTTP)
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Permissions Policy — disable features we don't use
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Content Security Policy
    // - default-src 'self': only allow resources from our own origin by default
    // - script-src 'self' 'unsafe-inline' 'unsafe-eval': needed for Next.js hydration and the theme init script
    // - style-src 'self' 'unsafe-inline' fonts.googleapis.com: needed for Recharts inline SVG styles and Google Fonts
    // - font-src 'self' fonts.gstatic.com: Google Fonts file serving
    // - img-src 'self' data: blob: *.public.blob.vercel-storage.com: allow inline images, blob URLs, and Vercel Blob
    // - connect-src 'self' https://api.resend.com: allow API calls to Resend for email sending (server-side, but included for completeness)
    // - frame-ancestors 'none': same as X-Frame-Options DENY but via CSP
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4.5mb",
    },
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

**Important notes on CSP**:
- `'unsafe-inline'` for scripts is needed because of the theme initialization script in `layout.tsx` and Next.js's own inline scripts. This is a pragmatic trade-off — the alternative (nonces) requires custom middleware integration that Next.js App Router doesn't cleanly support.
- `'unsafe-eval'` may be needed by Next.js in development mode. If the production build works without it, remove it and test. If it breaks, keep it.
- The CSP is deliberately permissive enough to not break the app. A stricter CSP can be refined later once the app is in production and violations can be monitored via `report-uri`.

### 2. OAuth state parameter — modify `src/lib/google.ts`

The current `getAuthUrl()` generates a Google consent URL without a `state` parameter. This means the callback route is vulnerable to CSRF — an attacker could trick a logged-in user into visiting a crafted callback URL that links the attacker's Google account to the victim's Dziennik account.

**Fix**: generate a random state token, store it in a cookie, include it in the auth URL, and verify it in the callback.

#### 2a. Modify `getAuthUrl()` to accept and include a state parameter:

```typescript
export function getAuthUrl(state: string): string {
  return createOAuthClient().generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}
```

#### 2b. Create `src/lib/oauth-state.ts` — state token generation and verification:

```typescript
import crypto from "crypto";

const COOKIE_NAME = "google_oauth_state";
const STATE_MAX_AGE_SECONDS = 600; // 10 minutes

/**
 * Generate a cryptographically random state token for OAuth CSRF protection.
 * Returns the token string — the caller stores it in a cookie.
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Build a Set-Cookie header string for the state token.
 * HttpOnly + SameSite=Lax + Secure (when on HTTPS) + short max-age.
 */
export function stateSetCookieHeader(state: string, isSecure: boolean): string {
  const parts = [
    `${COOKIE_NAME}=${state}`,
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${STATE_MAX_AGE_SECONDS}`,
    "Path=/api/auth/google",
  ];
  if (isSecure) parts.push("Secure");
  return parts.join("; ");
}

/**
 * Read the state token from the request cookies.
 */
export function getStateFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Build a Set-Cookie header string that clears the state cookie.
 */
export function stateClearCookieHeader(isSecure: boolean): string {
  const parts = [
    `${COOKIE_NAME}=`,
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
    "Path=/api/auth/google",
  ];
  if (isSecure) parts.push("Secure");
  return parts.join("; ");
}

export const OAUTH_STATE_COOKIE_NAME = COOKIE_NAME;
```

#### 2c. Modify the Google OAuth start route — `src/app/api/auth/google/route.ts`

Currently (line 15): `return NextResponse.redirect(getAuthUrl());`

Replace with:

```typescript
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getAuthUrl, isGoogleConfigured } from "@/lib/google";
import { generateOAuthState, stateSetCookieHeader } from "@/lib/oauth-state";

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL("/settings?google=not_configured", request.url));
  }

  const state = generateOAuthState();
  const isSecure = new URL(request.url).protocol === "https:";
  const response = NextResponse.redirect(getAuthUrl(state));
  response.headers.set("Set-Cookie", stateSetCookieHeader(state, isSecure));
  return response;
}
```

#### 2d. Modify the Google OAuth callback route — `src/app/api/auth/google/callback/route.ts`

Add state verification before exchanging the code:

```typescript
import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { handleOAuthCallback } from "@/lib/google";
import { clearCalendarCache } from "@/lib/calendar-cache";
import { getStateFromCookies, stateClearCookieHeader } from "@/lib/oauth-state";

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const stateParam = url.searchParams.get("state");

  // Always clear the state cookie, regardless of outcome.
  const isSecure = url.protocol === "https:";
  const clearCookie = stateClearCookieHeader(isSecure);

  if (error || !code) {
    const res = NextResponse.redirect(new URL("/settings?google=error", request.url));
    res.headers.set("Set-Cookie", clearCookie);
    return res;
  }

  // CSRF check: the state from the URL query must match the cookie.
  const storedState = getStateFromCookies(request);
  if (!stateParam || !storedState || stateParam !== storedState) {
    console.error("[OAUTH] State mismatch — possible CSRF attempt");
    const res = NextResponse.redirect(new URL("/settings?google=error", request.url));
    res.headers.set("Set-Cookie", clearCookie);
    return res;
  }

  try {
    await handleOAuthCallback(userId, code);
    clearCalendarCache(userId);
    const res = NextResponse.redirect(new URL("/settings?google=connected", request.url));
    res.headers.set("Set-Cookie", clearCookie);
    return res;
  } catch (e) {
    console.error("Google OAuth callback failed:", e);
    const res = NextResponse.redirect(new URL("/settings?google=error", request.url));
    res.headers.set("Set-Cookie", clearCookie);
    return res;
  }
}
```

### 3. Sanitize error responses — review and fix

Ensure that `catch` blocks in API routes and server actions do not leak stack traces or internal details to the client. Check:

- `src/app/api/calendar/events/route.ts` line 38: `console.error("Calendar fetch failed:", e);` — this is fine (server-side only), but the error message returned to the client (line 41-43) should not include `e.message` if it contains internal details. **Current code is OK** — it returns generic Polish error strings.
- `src/app/api/auth/google/callback/route.ts` line 27: `console.error(...)` — OK, error is logged server-side only.
- `src/app/api/notion/sync/route.ts` — returns `result` from `syncDayToNotion()`. Verify that `syncDayToNotion()` doesn't leak internal error details. **Check `src/lib/notion.ts`** — if it returns raw error messages from the Notion API, wrap them.

**General rule**: every error response to the client should be a static Polish string, never `e.message` or `e.stack`. Server-side `console.error()` with the full error is fine and encouraged.

Scan all files in `src/app/api/` and `src/actions/` for patterns like:
- `error: e.message` or `error: String(e)` in return values
- `JSON.stringify(e)` in responses

If found, replace with a generic error string.

### 4. Add a global error boundary page — new file `src/app/error.tsx` (if not exists)

Next.js App Router supports `error.tsx` as a catch-all error boundary. Create one that shows a user-friendly error page without leaking any error details:

```tsx
"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // In production, `error.message` is redacted by Next.js — but we don't
  // display it anyway. The digest is a safe hash for support correlation.
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Coś poszło nie tak</h1>
        <p className="text-muted mb-6">
          Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
          {error.digest && (
            <span className="block text-xs text-neutral-400 mt-2">
              Kod błędu: {error.digest}
            </span>
          )}
        </p>
        <button
          onClick={reset}
          className="underline text-primary hover:no-underline"
        >
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}
```

### 5. Add a not-found page — new file `src/app/not-found.tsx` (if not exists)

```tsx
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Nie znaleziono strony</h1>
        <p className="text-muted mb-6">
          Strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <Link href="/" className="underline text-primary hover:no-underline">
          Wróć do strony głównej
        </Link>
      </div>
    </div>
  );
}
```

## Files to CREATE

- `src/lib/oauth-state.ts` — OAuth state token generation/verification
- `src/app/error.tsx` — global error boundary (if not exists)
- `src/app/not-found.tsx` — 404 page (if not exists)

## Files to MODIFY

- `next.config.ts` — add security headers
- `src/lib/google.ts` — add `state` parameter to `getAuthUrl()`
- `src/app/api/auth/google/route.ts` — generate state, set cookie, pass to auth URL
- `src/app/api/auth/google/callback/route.ts` — verify state from cookie vs query param

## Files to NOT modify

- `src/proxy.ts` — no changes (headers are set via next.config.ts, not the proxy)
- `src/lib/auth.ts` — no changes (NextAuth handles its own CSRF)
- `src/lib/session.ts` — no changes
- `src/lib/roles.ts` — no changes
- `prisma/schema.prisma` — no changes
- `src/actions/*` — no changes (unless error sanitization scan finds leaks)
- Any UI components — no changes

## Security headers summary

| Header                    | Value                                          | Purpose                          |
|---------------------------|-------------------------------------------------|----------------------------------|
| X-Content-Type-Options    | nosniff                                         | Prevent MIME sniffing            |
| X-Frame-Options           | DENY                                            | Prevent clickjacking             |
| Referrer-Policy           | strict-origin-when-cross-origin                 | Control Referer leakage          |
| X-DNS-Prefetch-Control    | on                                              | Performance                      |
| Strict-Transport-Security | max-age=31536000; includeSubDomains             | Force HTTPS                      |
| Permissions-Policy        | camera=(), microphone=(), geolocation=(), ...   | Disable unused browser APIs      |
| Content-Security-Policy   | default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ... | XSS + injection protection |

## OAuth state flow

1. User clicks "Connect Google Calendar" → GET `/api/auth/google`
2. Route generates random 32-byte hex state token
3. State stored in HttpOnly cookie (`google_oauth_state`, scoped to `/api/auth/google`, 10 min max-age)
4. User redirected to Google consent with `state=<token>` in the URL
5. Google redirects back to `/api/auth/google/callback?code=...&state=<token>`
6. Callback reads state from cookie, compares to `state` query param
7. If mismatch → reject (CSRF attempt). If match → exchange code for tokens, clear cookie.

## Testing

1. **Security headers**: After deploying or running `npm run build && npm start`, check response headers with `curl -I http://localhost:3000/login`. All headers from the table above should be present.
2. **CSP violations**: Open the browser console while using the app normally. If CSP blocks something legitimate, the console will show a violation report. Adjust the policy if needed.
3. **OAuth state**: 
   - Connect Google Calendar normally → should work (state matches)
   - Manually craft a callback URL with a wrong or missing `state` param → should redirect to `/settings?google=error`
   - Check server logs for "[OAUTH] State mismatch" message on the crafted request
4. **Error page**: Navigate to a non-existent URL → should show the Polish 404 page, not Next.js default
5. **Error boundary**: If you can trigger a server error (e.g., disconnect DB), the error page should show "Coś poszło nie tak" with a digest code, not a stack trace
6. **`unsafe-eval` check**: Run `npm run build && npm start` (production mode). If the app works without `'unsafe-eval'` in the CSP script-src, remove it and keep only `'unsafe-inline'`. Test by navigating through all main pages.
7. **Build check**: `npm run build` passes without errors.

## Expected result

~3 new files, ~4 modified files. No new dependencies. No schema changes. The app now has industry-standard security headers, CSRF-protected OAuth, and user-friendly error pages. Combined with Stages 1-5, the application meets production security requirements.

## Post-Stage 6: what's done

After all 6 stages, the security posture is:

1. **Stage 1**: Global auth proxy — no route accidentally public
2. **Stage 2**: Tokens encrypted at rest (AES-256-GCM)
3. **Stage 3**: Rate limiting on all entry points
4. **Stage 4**: Hardened role system with suspended role, admin panel, audit log
5. **Stage 5**: Email verification + strong passwords
6. **Stage 6**: Security headers, OAuth CSRF protection, error sanitization

The application is ready for production deployment.
