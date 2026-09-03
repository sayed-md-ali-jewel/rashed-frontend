import type { MetadataRoute } from "next";
import { schedules } from "@/lib/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/appointments`, lastModified: new Date() },
    ...schedules.map((schedule) => ({
      url: `${siteUrl}/schedules/${schedule.slug}`,
      lastModified: new Date(schedule.startsAt)
    }))
  ];
}
