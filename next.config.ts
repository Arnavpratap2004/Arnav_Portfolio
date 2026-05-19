import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  images: {
    deviceSizes: [390, 640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "/gh/devicons/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // Cache optimized images for 1 year
  },

  experimental: {
    optimizePackageImports: ["framer-motion", "@tabler/icons-react"],
  },
};

export default analyzer(nextConfig);
