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
  "Your personal daily journal — intentions, notes, reflections. Build habits, grow skills, and track your progress.";

/**
 * The Open Graph card, as a shared value.
 *
 * Next merges metadata *shallowly*: a route that sets `openGraph` at all
 * replaces the parent's entire `openGraph` object, images included. Any page
 * overriding og:title or og:description must therefore spread this back in, or
 * the card silently loses its image. Same story for `twitter`.
 */
export const OG_IMAGE = {
  url: "/api/og",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
} as const;

/** Landing-page copy. English, unlike the app, and the text every share shows. */
export const LANDING = {
  title: "Vincendio — Level Up Your Life Across 138 Real-World Skills",
  ogTitle: "Level Up Your Real Life",
  description:
    "Daily journaling, habit tracking, and a 99-level progression system. Track running, " +
    "piano, cooking, and 135 more activities. Free to start.",
  /** Short enough to stay on one line in the 1200x630 card at 27px. */
  cardSubtitle: "138 skills · 99 levels each · Free to start",
} as const;

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
 * Pages a signed-out visitor (and therefore a crawler) can actually reach *and*
 * that are worth indexing. Everything else in this app sits behind the auth
 * proxy and answers with a redirect, so listing it in the sitemap would only
 * earn Search Console warnings. Mirrors PUBLIC_PATHS in src/proxy.ts.
 *
 * "/" leads: it renders the landing page for anonymous visitors now, rather
 * than redirecting to /login. /privacy and /terms are public too but are
 * noindex stubs, so they stay out.
 */
export const PUBLIC_ROUTES = ["/", "/login", "/register"] as const;
