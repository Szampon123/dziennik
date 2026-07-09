import type { NextConfig } from "next";

// Dev needs 'unsafe-eval': Turbopack/React Fast Refresh evaluate generated code.
// The production bundle does not, so it is omitted there.
const isDev = process.env.NODE_ENV !== "production";

// 'unsafe-inline' scripts stay: the theme-init script in layout.tsx and Next.js's
// own bootstrap are inline, and the App Router has no clean nonce hook. Styles
// need it too (Recharts writes inline SVG styles).
//
// Fonts are self-hosted by next/font at build time — the browser never contacts
// fonts.googleapis.com or fonts.gstatic.com, so 'self' covers them. Photos are
// streamed through same-origin API routes rather than linked at their Blob URL,
// so img-src needs no vercel-storage host either.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Ignored over plain HTTP, so harmless on localhost.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Milestone proof photos are uploaded through a server action; the
      // default 1 MB body limit is too small for phone screenshots. Kept under
      // Vercel's ~4.5 MB serverless request-body cap — the action validates
      // files at max 4 MB (MAX_PHOTO_BYTES), leaving room for multipart overhead.
      bodySizeLimit: "4.5mb",
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
