import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tomadachi-bond-tracker.netlify.app";

/**
 * Next.js 14 App Router robots.ts
 * Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all well-behaved crawlers to index the full site.
        userAgent: "*",
        allow: "/",
      },
      {
        // Block AI training scrapers that ignore standard crawl budgets.
        // These do not respect robots.txt universally, but declaring intent
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Bytespider",
          "Diffbot",
          "ImagesiftBot",
          "magpie-crawler",
          "Omgili",
          "Omgilibot",
          "facebookexternalhit",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
