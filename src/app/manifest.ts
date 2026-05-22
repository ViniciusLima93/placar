import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Placar de Vôlei",
    short_name: "Vôlei",
    description: "Placar para partidas de vôlei",
    start_url: "/",
    display: "standalone",
    background_color: "#1d4ed8",
    theme_color: "#1d4ed8",
    orientation: "landscape",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
