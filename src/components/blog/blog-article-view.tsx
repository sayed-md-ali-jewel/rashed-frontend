"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Stethoscope,
  User
} from "lucide-react";
import type { BlogPost, WebsiteSetting } from "@/lib/types";
import { extractTableOfContents } from "@/lib/services/blog.service";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/seo/social-share";
import { TableOfContents } from "./table-of-contents";
import { BlockRenderer } from "./block-renderer";
import { BlogCard } from "./blog-card";
import { safeImageSrc } from "@/lib/utils";

type BlogArticleViewProps = {
  post: BlogPost;
  relatedPosts?: BlogPost[];
  websiteSetting?: WebsiteSetting;
};

export function BlogArticleView({ post, relatedPosts = [], websiteSetting }: BlogArticleViewProps) {
  const toc = useMemo(() => extractTableOfContents(post.contentBlocks || []), [post.contentBlocks]);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "Recently Published";

  const category = post.category || "Physical Medicine";
  const readingTime = post.readingTimeMinutes || 3;
  const authorName = post.author || "Dr. Md. Rashedul Alam";
  const authorRole = post.authorRole || "Physical Medicine & Rehabilitation Specialist";
  const coverImage = post.coverImage || "/placeholder.svg";

  return (
    <article className="min-h-screen bg-cream py-10 lg:py-16">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 space-y-10">
        {/* ================= 1. BREADCRUMBS & TOP NAV ================= */}
        <div className="flex items-center justify-between">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Health Blog", href: "/blog" },
              { label: post.title }
            ]}
          />

          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-blue transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* ================= 2. HERO ARTICLE HEADER ================= */}
        <header className="rounded-3xl border border-line bg-white p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="text-blue border-blue/30 bg-blue/5 text-xs font-bold px-3 py-1">
              {category}
            </Badge>

            <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-blue" />
              {formattedDate}
            </span>

            <span className="text-xs text-muted flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-blue" />
              {readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink leading-tight tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-3xl font-normal">
              {post.excerpt}
            </p>
          )}

          {/* Author Strip */}
          <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="grid size-11 place-items-center rounded-full bg-panel border border-line text-blue text-lg">
                👨‍⚕️
              </div>
              <div>
                <span className="font-bold text-ink text-sm sm:text-base block">{authorName}</span>
                <span className="text-xs text-muted font-medium block">{authorRole}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/#schedules">
                <Button variant="gold" size="sm" className="gap-2 font-bold">
                  <span>Book Consultation</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* ================= 3. FEATURED COVER IMAGE ================= */}
        {post.coverImage && (
          <div className="relative aspect-[21/9] max-h-[520px] w-full rounded-3xl overflow-hidden border border-line bg-slate-900 shadow-md">
            <img
              src={safeImageSrc(coverImage)}
              alt={post.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        )}

        {/* ================= 4. MAIN EDITORIAL CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 xl:gap-14 items-start">
          {/* Left Column: Table of Contents (Sticky on Desktop) */}
          <aside className="w-full">
            <TableOfContents toc={toc} />
          </aside>

          {/* Right Column: Article Body Blocks */}
          <main className="w-full space-y-10">
            {/* Article Content Blocks */}
            <div className="rounded-3xl border border-line bg-white p-7 sm:p-10 lg:p-12 shadow-sm">
              <BlockRenderer blocks={post.contentBlocks || []} />
            </div>

            {/* Social Share Bar */}
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Share This Article</h4>
                <p className="text-xs text-ink font-semibold mt-0.5">Help others learn about physical medicine & spinal health</p>
              </div>
              <SocialShare title={post.seo?.seoTitle || post.title} path={`/blog/${post.slug}`} />
            </div>

            {/* Author Profile Bio Box */}
            <div className="rounded-3xl border border-line bg-gradient-to-br from-white via-panel to-sky-50/40 p-8 shadow-sm flex flex-col sm:flex-row items-start gap-6">
              <div className="grid size-16 place-items-center rounded-2xl bg-blue/10 text-blue text-2xl border border-blue/20 shrink-0">
                🩺
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-ink">{authorName}</h3>
                    <p className="text-xs font-semibold text-blue">{authorRole}</p>
                  </div>
                  <Link href="/#profile">
                    <Button variant="outline" size="sm" className="text-xs rounded-xl border-line">
                      View Full Profile
                    </Button>
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  Specialized in modern physical medicine, non-surgical spine treatment, osteoarthritis management, and advanced clinical rehabilitation.
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* ================= 5. RELATED ARTICLES ================= */}
        {relatedPosts.length > 0 && (
          <section className="pt-8 border-t border-line space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue uppercase tracking-wider">Related Reading</span>
                <h3 className="text-2xl font-extrabold text-ink mt-1">Recommended Health Articles</h3>
              </div>
              <Link href="/blog" className="text-xs font-bold text-blue hover:underline">
                View All Articles &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <BlogCard key={rel.id || rel._id} post={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
