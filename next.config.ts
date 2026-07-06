import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Milestone proof photos are uploaded through a server action; the
      // default 1 MB body limit is too small for phone screenshots.
      // The action itself validates files at max 6 MB (multipart overhead fits).
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
