import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/cv",
        destination: "/Anuja_CV.pdf",
        permanent: true,
      },
      {
        source: "/resume",
        destination: "/Anuja_CV.pdf",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
