import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Everything except the landing page and the auth surface sits behind the proxy
 * in src/proxy.ts and answers a signed-out crawler with a redirect, so the
 * disallow list below is belt-and-braces rather than the actual protection.
 * `/api/og` stays crawlable: it *is* the Open Graph card, and scrapers must be
 * able to fetch it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/og"],
      disallow: ["/api/", "/admin", "/settings", "/history", "/dudu", "/dzis"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
