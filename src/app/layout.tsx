import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { PATHNAME_HEADER } from "@/lib/pathname-header";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, BRAND, OG_IMAGE } from "@/lib/seo";
import { Nav } from "@/components/Nav";
import { UserMenu } from "@/components/UserMenu";
import { VerificationBanner } from "@/components/VerificationBanner";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import { getLocale } from "@/lib/i18n/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Routes the onboarding gate must never fire on, or a brand-new user is stuck
 * in a redirect loop: the wizard itself, and every page reachable while signed
 * in but not yet set up.
 *
 * "/" is here because the landing page already bounces a signed-in visitor to
 * /dzis, where the gate does fire. Gating "/" as well would just add a hop.
 */
const ONBOARDING_EXEMPT = new Set([
  "/",
  "/login",
  "/register",
  "/suspended",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/privacy",
  "/terms",
]);

function isOnboardingExempt(pathname: string): boolean {
  return ONBOARDING_EXEMPT.has(pathname) || pathname.startsWith("/onboarding");
}

/**
 * The one user lookup the chrome needs, resolved once.
 *
 * Credentials accounts start unverified; Google accounts arrive verified. The
 * role comes from the session (the jwt callback re-reads it every request), so
 * only emailVerified and onboardingComplete need a lookup — and only for
 * signed-in, non-suspended users, the only ones who can act on either.
 */
async function loadChromeUser(): Promise<{
  needsVerification: boolean;
  needsOnboarding: boolean;
} | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId || session.user.role === "suspended") return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true, onboardingComplete: true },
  });
  if (!user) return null;

  return {
    needsVerification: user.emailVerified == null,
    needsOnboarding: !user.onboardingComplete,
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  // Lets every metadata field below (and in child routes) use a relative URL.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    // Child routes set a bare title ("Nawyki") and inherit the suffix.
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  // No `alternates.canonical` here: metadata is inherited, so a root canonical
  // would declare every page a duplicate of "/". Public routes set their own.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "pl_PL",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/api/og"],
  },
};

// themeColor lives here, not in `metadata` — it has been deprecated on the
// metadata export since Next 14 and warns at build time.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND.surface },
    { media: "(prefers-color-scheme: dark)", color: BRAND.ink },
  ],
};

// Applies the saved (or system) theme before first paint to avoid a flash.
// Mirrors applyTheme() in src/lib/theme.ts — keep the two in sync.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var r=document.documentElement;r.classList.remove("dark");r.removeAttribute("data-theme");if(t==="dark"){r.classList.add("dark");}else if(t==="colorful"){r.setAttribute("data-theme","colorful");}else if(t==="custom"){r.setAttribute("data-theme","custom");try{var c=JSON.parse(localStorage.getItem("customTheme")||"{}");for(var k in c){if(c[k])r.style.setProperty(k,c[k]);}}catch(e){}}else if(t!=="light"){if(window.matchMedia("(prefers-color-scheme: dark)").matches)r.classList.add("dark");}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The landing page and the onboarding wizard are the two routes that are not
  // "the app": each brings its own frame and needs the full viewport width, so
  // both render on a bare canvas. A server component cannot see the pathname,
  // hence the header the proxy sets.
  const pathname = (await headers()).get(PATHNAME_HEADER) ?? "";
  const isLanding = pathname === "/";
  const isOnboarding = pathname.startsWith("/onboarding");
  const isBare = isLanding || isOnboarding;

  const locale = await getLocale();

  // Skipped for the landing page: an anonymous visitor has no session to read
  // and no banner to act on, so this would be an auth() round-trip for nothing.
  const chromeUser = isLanding ? null : await loadChromeUser();

  // Send a user who has not finished setup back to the wizard. Placed here, and
  // not in the proxy, because the proxy runs on the Edge and cannot read the
  // database — the flag lives on the User row, not in the JWT.
  if (chromeUser?.needsOnboarding && !isOnboardingExempt(pathname)) {
    redirect("/onboarding");
  }

  // Not on /verify-email: that page is the banner's own destination and offers the
  // same "send verification link" button itself, so the banner would sit directly
  // above a duplicate of its only control.
  const showVerificationBanner =
    (chromeUser?.needsVerification ?? false) && !pathname.startsWith("/verify-email");

  return (
    <html
      lang={isBare ? "en" : locale}
      suppressHydrationWarning
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale}>
          {isBare ? (
            children
          ) : (
            <>
              <Nav userMenu={<UserMenu />} />
              {showVerificationBanner && <VerificationBanner />}
              <main className="mx-auto w-full max-w-[760px] flex-1 px-6 py-12">{children}</main>
            </>
          )}
        </I18nProvider>
      </body>
    </html>
  );
}
