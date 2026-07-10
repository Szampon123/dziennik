// Site-wide constants for the metadata surface (root layout, OG image, robots,
// sitemap, manifest). Kept in one place so the canonical origin and the brand
// palette can't drift between the <meta> tags and the image they point at.

/**
 * Canonical production origin. Used as `metadataBase`, so all metadata URLs may
 * be relative.
 *
 * Must be the host Vercel serves as *primary*. If the other host is primary,
 * every absolute URL below (canonical, og:url, og:image, the sitemap entries)
 * points at a 308 — a canonical that redirects cancels itself out, and
 * validators that refuse cross-domain redirect chains report the Open Graph
 * tags as missing entirely.
 */
export const SITE_URL = "https://vincendio.com";

/**
 * The public brand. Titles the metadata surface — og:site_name, og:title,
 * twitter:title, the <title> suffix, the manifest and the OG card image.
 *
 * Not the same string as the in-app wordmark ("Dziennik", in AuthShell) or the
 * transactional-email signature: those name the product to people already using
 * it, while this names the site to people who have not arrived yet.
 */
export const SITE_NAME = "Vincendio";

export const SITE_DESCRIPTION =
  "Osobisty dziennik dnia — intencje, notatki, refleksje. Prowadź nawyki, rozwijaj umiejętności i śledź postępy.";

/**
 * Brand colours, copied from the light-theme `:root` block in globals.css.
 * Duplicated on purpose: `next/og` renders outside the DOM, so it cannot read
 * CSS custom properties — Satori needs literal values. Keep in sync with
 * `--violet-600` / `--azure-500` / `--neutral-900` / `--neutral-0`.
 */
export const BRAND = {
  violet: "#6e56cf",
  azure: "#0ea5e9",
  ink: "#17171d",
  surface: "#ffffff",
} as const;

/**
 * Pages a signed-out visitor (and therefore a crawler) can actually reach.
 * Everything else in this app sits behind the auth proxy and answers with a
 * redirect, so listing it in the sitemap would only earn Search Console
 * warnings. Mirrors PUBLIC_PATHS in src/proxy.ts.
 */
export const PUBLIC_ROUTES = ["/login", "/register"] as const;
