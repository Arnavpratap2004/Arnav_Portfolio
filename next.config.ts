import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    formats: ["image/webp"],
  },
};

export default nextConfig;
