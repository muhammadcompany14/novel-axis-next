import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* GSAP ScrollTrigger pinning is sensitive to StrictMode double-mounting in dev */
  reactStrictMode: false,
  images: {
    /* Server-side optimization times out on this network + SimpleIcons SVGs are
       rejected by the optimizer (dangerouslyAllowSVG). Direct CDN loading is
       faster and avoids both problems. Unsplash URLs already carry w/q params. */
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
};

export default nextConfig;
