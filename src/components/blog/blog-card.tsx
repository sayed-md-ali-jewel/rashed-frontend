"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDateTime, safeImageSrc } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cover = post.coverImage || "/placeholder.svg";
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "Recently Published";

  const readingTime = post.readingTimeMinutes || 3;
  const category = post.category || "Physical Medicine";

  if (featured) {
    return (
      <div className="group rounded-3xl border border-line bg-white overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr]">
        {/* Image side */}
        <div className="relative aspect-[16/10] lg:aspect-auto w-full overflow-hidden bg-slate-100">
          <img
            src={safeImageSrc(cover)}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue px-3.5 py-1 text-xs font-bold text-white shadow-sm">
              ★ Featured Article
            </span>
          </div>
        </div>

        {/* Text side */}
        <div className="p-8 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-blue border-blue/30 bg-blue/5 text-xs font-bold">
                {category}
              </Badge>
              <span className="text-xs text-muted flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5 text-blue" />
                {readingTime} min read
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight group-hover:text-blue transition-colors">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>

            <p className="text-sm sm:text-base text-muted leading-relaxed line-clamp-3">
              {post.excerpt || "Read medical guidelines and evidence-based insights by Dr. Md. Rashedul Alam."}
            </p>
          </div>

          <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-panel text-blue font-bold border border-line text-xs">
                🩺
              </div>
              <div className="text-xs">
                <span className="font-bold text-ink block">{post.author || "Dr. Md. Rashedul Alam"}</span>
                <span className="text-muted text-[11px]">{formattedDate}</span>
              </div>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue group-hover:underline">
                Read Full Article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div>
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-line">
          <img
            src={safeImageSrc(cover)}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/95 text-ink border-line font-bold text-[10px] shadow-sm backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-blue" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="h-3 w-3 text-blue" />
              {readingTime} min read
            </span>
          </div>

          <h3 className="text-lg font-bold text-ink leading-snug group-hover:text-blue transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-muted leading-relaxed line-clamp-3">
            {post.excerpt || "Read full medical guide and physical medicine recommendations."}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-line/60 mt-4 flex items-center justify-between">
        <span className="text-xs text-muted font-medium truncate max-w-[140px]">
          {post.author || "Dr. Md. Rashedul Alam"}
        </span>
        <Link href={`/blog/${post.slug}`}>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue group-hover:underline">
            Read Article <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>
    </article>
  );
}
