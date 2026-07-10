// Dynamic Open Graph card (1200×630 PNG), rendered by Satori via next/og.
//
// Satori supports only flexbox and a subset of CSS — no grid, no
// background-clip:text — so the brand gradient appears as fills (the accent bar
// and the underline) rather than as gradient text, and every container that
// holds more than one child declares `display: flex` explicitly.
//
// Colours are literals from src/lib/seo.ts: this renders outside the DOM, so
// the CSS custom properties in globals.css are not available here. The card is
// dark to match the landing hero, and carries the app icon beside the headline.
import { ImageResponse } from "next/og";
import { SITE_NAME, LANDING, BRAND } from "@/lib/seo";
import { OG_ICON_DATA_URI } from "./icon-data";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;
const ICON_PX = 220;

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 72,
          padding: "0 88px",
          backgroundColor: "#000000",
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

        {/* The icon's own corners are transparent, so it sits on the black
            background as artwork rather than as a visible tile.
            next/image cannot be used here: Satori rasterises this tree itself,
            outside React DOM, and understands only a plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OG_ICON_DATA_URI} width={ICON_PX} height={ICON_PX} alt="" />

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 700 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.5px",
              color: BRAND.violet,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: `linear-gradient(135deg, ${BRAND.violet}, ${BRAND.azure})`,
              }}
            />
            {SITE_NAME}
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-2px",
              color: "#ffffff",
            }}
          >
            {LANDING.ogTitle}
          </div>

          <div style={{ marginTop: 26, fontSize: 27, color: "#a9a9b4" }}>
            {LANDING.cardSubtitle}
          </div>

          <div
            style={{
              marginTop: 36,
              width: 170,
              height: 6,
              borderRadius: 999,
              background: `linear-gradient(90deg, ${BRAND.violet}, ${BRAND.azure})`,
            }}
          />
        </div>
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
