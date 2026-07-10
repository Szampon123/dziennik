// Derives every icon size from the source app icon.
//
// Run by hand — `node scripts/generate-icons.mjs` — after the artwork changes,
// then commit what it writes. It is not part of the build: `sharp` is only
// present as a transitive dependency of `next`, not a declared one, so add it
// to devDependencies before wiring this into an npm script.
//
// The source is a 1024x1024 render of a black squircle sitting on an opaque
// rgb(30,31,32) backdrop, not a transparent-background asset. Measured:
// the squircle occupies x/y 125..897 with a corner radius of ~22% of its side
// (matching the "border-radius 224px" the filename claims, scaled).
//
// So every output is cropped to the squircle first. The hero variant then gets
// transparent corners, so it reads as an app icon floating on the black hero
// rather than a gray rectangle. The platform icons stay opaque: iOS and Android
// apply their own mask and composite alpha onto white, which would ring the
// black artwork with white corners.
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

const REPO = process.argv[3] ?? process.cwd();
const SRC = process.argv[2] ?? `${REPO}/assets/app-icon-source.png`;

// Cropped a couple of px inside the measured bbox: the squircle's outer edge
// carries a soft shadow that fades into the backdrop, and including it leaves a
// gray halo just inside the mask.
const CROP = { left: 128, top: 129, width: 766, height: 766 };
const RADIUS_FRACTION = 0.22;

const squircle = () => sharp(SRC).extract(CROP);

/** An alpha mask: white rounded rect on transparent, used with dest-in. */
function roundedMask(size) {
  const r = Math.round(size * RADIUS_FRACTION);
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
       <rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#fff"/>
     </svg>`
  );
}

/** Cropped squircle at `size`, corners cut to transparent. */
async function rounded(size) {
  const base = await squircle().resize(size, size, { fit: "fill" }).png().toBuffer();
  return sharp(base)
    .composite([{ input: roundedMask(size), blend: "dest-in" }])
    .png()
    .toBuffer();
}

/**
 * Cropped squircle at `size`, fully opaque on black.
 *
 * Masked *before* flattening: the crop's corners are still the source's gray
 * backdrop, so flattening straight away would ring the artwork with
 * rgb(30,31,32) instead of black.
 */
async function opaque(size) {
  return sharp(await rounded(size))
    .flatten({ background: "#000000" })
    .png()
    .toBuffer();
}

/** Minimal .ico container wrapping PNG payloads (Vista+ / every modern browser). */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 == 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)]);
}

mkdirSync(`${REPO}/public/images/landing`, { recursive: true });
mkdirSync(`${REPO}/public/icons`, { recursive: true });

// Hero: 512 is 2.56x the 200px render box — crisp on retina, ~40KB.
writeFileSync(`${REPO}/public/images/landing/icon.png`, await rounded(512));

// PWA. `any` purpose, so they keep their own rounded silhouette.
writeFileSync(`${REPO}/public/icons/icon-192.png`, await rounded(192));
writeFileSync(`${REPO}/public/icons/icon-512.png`, await rounded(512));

// iOS composites alpha onto white and applies its own mask, so this one is opaque.
writeFileSync(`${REPO}/src/app/apple-icon.png`, await opaque(180));

// favicon.ico carrying both 16 and 32.
const ico = buildIco([
  { size: 16, buf: await rounded(16) },
  { size: 32, buf: await rounded(32) },
]);
writeFileSync(`${REPO}/src/app/favicon.ico`, ico);

// The OG card needs the icon as bytes inside the serverless function. Reading it
// from process.cwd() would depend on Vercel's file tracing pulling a public/
// asset into the lambda — a failure that would only show in production. A
// base64 data URI is hermetic, so it is emitted as a TS module instead.
const OG_ICON_PX = 220;
const ogIcon = await rounded(OG_ICON_PX);
const dataUri = `data:image/png;base64,${ogIcon.toString("base64")}`;
writeFileSync(
  `${REPO}/src/app/api/og/icon-data.ts`,
  `// GENERATED — do not edit by hand.
//
// The app icon (public/images/landing/icon.png), cropped to its squircle and
// rounded, as a ${OG_ICON_PX}px data URI.
//
// Inlined rather than read from disk: next/og runs inside the serverless
// function, and reaching public/ from there depends on Vercel's file tracing,
// which fails silently in production and works locally. Satori's 500 KB bundle
// budget covers this comfortably (${(dataUri.length / 1024).toFixed(0)} KB).
//
// Regenerate: node scripts/generate-icons.mjs
export const OG_ICON_DATA_URI =
  "${dataUri}";
`
);
console.log(`  og icon @${OG_ICON_PX}px: ${(ogIcon.length / 1024).toFixed(1)} KB raw -> ${(dataUri.length / 1024).toFixed(1)} KB data URI`);

console.log("wrote:");
for (const p of [
  "public/images/landing/icon.png (512, rounded)",
  "public/icons/icon-192.png (rounded)",
  "public/icons/icon-512.png (rounded)",
  "src/app/apple-icon.png (180, opaque on black)",
  "src/app/favicon.ico (16 + 32)",
  `src/app/api/og/icon-data.ts (${OG_ICON_PX}px data URI)`,
]) console.log("  " + p);
