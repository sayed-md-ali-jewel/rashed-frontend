import type { MetadataRoute } from "next";
import { getLandingPageData, getWebsiteSetting } from "@/lib/cms-data";
import { connectMongo, hasMongoUri } from "@/lib/mongodb";
import { BlogPostModel, PageModel } from "@/lib/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [setting, data] = await Promise.all([
    getWebsiteSetting(),
    getLandingPageData()
  ]);

  if (setting.sitemapEnabled === false) {
    return [];
  }

  const rawSiteUrl =
    setting.siteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NODE_ENV === "production" ? "https://drrashed.bd" : "http://localhost:3000");
  const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl.replace(/\/+$/, "")
    : `https://${rawSiteUrl.replace(/\/+$/, "")}`;

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0
    },
    {
      url: `${siteUrl}/appointments`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85
    }
  ];

  // Dynamically include all active schedules
  if (Array.isArray(data.schedules)) {
    data.schedules.forEach((schedule) => {
      if (schedule?.slug) {
        routes.push({
          url: `${siteUrl}/schedules/${schedule.slug}`,
          lastModified: schedule.startsAt ? new Date(schedule.startsAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8
        });
      }
    });
  }

  // Dynamically include published blog posts & custom pages if MongoDB connected
  if (hasMongoUri()) {
    try {
      await connectMongo();
      const [blogs, pages] = await Promise.all([
        BlogPostModel.find({ status: "published" }).select("slug updatedAt").lean(),
        PageModel.find({ published: true }).select("slug updatedAt").lean()
      ]);

      if (Array.isArray(blogs)) {
        blogs.forEach((blog: any) => {
          if (blog?.slug) {
            routes.push({
              url: `${siteUrl}/blog/${blog.slug}`,
              lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
              changeFrequency: "weekly",
              priority: 0.7
            });
          }
        });
      }

      if (Array.isArray(pages)) {
        pages.forEach((page: any) => {
          if (page?.slug) {
            routes.push({
              url: `${siteUrl}/pages/${page.slug}`,
              lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
              changeFrequency: "monthly",
              priority: 0.6
            });
          }
        });
      }
    } catch {
      // ignore
    }
  }

  return routes;
}
