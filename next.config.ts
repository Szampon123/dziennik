import type { NextConfig } from "next";

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
};

export default nextConfig;
