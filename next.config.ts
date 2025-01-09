/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://learn.reboot01.com/intra/bahrain/profile/api/:path*", // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
