import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // Fallback provided in case the env var is missing during a build check
    const rawUrl = process.env.BACKEND_URL || "http://localhost:9000";
    const backendUrl = rawUrl.replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        // Interpolate the URL here
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },

  images: {
    localPatterns: [
      {
        pathname: "/api/media/**",
        search: "?*",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "3000.code.lawsonserver.xyz",
        port: "",
        pathname: "/api/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/api/media/**",
      },
    ],
  },
};

export default nextConfig;
