import type { NextConfig } from "next";

// GSAP uses new Function() internally when registering plugins (ScrollTrigger, SplitText, etc.)
// unsafe-eval is required. unsafe-inline is required for Next.js inline scripts.
const CLOUDINARY_IMG = "https://res.cloudinary.com";
const YOUTUBE = "https://www.youtube-nocookie.com https://www.youtube.com";

const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // Images des articles : Cloudinary et adresses https collées dans l'éditeur
  `img-src 'self' data: blob: ${CLOUDINARY_IMG} https:`,
  "font-src 'self' data:",
  // Envoi direct des images du dashboard vers Cloudinary
  "connect-src 'self' ws: wss: https://api.cloudinary.com",
  // Vidéos YouTube intégrées aux articles
  `frame-src ${YOUTUBE}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Images envoyées depuis le dashboard (Cloudinary)
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
