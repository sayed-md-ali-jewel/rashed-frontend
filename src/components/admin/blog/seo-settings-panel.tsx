"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Eye,
  Globe,
  Info,
  Laptop,
  Maximize2,
  Share2,
  Smartphone,
  Sparkles,
  Twitter
} from "lucide-react";
import type { SEOFields } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type SEOSettingsPanelProps = {
  seo: SEOFields & { focusKeyword?: string; metaRobots?: string };
  onChange: (seo: SEOFields & { focusKeyword?: string; metaRobots?: string }) => void;
  blogTitle: string;
  blogSlug: string;
  blogExcerpt: string;
  blogCoverImage?: string;
  category?: string;
  mediaList?: Array<{ url?: string; title?: string; [key: string]: any }>;
};

export function SEOSettingsPanel({
  seo,
  onChange,
  blogTitle,
  blogSlug,
  blogExcerpt,
  blogCoverImage,
  category,
  mediaList = []
}: SEOSettingsPanelProps) {
  const [serpViewMode, setSerpViewMode] = useState<"desktop" | "mobile">("desktop");
  const [socialViewMode, setSocialViewMode] = useState<"facebook" | "twitter">("facebook");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rashedulalam.com";
  const effectiveSlug = blogSlug || "article-slug";
  const fullArticleUrl = `${siteUrl}/blog/${effectiveSlug}`;

  // Calculated Fallbacks
  const effectiveTitle = seo.seoTitle || (blogTitle ? `${blogTitle} | Dr. Md. Rashedul Alam` : "Health Article | Dr. Md. Rashedul Alam");
  const effectiveDesc = seo.metaDescription || (blogExcerpt ? blogExcerpt.slice(0, 160) : "Read clinical advice, spine care, and physical medicine guidelines by Dr. Md. Rashedul Alam.");
  const effectiveImage = seo.ogImage || blogCoverImage || `${siteUrl}/images/doctor-og.jpg`;

  const updateField = (key: string, value: any) => {
    onChange({
      ...seo,
      [key]: value
    });
  };

  const titleLength = effectiveTitle.length;
  const descLength = effectiveDesc.length;

  return (
    <div className="space-y-6">
      {/* Top Banner: SEO Status */}
      <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span>Search Engine Optimization & Social Sharing Suite</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize your medical article for Google search rankings and social media previews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px]">
            Schema: MedicalWebPage
          </Badge>
        </div>
      </div>

      {/* Main Grid: Form Controls (Left) + Live Previews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Form Fields */}
        <div className="space-y-4">
          {/* 1. SEO Title */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                SEO Title (Meta Title) <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] font-mono ${titleLength >= 40 && titleLength <= 65 ? "text-emerald-400 font-bold" : "text-amber-400"}`}>
                {titleLength}/60 chars {titleLength >= 40 && titleLength <= 65 ? "✓ Good" : "(Aim 40-60)"}
              </span>
            </div>
            <Input
              value={seo.seoTitle || ""}
              onChange={(e) => updateField("seoTitle", e.target.value)}
              placeholder={blogTitle ? `${blogTitle} | Dr. Md. Rashedul Alam` : "Enter SEO title..."}
              className="border-slate-800 bg-slate-950 text-xs text-white"
            />
            <p className="text-[10px] text-slate-500">
              The primary title shown as the blue clickable headline in Google search results.
            </p>
          </div>

          {/* 2. Meta Description */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200">
                Meta Description <span className="text-rose-400">*</span>
              </label>
              <span className={`text-[10px] font-mono ${descLength >= 120 && descLength <= 160 ? "text-emerald-400 font-bold" : "text-amber-400"}`}>
                {descLength}/160 chars {descLength >= 120 && descLength <= 160 ? "✓ Good" : "(Aim 120-160)"}
              </span>
            </div>
            <textarea
              rows={3}
              value={seo.metaDescription || ""}
              onChange={(e) => updateField("metaDescription", e.target.value)}
              placeholder={blogExcerpt || "Summarize the key medical insights and patient takeaways..."}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* 3. Focus Keyword & Search Terms */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Focus Keyword / Topic
                </label>
                <Input
                  value={seo.focusKeyword || ""}
                  onChange={(e) => updateField("focusKeyword", e.target.value)}
                  placeholder="e.g. Back Pain Treatment"
                  className="border-slate-800 bg-slate-950 text-xs text-teal-300 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Meta Robots
                </label>
                <select
                  value={seo.metaRobots || "index, follow"}
                  onChange={(e) => updateField("metaRobots", e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="index, follow">Index, Follow (Recommended)</option>
                  <option value="noindex, follow">NoIndex, Follow</option>
                  <option value="noindex, nofollow">NoIndex, NoFollow</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Canonical URL
              </label>
              <Input
                value={seo.canonicalUrl || ""}
                onChange={(e) => updateField("canonicalUrl", e.target.value)}
                placeholder={fullArticleUrl}
                className="border-slate-800 bg-slate-950 text-xs text-slate-300 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Leave empty to automatically use the official canonical article URL.
              </p>
            </div>
          </div>

          {/* 4. OpenGraph & Social Tags */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5 text-teal-400" />
              <span>Social Media & OpenGraph Sharing Customization</span>
            </h5>

            <div className="space-y-2">
              <label className="block text-[11px] text-slate-300">Social Share Image (OG Image)</label>
              <div className="flex items-center gap-2">
                <Input
                  value={seo.ogImage || ""}
                  onChange={(e) => {
                    updateField("ogImage", e.target.value);
                    updateField("twitterImage", e.target.value);
                  }}
                  placeholder="https://... or choose from gallery"
                  className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-mono flex-1"
                />
                {mediaList.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        updateField("ogImage", e.target.value);
                        updateField("twitterImage", e.target.value);
                      }
                    }}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs text-slate-300 max-w-[130px]"
                  >
                    <option value="">Media Image</option>
                    {mediaList.filter((m) => Boolean(m.url)).map((m, i) => (
                      <option key={i} value={m.url!}>
                        {m.title || (m.url ? m.url.split("/").pop() : "Image")}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Custom OG Title</label>
                <Input
                  value={seo.ogTitle || ""}
                  onChange={(e) => updateField("ogTitle", e.target.value)}
                  placeholder={blogTitle || "OG Title..."}
                  className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Custom Twitter / X Title</label>
                <Input
                  value={seo.twitterTitle || ""}
                  onChange={(e) => updateField("twitterTitle", e.target.value)}
                  placeholder={blogTitle || "Twitter Title..."}
                  className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Previews */}
        <div className="space-y-5 sticky top-4">
          {/* ================= PREVIEW 1: GOOGLE SERP SNIPPET ================= */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-sky-400" />
                <h5 className="text-xs font-bold text-white">Google Search Result Preview</h5>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setSerpViewMode("desktop")}
                  className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${
                    serpViewMode === "desktop" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Laptop className="h-3 w-3" /> Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setSerpViewMode("mobile")}
                  className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-all ${
                    serpViewMode === "mobile" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="h-3 w-3" /> Mobile
                </button>
              </div>
            </div>

            {/* Google SERP Card Rendering */}
            <div className={`rounded-xl border border-slate-800 bg-white p-4 text-left shadow-sm ${serpViewMode === "mobile" ? "max-w-sm mx-auto" : "w-full"}`}>
              {/* SERP Site Header */}
              <div className="flex items-center gap-2 mb-1">
                <div className="grid size-6 place-items-center rounded-full bg-slate-100 text-[10px] font-bold text-teal-800 border">
                  🩺
                </div>
                <div className="text-[11px] leading-tight text-slate-800">
                  <span className="font-semibold block text-slate-900">Dr. Md. Rashedul Alam</span>
                  <span className="font-mono text-slate-500 text-[10px] truncate block max-w-xs">
                    {siteUrl.replace(/^https?:\/\//, "")} › blog › {effectiveSlug}
                  </span>
                </div>
              </div>

              {/* SERP Title */}
              <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2">
                {effectiveTitle}
              </h3>

              {/* SERP Snippet */}
              <p className="mt-1 text-xs text-[#4d5156] leading-relaxed line-clamp-3">
                <span className="text-slate-400 text-[11px] mr-1">
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} —
                </span>
                {effectiveDesc}
              </p>
            </div>
          </div>

          {/* ================= PREVIEW 2: SOCIAL SHARE CARD ================= */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-emerald-400" />
                <h5 className="text-xs font-bold text-white">Social Media Share Card Preview</h5>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setSocialViewMode("facebook")}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                    socialViewMode === "facebook" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Facebook / LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setSocialViewMode("twitter")}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                    socialViewMode === "twitter" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  X / Twitter
                </button>
              </div>
            </div>

            {/* Social Card Rendering */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-md">
              {/* Image Banner */}
              <div className="relative aspect-[1.91/1] w-full bg-slate-900 overflow-hidden">
                {effectiveImage ? (
                  <img src={effectiveImage} alt={effectiveTitle} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600 text-xs">
                    No image configured
                  </div>
                )}
              </div>

              {/* Social Card Details */}
              <div className="p-3 bg-slate-900 border-t border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block truncate">
                  {siteUrl.replace(/^https?:\/\//, "")}
                </span>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                  {seo.ogTitle || effectiveTitle}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {seo.ogDescription || effectiveDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
