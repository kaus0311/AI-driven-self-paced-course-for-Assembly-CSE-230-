import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "app/module/[id]/mastery/page": ["../db/init/questions/**/*"],
  }
};

export default nextConfig;
