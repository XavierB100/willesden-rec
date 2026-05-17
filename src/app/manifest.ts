import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Willesden Reclamation",
    short_name: "Willesden",
    description:
      "Vintage and architectural salvage from Willesden Reclamation in London NW10.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f0",
    theme_color: "#2f4f4f",
    icons: [
      {
        src: "/wr-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/wr-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
