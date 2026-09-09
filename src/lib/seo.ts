import type { Metadata } from "next";
import type { SEOFields } from "./types";
import { safeImageSrc } from "./utils";

export function buildMetadata(
  seo?: Partial<SEOFields> | null,
  path = "/",
  fallbacks?: { title?: string; description?: string; image?: string }
): Metadata {
  const baseDomain = process.env.NEXT_PUBLIC_SITE_URL || "";
  const title = seo?.seoTitle || fallbacks?.title || "Dr. Rashed - Specialist Doctor & Appointment Booking";
  const description =
    seo?.metaDescription ||
    fallbacks?.description ||
    "Book confirmed serial appointments online with specialist doctor. View chamber schedules, fees, and location details.";
  const canonical = seo?.canonicalUrl || (baseDomain ? `${baseDomain}${path}` : undefined);
  const ogTitle = seo?.ogTitle || title;
  const ogDescription = seo?.ogDescription || description;
  const rawImage = seo?.ogImage || fallbacks?.image;
  const image = rawImage ? safeImageSrc(rawImage) : undefined;
  const rawTwitterImage = seo?.twitterImage || image;
  const twitterImage = rawTwitterImage ? safeImageSrc(rawTwitterImage) : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    robots: {
      index: !seo?.noIndex,
      follow: !seo?.noIndex
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      siteName: "Dr. Rashed",
      locale: "en_US",
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: ogTitle }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.twitterTitle || ogTitle,
      description: seo?.twitterDescription || ogDescription,
      images: twitterImage ? [twitterImage] : undefined
    }
  };
}

export function seoScore(seo: SEOFields, body: string) {
  let score = 0;
  if (seo.seoTitle?.length >= 35 && seo.seoTitle.length <= 65) score += 20;
  if (seo.metaDescription?.length >= 120 && seo.metaDescription.length <= 160) score += 20;
  if (seo.focusKeyword && body.toLowerCase().includes(seo.focusKeyword.toLowerCase())) score += 20;
  if (seo.canonicalUrl) score += 10;
  if (seo.ogTitle && seo.ogDescription && seo.ogImage) score += 15;
  if (seo.schema) score += 15;
  return score;
}
