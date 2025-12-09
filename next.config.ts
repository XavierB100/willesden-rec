
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // Required for static export to GitHub Pages
  basePath: "/willesden-rec", // Required for GitHub Project Pages
  images: {
    unoptimized: true, // Required because Next.js Image Optimization doesn't work with 'export'
  },
};

export default nextConfig;
