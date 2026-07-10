import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_ROUTES } from "@/lib/seo";

/**
 * Only the signed-out surface is listed. "/" is deliberately absent: it calls
 * requireUserId() and answers a crawler with a redirect to /login, and a
 * sitemap entry that redirects earns a "Page with redirect" notice in Search
 * Console rather than an index entry. Add it here the day "/" renders
 * something public.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: route === "/login" ? 1 : 0.8,
  }));
}
