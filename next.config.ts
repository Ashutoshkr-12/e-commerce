import type { NextConfig } from "next";

type ExtendedNextConfig = NextConfig & {
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
};

const nextConfig: ExtendedNextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  images:{
    remotePatterns:[
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
    ],
  }
};

export default nextConfig;
