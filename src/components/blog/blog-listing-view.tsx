"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Filter, Newspaper, RotateCcw, Search, Sparkles } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { BlogCard } from "@/components/blog/blog-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BlogListingViewProps = {
  initialPosts: BlogPost[];
  doctorName?: string;
};

export function BlogListingView({ initialPosts, doctorName = "Dr. Md. Rashedul Alam" }: BlogListingViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach((post) => {
      if (post.category) set.add(post.category);
    });
    return ["all", ...Array.from(set)];
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" ||
        post.category?.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    if (filteredPosts.length === 0) return null;
    return filteredPosts[0];
  }, [filteredPosts]);

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.slice(1);
  }, [filteredPosts, featuredPost]);

  return (
    <div className="space-y-12">
      {/* Search & Category Filter Bar */}
      <div className="rounded-3xl border border-line bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-md space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medical articles, symptoms, treatments..."
              className="pl-11 pr-4 h-12 rounded-2xl bg-panel/70 border-line text-sm focus-visible:ring-blue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-semibold cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Stats indicator */}
          <div className="text-xs font-semibold text-muted flex items-center gap-2 self-end md:self-center">
            <BookOpen className="h-4 w-4 text-blue" />
            <span>
              Showing <strong className="text-ink">{filteredPosts.length}</strong> of {initialPosts.length} articles
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-line/60">
          <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const label = cat === "all" ? "All Topics" : cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-blue text-white shadow-sm shadow-blue/20"
                    : "bg-panel text-muted hover:text-ink hover:bg-slate-200/70"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Content */}
      {filteredPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center space-y-4">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-panel text-muted">
            <Newspaper className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-ink">No articles match your search</h3>
            <p className="text-sm text-muted max-w-md mx-auto">
              We couldn&apos;t find any articles matching &quot;{searchQuery}&quot; in the selected category.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="rounded-xl border-line text-xs font-bold gap-2 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Featured Hero Article */}
          {featuredPost && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-widest mb-4">
                <Sparkles className="h-3.5 w-3.5 text-blue" />
                Featured Highlight
              </div>
              <BlogCard post={featuredPost} featured />
            </div>
          )}

          {/* Regular Article Grid */}
          {gridPosts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-muted uppercase tracking-widest flex items-center gap-2">
                  <Compass className="h-4 w-4 text-blue" />
                  Latest Clinical Articles
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridPosts.map((post) => (
                  <BlogCard key={post.id || post.slug} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consultation Banner at bottom */}
      <div className="rounded-3xl border border-blue/20 bg-gradient-to-br from-blue/10 via-white to-blue/5 p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue">
            🩺 Patient Consultation
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-ink">
            Need Personalized Medical Advice?
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-xl">
            Book an appointment with {doctorName} for comprehensive physical medicine, rehabilitation, and pain management consultations.
          </p>
        </div>
        <Link href="/#schedules" className="shrink-0">
          <Button className="h-12 px-6 rounded-2xl bg-blue hover:bg-blue/90 text-white font-bold text-sm gap-2 shadow-md shadow-blue/20">
            Book Appointment <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
