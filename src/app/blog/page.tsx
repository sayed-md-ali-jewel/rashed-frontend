import { getBlogPosts, getWebsiteSetting } from "@/lib/cms-data";
import { buildMetadata } from "@/lib/seo";
import { BlogListingView } from "@/components/blog/blog-listing-view";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const setting = await getWebsiteSetting();
  const siteName = setting.siteName || "Dr. Md. Rashedul Alam";

  return buildMetadata(
    {
      seoTitle: `Medical Articles & Health Insights | ${siteName}`,
      metaDescription: `Read medical guidelines, rehabilitation protocols, and evidence-based clinical articles by ${siteName}.`,
      canonicalUrl: `${setting.siteUrl || ""}/blog`,
      ogTitle: `Medical Articles & Health Insights | ${siteName}`,
      ogDescription: `Clinical articles, recovery guides, and medical advice by ${siteName}.`,
      ogImage: setting.defaultSeo?.ogImage || "/images/doctor-og.jpg"
    },
    "/blog"
  );
}

export default async function BlogPage() {
  const [posts, setting] = await Promise.all([
    getBlogPosts({ includeDrafts: false }),
    getWebsiteSetting()
  ]);

  const doctorName = setting.siteName || "Dr. Md. Rashedul Alam";

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Hero Header */}
        <header className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-4 py-1 text-xs font-bold text-blue tracking-wide uppercase">
            <BookOpen className="h-3.5 w-3.5" />
            Clinical Knowledge & Articles
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            Medical Insights & Evidence-Based Care
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            Explore clinical articles, physical medicine protocols, and non-surgical treatment guidelines authored by {doctorName}.
          </p>
        </header>

        {/* Client Interactive Listing View */}
        <BlogListingView initialPosts={posts} doctorName={doctorName} />
      </div>
    </div>
  );
}
