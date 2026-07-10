import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION, BRAND } from "@/lib/seo";

// Served at /manifest.webmanifest — the root layout points <link rel="manifest">
// at that path.
//
// The icons are `purpose: "any"`: they keep the artwork's own squircle, with
// transparent corners. They are deliberately not declared "maskable" — a
// maskable icon must fill the whole square and survive an aggressive circular
// crop, and this one would lose its rounded edge and clip the drawing.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — daily journal`,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: BRAND.surface,
    theme_color: BRAND.violet,
    lang: "pl",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
