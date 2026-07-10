// Absolute origin for links we email out.
//
// Deliberately *not* the hardcoded SITE_URL from src/lib/seo.ts: that one is
// the canonical production origin baked into <meta> tags at build time, while
// an emailed link has to point at whichever deployment actually issued the
// token — localhost in dev, the preview URL on a Vercel preview, the real
// domain in production.

/**
 * AUTH_URL is what this project sets (Auth.js reads the same var); VERCEL_URL
 * is the preview/production fallback and carries no scheme.
 */
export function resolveBaseUrl(): string {
  const explicit = process.env.AUTH_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
