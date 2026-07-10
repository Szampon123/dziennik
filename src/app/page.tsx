import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/session";
import { SITE_NAME, LANDING, OG_IMAGE } from "@/lib/seo";
import { LandingPage } from "@/components/landing/LandingPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // `absolute` bypasses the root layout's "%s — Vincendio" template, which
  // would otherwise render "Vincendio — Level Up … — Vincendio".
  title: { absolute: LANDING.title },
  description: LANDING.description,
  alternates: { canonical: "/" },

  // openGraph and twitter are REPLACED, not deep-merged, by the last segment
  // that defines them (see the Merging section of Next's generateMetadata
  // docs). Inheriting the root layout's would preview this English page with
  // the app's Polish description, so the copy is overridden here — and
  // OG_IMAGE / siteName are spread back in, or the card would lose its image.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    // The app is Polish; this page, and therefore every share of it, is not.
    locale: "en_US",
    url: "/",
    title: LANDING.ogTitle,
    description: LANDING.description,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING.ogTitle,
    description: LANDING.description,
    images: [OG_IMAGE.url],
  },
};

/**
 * The one route that serves two audiences. Signed-out visitors get the public
 * landing page; signed-in ones are sent to the dashboard, which used to live
 * here and now lives at /dzis.
 *
 * getSessionUserId(), not raw auth(): a stale JWT whose User row was deleted
 * must fall through to the landing page rather than bounce into /dzis, which
 * would redirect straight back to /login.
 */
export default async function Home() {
  const userId = await getSessionUserId();
  if (userId) redirect("/dzis");

  return <LandingPage />;
}
