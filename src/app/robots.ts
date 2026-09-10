import type { MetadataRoute } from "next";
import { getWebsiteSetting } from "@/lib/cms-data";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const setting = await getWebsiteSetting();
  const rawSiteUrl =
    setting.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://drrashed.bd" : "http://localhost:3000");
  const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl.replace(/\/+$/, "")
    : `https://${rawSiteUrl.replace(/\/+$/, "")}`;

  // If search engine indexing is explicitly disabled
  if (setting.allowIndexing === false) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      },
      sitemap: setting.sitemapEnabled !== false ? `${siteUrl}/sitemap.xml` : undefined
    };
  }

  const disallowed =
    Array.isArray(setting.disallowedPaths) && setting.disallowedPaths.length > 0
      ? setting.disallowedPaths
      : ["/admin", "/api", "/patient"];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: disallowed
    },
    sitemap: setting.sitemapEnabled !== false ? `${siteUrl}/sitemap.xml` : undefined
  };
}
