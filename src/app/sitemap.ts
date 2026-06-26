import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://anujajay.com");

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl.replace(/\/$/, "");
  // Use a fixed date rather than new Date() so lastModified only changes
  // when content actually changes — prevents unnecessary recrawls.
  const siteLastModified = new Date("2026-06-26");

  return [
    {
      url: `${base}/`,
      lastModified: siteLastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/dir/Anuja_CV.pdf`,
      lastModified: siteLastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
