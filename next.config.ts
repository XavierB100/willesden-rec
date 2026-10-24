import type { NextConfig } from "next";

const storageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: storageHost
      ? [
          {
            protocol: "https",
            hostname: storageHost,
            pathname: "/storage/v1/object/public/product-images/**",
            search: "",
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Preserve common previous static entry points at domain cutover.
      { source: "/shop", destination: "/stock", permanent: true },
      { source: "/yard-stock", destination: "/stock", permanent: true },
      {
        source: "/product-category/yard-stock",
        destination: "/stock",
        permanent: true,
      },
      {
        source: "/product-category/fireplaces/:path*",
        destination: "/fireplaces",
        permanent: true,
      },
      {
        source: "/product-category/windows/:path*",
        destination: "/windows",
        permanent: true,
      },
      {
        source: "/product-category/doors/:path*",
        destination: "/doors",
        permanent: true,
      },
      { source: "/exterior", destination: "/doors", permanent: true },
      { source: "/interior", destination: "/doors", permanent: true },
      ...[
        "baskets-fire-dogs",
        "combination-fireplaces",
        "inserts",
        "surrounds",
      ].map((path) => ({
        source: `/${path}`,
        destination: "/fireplaces",
        permanent: true,
      })),
      {
        source: "/wp-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      { source: "/home", destination: "/", permanent: true },
      { source: "/home.html", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
    ];
  },
};
export default nextConfig;
