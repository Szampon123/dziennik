// Global auth gate (Next.js "proxy" convention — the replacement for the now
// deprecated "middleware" file). This is the first line of defence: every
// request is checked for a valid session here before it ever reaches a page or
// route handler. The per-page/action `requireUserId()` checks stay in place as
// defence-in-depth — this proxy just guarantees no route is ever public by
// accident.
//
// Runs in the Edge Runtime, so we verify the session from the JWT alone
// (`getToken`) and never import Prisma or hit the database here.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Paths that must stay reachable without a session. Everything else is gated.
// (Static assets and image files are already excluded by `config.matcher`
// below, so this list only covers the auth surface, the crawler surface and
// Next.js internals.)
//
// The crawler entries are load-bearing, not cosmetic: `config.matcher` only
// exempts `_next/*` and image extensions, so without them `/robots.txt` and
// `/sitemap.xml` would answer a crawler with a 307 to /login, and `/api/og`
// — matching the `/api/` branch below — would answer link-preview scrapers
// with a 401 JSON body instead of the Open Graph card.
const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/suspended",
  "/verify-email",
  "/api/auth",
  "/_next",
  "/favicon.ico",
  // Crawler + link-preview surface.
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
  "/api/og",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Verify the JWT session cookie without any DB round-trip. `secureCookie`
  // selects the `__Secure-` cookie prefix used over HTTPS (production).
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: req.nextUrl.protocol === "https:",
  });

  if (!token) {
    // API routes answer with a clean 401 (their handlers already do the same
    // via getSessionUserId) — redirecting them to an HTML login page would
    // break fetch callers and <img> sources like the photo routes.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Suspended accounts are locked out entirely. The jwt callback re-reads the
  // role from the DB on every request, so a suspension lands on the next page
  // load. Only /suspended and the auth routes stay reachable (both already
  // public above) so the user can read the notice and sign out.
  if (token.role === "suspended") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Account suspended" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/suspended", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Run on every path except Next.js build assets and static image files —
  // those never need an auth check and skipping them keeps navigation fast.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
