import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**", // match any path under /api/
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/**", // match any path under /api/
      },
    ],
  },
};

export default nextConfig;
