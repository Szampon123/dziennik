// Dynamic Open Graph card (1200×630 PNG), rendered by Satori via next/og.
//
// Satori supports only flexbox and a subset of CSS — no grid, no
// background-clip:text — so the brand gradient appears as fills (the dot and
// the underline) rather than as gradient text, and every container that holds
// more than one child declares `display: flex` explicitly.
//
// Colours are literals from src/lib/seo.ts: this renders outside the DOM, so
// the CSS custom properties in globals.css are not available here.
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_DESCRIPTION, BRAND } from "@/lib/seo";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          backgroundColor: BRAND.surface,
        }}
      >
        {/* Accent bar across the top edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: WIDTH,
            height: 12,
            background: `linear-gradient(90deg, ${BRAND.violet}, ${BRAND.azure})`,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              background: `linear-gradient(135deg, ${BRAND.violet}, ${BRAND.azure})`,
            }}
          />
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: "-2px",
              color: BRAND.ink,
            }}
          >
            {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            lineHeight: 1.35,
            color: "#5c5c68",
            maxWidth: 820,
          }}
        >
          {SITE_DESCRIPTION}
        </div>

        <div
          style={{
            marginTop: 48,
            width: 180,
            height: 6,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${BRAND.violet}, ${BRAND.azure})`,
          }}
        />
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        // Crawlers refetch this often; the card only changes when we redeploy.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
      },
    }
  );
}
