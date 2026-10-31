import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Hermann Richy - Développeur Fullstack & Frontend Master",
        short_name: "Hermann Richy",
        description: "Portfolio et blog de Hermann Richy, développeur fullstack basé à Cotonou.",
        start_url: "/",
        display: "standalone",
        background_color: "#0d0d0d",
        theme_color: "#1e45fb",
        lang: "fr",
        icons: [
            { src: "/icon", sizes: "512x512", type: "image/png" },
            { src: "/apple-icon", sizes: "180x180", type: "image/png" },
        ],
    };
}
