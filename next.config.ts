import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Steam avatars + game art for /gaming
      { protocol: "https", hostname: "avatars.fastly.steamstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com", pathname: "/steam/apps/**" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
