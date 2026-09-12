import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts, getWebsiteSetting } from "@/lib/cms-data";
import { buildMetadata } from "@/lib/seo";
import { BlogArticleView } from "@/components/blog/blog-article-view";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post, setting] = await Promise.all([
    getBlogPostBySlug(slug),
    getWebsiteSetting()
  ]);

  if (!post) {
    return {
      title: "Article Not Found",
      description: "The requested medical article could not be found."
    };
  }

  const siteUrl = setting.siteUrl || "https://rashedulalam.com";
  const canonicalUrl = post.seo?.canonicalUrl || `${siteUrl}/blog/${post.slug}`;
  const seoTitle = post.seo?.seoTitle || `${post.title} | ${setting.siteName || "Dr. Md. Rashedul Alam"}`;
  const metaDescription = post.seo?.metaDescription || post.excerpt;
  const ogImage = post.seo?.ogImage || post.coverImage || setting.defaultSeo?.ogImage;

  return buildMetadata(
    {
      seoTitle,
      metaDescription,
      canonicalUrl,
      ogTitle: post.seo?.ogTitle || post.title,
      ogDescription: post.seo?.ogDescription || metaDescription,
      ogImage,
      twitterTitle: post.seo?.twitterTitle || post.title,
      twitterDescription: post.seo?.twitterDescription || metaDescription,
      twitterImage: post.seo?.twitterImage || ogImage,
      noIndex: post.status === "draft" || post.seo?.noIndex || post.seo?.metaRobots?.includes("noindex")
    },
    `/blog/${post.slug}`
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts, websiteSetting] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPosts({ limit: 6 }),
    getWebsiteSetting()
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = allPosts.filter(
    (p) => (p.slug !== post.slug && p.id !== post.id) &&
      (post.category ? p.category?.toLowerCase() === post.category.toLowerCase() : true)
  ).slice(0, 3);

  // Fallback to any recent posts if category didn't yield enough
  const finalRelatedPosts = relatedPosts.length > 0
    ? relatedPosts
    : allPosts.filter((p) => p.slug !== post.slug && p.id !== post.id).slice(0, 3);

  // Build JSON-LD structured schema
  const siteUrl = websiteSetting.siteUrl || "https://rashedulalam.com";
  const canonicalUrl = post.seo?.canonicalUrl || `${siteUrl}/blog/${post.slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      "@type": "Person",
      name: post.author || "Dr. Md. Rashedul Alam",
      jobTitle: post.authorRole || "Physical Medicine & Rehabilitation Specialist"
    },
    publisher: {
      "@type": "Organization",
      name: websiteSetting.siteName || "Dr. Md. Rashedul Alam Clinic",
      logo: {
        "@type": "ImageObject",
        url: websiteSetting.logo || `${siteUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  // Collect FAQ items from blocks for FAQ Schema
  const faqBlocks = post.contentBlocks?.filter((b) => b.type === "faq" && Array.isArray(b.data?.faqs)) || [];
  const allFaqs = faqBlocks.flatMap((b) => b.data?.faqs || []);
  const faqSchema = allFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((faq: { question: string; answer: string }) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <BlogArticleView
        post={post}
        relatedPosts={finalRelatedPosts}
        websiteSetting={websiteSetting}
      />
    </>
  );
}
