import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "app/module/[id]/mastery/page": ["../db/init/questions/**/*"],
  }
};

export default nextConfig;
