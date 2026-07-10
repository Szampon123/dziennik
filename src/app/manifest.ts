import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION, BRAND } from "@/lib/seo";

// Served at /manifest.webmanifest — the root layout points <link rel="manifest">
// at that path. Only favicon.ico exists today; add maskable 192/512 PNGs under
// public/ (and list them here) before this counts as installable.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — osobisty dziennik dnia`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BRAND.surface,
    theme_color: BRAND.violet,
    lang: "pl",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
