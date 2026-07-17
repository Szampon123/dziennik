// CSRF protection for the Calendar consent flow (the incremental-consent OAuth
// in src/lib/google.ts — NextAuth guards its own login flow separately).
//
// Without a state parameter, an attacker can feed a signed-in victim a crafted
// /api/auth/google/callback?code=... URL and bind the attacker's Google account
// to the victim's Vincendio account. We mint a random token, keep it in an
// HttpOnly cookie, echo it through Google, and require the two to match.
import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const OAUTH_STATE_COOKIE = "google_oauth_state";
export const STRAVA_OAUTH_STATE_COOKIE = "strava_oauth_state";

const STATE_MAX_AGE_SECONDS = 600; // consent rarely takes 10 minutes

/** Cryptographically random state token. */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Cookie attributes for the state token. SameSite=Lax (not Strict) so the
 * cookie survives the provider's cross-site redirect back to the callback.
 * Path is scoped to that provider's OAuth routes (which also covers its
 * /callback), so the Google and Strava state cookies never shadow each other.
 */
export function stateCookieOptions(isSecure: boolean, path = "/api/auth/google") {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecure,
    maxAge: STATE_MAX_AGE_SECONDS,
    path,
  };
}

/** Same attributes, zero lifetime — expires the cookie. */
export function clearedStateCookieOptions(isSecure: boolean, path = "/api/auth/google") {
  return { ...stateCookieOptions(isSecure, path), maxAge: 0 };
}

export function getStateCookie(request: NextRequest, cookieName = OAUTH_STATE_COOKIE): string | null {
  return request.cookies.get(cookieName)?.value ?? null;
}

/**
 * True when the request reached us over HTTPS. Behind a proxy (Vercel) the
 * inbound URL is plain http, so the forwarded scheme is what counts.
 */
export function isSecureRequest(request: NextRequest): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded) return forwarded.split(",")[0].trim() === "https";
  return new URL(request.url).protocol === "https:";
}

/** Constant-time comparison — neither value is a secret worth leaking by timing. */
export function statesMatch(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
