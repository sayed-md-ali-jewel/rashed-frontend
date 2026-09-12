"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  Eye,
  FileEdit,
  Globe,
  ImageIcon,
  Layers,
  Loader2,
  Save,
  Send,
  Sparkles,
  Tag,
  User,
  X
} from "lucide-react";
import type { BlogBlock, BlogPost, SEOFields } from "@/lib/types";
import { BlogService, convertLegacyContentToBlocks, slugifyText } from "@/lib/services/blog.service";
import { BlockEditor } from "./block-editor";
import { SEOSettingsPanel } from "./seo-settings-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type BlogPostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editingBlog: any | null;
  mediaList?: Array<{ url?: string; title?: string; [key: string]: any }>;
  onSaved: () => void;
  triggerToast: (msg: string, isError?: boolean) => void;
};

export function BlogPostModalDialog({
  isOpen,
  onClose,
  editingBlog,
  mediaList = [],
  onSaved,
  triggerToast
}: BlogPostModalProps) {
  const [activeTab, setActiveTab] = useState<"blocks" | "seo" | "publishing">("blocks");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("Dr. Md. Rashedul Alam");
  const [authorRole, setAuthorRole] = useState("Physical Medicine & Rehabilitation Specialist");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [category, setCategory] = useState("Physical Medicine");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [publishedAt, setPublishedAt] = useState("");

  // Blocks State
  const [blocks, setBlocks] = useState<BlogBlock[]>([]);

  // SEO State
  const [seo, setSeo] = useState<SEOFields & { focusKeyword?: string; metaRobots?: string }>({
    seoTitle: "",
    metaDescription: "",
    focusKeyword: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    noIndex: false
  });

  const isEdit = Boolean(editingBlog && (editingBlog._id || editingBlog.id));

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title || "");
      setSlug(editingBlog.slug || "");
      setExcerpt(editingBlog.excerpt || "");
      setCoverImage(editingBlog.coverImage || "");
      setAuthor(editingBlog.author || "Dr. Md. Rashedul Alam");
      setAuthorRole(editingBlog.authorRole || "Physical Medicine & Rehabilitation Specialist");
      setAuthorAvatar(editingBlog.authorAvatar || "");
      setCategory(editingBlog.category || "Physical Medicine");
      setTagsInput(Array.isArray(editingBlog.tags) ? editingBlog.tags.join(", ") : "");
      setStatus(editingBlog.status === "draft" ? "draft" : "published");
      setPublishedAt(editingBlog.publishedAt ? new Date(editingBlog.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));

      // Resolve content blocks: if contentBlocks array exists, use it; otherwise convert legacy content string
      if (Array.isArray(editingBlog.contentBlocks) && editingBlog.contentBlocks.length > 0) {
        setBlocks(editingBlog.contentBlocks);
      } else {
        const converted = convertLegacyContentToBlocks(editingBlog.content || "");
        setBlocks(converted);
      }

      setSeo({
        seoTitle: editingBlog.seo?.seoTitle || "",
        metaDescription: editingBlog.seo?.metaDescription || "",
        focusKeyword: editingBlog.seo?.focusKeyword || editingBlog.category || "",
        canonicalUrl: editingBlog.seo?.canonicalUrl || "",
        ogTitle: editingBlog.seo?.ogTitle || "",
        ogDescription: editingBlog.seo?.ogDescription || "",
        ogImage: editingBlog.seo?.ogImage || editingBlog.coverImage || "",
        twitterTitle: editingBlog.seo?.twitterTitle || "",
        twitterDescription: editingBlog.seo?.twitterDescription || "",
        twitterImage: editingBlog.seo?.twitterImage || editingBlog.coverImage || "",
        metaRobots: editingBlog.seo?.metaRobots || "index, follow",
        noIndex: Boolean(editingBlog.seo?.noIndex)
      });
    } else {
      // Default New Post
      setTitle("");
      setSlug("");
      setExcerpt("");
      setCoverImage(mediaList[0]?.url || "");
      setAuthor("Dr. Md. Rashedul Alam");
      setAuthorRole("Physical Medicine & Rehabilitation Specialist");
      setAuthorAvatar("");
      setCategory("Physical Medicine");
      setTagsInput("Physical Medicine, Spine Care, Pain Relief, Rehabilitation");
      setStatus("published");
      setPublishedAt(new Date().toISOString().slice(0, 16));

      setBlocks([
        {
          id: "block-h2-1",
          type: "h2",
          content: "What Is Physical Medicine and Rehabilitation?",
          anchorId: "what-is-physical-medicine-and-rehabilitation",
          order: 0
        },
        {
          id: "block-p-1",
          type: "paragraph",
          content: "Physical Medicine and Rehabilitation (PM&R), also known as physiatry, is a medical specialty focused on restoring functional ability and quality of life to individuals with physical impairments or disabilities affecting the brain, spinal cord, nerves, bones, joints, ligaments, muscles, and tendons.",
          order: 1
        },
        {
          id: "block-h2-2",
          type: "h2",
          content: "Common Conditions We Treat",
          anchorId: "common-conditions-we-treat",
          order: 2
        },
        {
          id: "block-h3-1",
          type: "h3",
          content: "Chronic Back and Neck Pain",
          anchorId: "chronic-back-and-neck-pain",
          order: 3
        },
        {
          id: "block-p-2",
          type: "paragraph",
          content: "Back and neck discomfort often arises from poor ergonomics, disc herniation, or postural fatigue. Early targeted physiotherapy and physical medicine interventions provide significant lasting relief without surgery.",
          order: 4
        },
        {
          id: "block-h3-2",
          type: "h3",
          content: "Joint and Osteoarthritis Care",
          anchorId: "joint-and-osteoarthritis-care",
          order: 5
        },
        {
          id: "block-p-3",
          type: "paragraph",
          content: "Comprehensive non-operative joint therapies, mobility exercises, and guided injections help preserve joint longevity and minimize inflammation.",
          order: 6
        },
        {
          id: "block-quote-1",
          type: "quote",
          content: "Early clinical intervention and structured physical rehabilitation prevent chronic disability and restore full mobility.",
          data: { author: "Dr. Md. Rashedul Alam", citation: "Specialist Advice", style: "modern" },
          order: 7
        },
        {
          id: "block-cta-1",
          type: "cta",
          content: "",
          data: {
            badge: "Expert Consultation",
            title: "Ready to Overcome Chronic Pain?",
            description: "Book an in-person consultation serial with Dr. Md. Rashedul Alam at your nearest chamber location.",
            buttonText: "Book Appointment Serial",
            buttonUrl: "/#schedules",
            theme: "teal"
          },
          order: 8
        }
      ]);

      setSeo({
        seoTitle: "",
        metaDescription: "",
        focusKeyword: "Physical Medicine",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterTitle: "",
        twitterDescription: "",
        twitterImage: "",
        metaRobots: "index, follow",
        noIndex: false
      });
    }
  }, [editingBlog, isOpen]);

  // Real-time estimated reading time
  const readingTime = useMemo(() => BlogService.calculateReadingTime(blocks), [blocks]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      triggerToast("Please enter an article title", true);
      return;
    }

    const finalSlug = slug.trim() || slugifyText(title);
    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    try {
      const blogId = editingBlog?._id || editingBlog?.id;
      const url = isEdit ? `/api/admin/blog-posts/${blogId}` : "/api/admin/blog-posts";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        title,
        slug: finalSlug,
        excerpt,
        contentBlocks: blocks,
        coverImage,
        author,
        authorRole,
        authorAvatar,
        category,
        tags: tagsArray,
        status,
        readingTimeMinutes: readingTime,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
        seo: {
          seoTitle: seo.seoTitle || `${title} | Dr. Md. Rashedul Alam`,
          metaDescription: seo.metaDescription || excerpt.slice(0, 160),
          focusKeyword: seo.focusKeyword || category,
          canonicalUrl: seo.canonicalUrl || undefined,
          ogTitle: seo.ogTitle || title,
          ogDescription: seo.ogDescription || excerpt,
          ogImage: seo.ogImage || coverImage,
          twitterTitle: seo.twitterTitle || title,
          twitterDescription: seo.twitterDescription || excerpt,
          twitterImage: seo.twitterImage || coverImage,
          metaRobots: seo.metaRobots || "index, follow",
          noIndex: seo.noIndex || false
        }
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save blog post");
      }

      triggerToast(isEdit ? "Blog article updated successfully!" : "New blog article published successfully!");
      onSaved();
      onClose();
    } catch (err: any) {
      triggerToast(err.message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-hidden">
      <Card className="w-full max-w-6xl h-[94vh] flex flex-col border-slate-800 bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 shrink-0 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <FileEdit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>{isEdit ? "Advanced Blog Post Editor" : "Create New Blog Article"}</span>
                <Badge className={status === "published" ? "bg-emerald-500/20 text-emerald-300 border-0 text-[10px]" : "bg-amber-500/20 text-amber-300 border-0 text-[10px]"}>
                  {status.toUpperCase()}
                </Badge>
              </h3>
              <p className="text-xs text-slate-400">
                WordPress-style block content builder, automatic Table of Contents index, and full SEO controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-slate-800 text-slate-300 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-semibold text-xs rounded-xl gap-1.5 px-4 shadow-lg shadow-teal-950/50"
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>{isEdit ? "Save & Update Article" : "Publish Article"}</span>
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Header */}
        <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-6 py-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("blocks")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "blocks"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Article Content & Blocks</span>
            <Badge className="bg-teal-500/30 text-teal-200 border-0 text-[10px] ml-1">
              {blocks.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "seo"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>SEO Settings & Live Previews</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("publishing")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "publishing"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Publishing, Cover & Metadata</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ================= TAB 1: ARTICLE CONTENT & BLOCKS ================= */}
          {activeTab === "blocks" && (
            <div className="space-y-5">
              {/* Primary Article Headers */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Article Title <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!isEdit && !slug) {
                        setSlug(slugifyText(e.target.value));
                      }
                    }}
                    placeholder="e.g. Complete Guide to Managing Chronic Spinal Pain"
                    required
                    className="border-slate-800 bg-slate-950 text-white font-bold text-sm sm:text-base focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      URL Slug <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-500 font-mono">/blog/</span>
                      <Input
                        value={slug}
                        onChange={(e) => setSlug(slugifyText(e.target.value))}
                        placeholder="article-url-slug"
                        required
                        className="border-slate-800 bg-slate-950 text-xs text-teal-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      Estimated Reading Time
                    </label>
                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-300 font-medium">
                      <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/40 text-xs">
                        {readingTime} min read
                      </Badge>
                      <span className="text-[11px] text-slate-500">
                        (Calculated automatically based on total words in content blocks)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Article Excerpt / Summary
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief 1-2 sentence overview of the article shown in blog card listings..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Block Editor Stream */}
              <BlockEditor blocks={blocks} onChange={setBlocks} mediaList={mediaList} />
            </div>
          )}

          {/* ================= TAB 2: SEO SETTINGS & LIVE PREVIEWS ================= */}
          {activeTab === "seo" && (
            <SEOSettingsPanel
              seo={seo}
              onChange={setSeo}
              blogTitle={title}
              blogSlug={slug || slugifyText(title)}
              blogExcerpt={excerpt}
              blogCoverImage={coverImage}
              category={category}
              mediaList={mediaList}
            />
          )}

          {/* ================= TAB 3: PUBLISHING & METADATA ================= */}
          {activeTab === "publishing" && (
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Cover Image */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
                <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Featured / Cover Image</span>
                  <span className="text-[11px] text-slate-400 font-normal">Recommended 16:9 ratio (1200x630px)</span>
                </label>

                <div className="flex items-center gap-2">
                  <Input
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://... or choose from gallery"
                    className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-mono flex-1"
                  />
                  {mediaList.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) setCoverImage(e.target.value);
                      }}
                      className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200 max-w-[160px]"
                    >
                      <option value="">Media Gallery</option>
                      {mediaList.filter((m) => Boolean(m.url)).map((m, idx) => (
                        <option key={idx} value={m.url!}>
                          {m.title || (m.url ? m.url.split("/").pop() : "Image")}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {coverImage && (
                  <div className="relative aspect-[16/9] max-h-56 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={coverImage} alt={title || "Cover"} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Author & Categories */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Author Name</label>
                    <Input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Dr. Md. Rashedul Alam"
                      className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Author Role / Designation</label>
                    <Input
                      value={authorRole}
                      onChange={(e) => setAuthorRole(e.target.value)}
                      placeholder="Physical Medicine Specialist"
                      className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none font-semibold"
                    >
                      <option value="Physical Medicine">Physical Medicine</option>
                      <option value="Spine & Back Care">Spine & Back Care</option>
                      <option value="Joint & Arthritis">Joint & Arthritis</option>
                      <option value="Rehabilitation">Rehabilitation</option>
                      <option value="Stroke Rehab">Stroke Rehab</option>
                      <option value="Pain Management">Pain Management</option>
                      <option value="Health Tips">Health Tips</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Tags (Comma Separated)</label>
                    <Input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. Back Pain, Physiotherapy, Posture"
                      className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Publish Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                    >
                      <option value="published">Published (Visible to all visitors)</option>
                      <option value="draft">Draft (Hidden from public site)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">Publish Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
