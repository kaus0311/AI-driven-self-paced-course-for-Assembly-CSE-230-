import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  basePath: '/your-repo-name',       // 👈 important for GitHub Pages
  assetPrefix: '/your-repo-name/',   // 👈 important for GitHub Pages
};

module.exports = nextConfig;
