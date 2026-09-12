"use client";

import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronRight, ListOrdered } from "lucide-react";
import type { BlogTOCItem } from "@/lib/types";

type TableOfContentsProps = {
  toc: BlogTOCItem[];
};

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    if (toc.length === 0) return;

    // Collect all heading IDs (H2 and H3)
    const headingIds: string[] = [];
    toc.forEach((item) => {
      headingIds.push(item.id);
      if (item.children) {
        item.children.forEach((child) => headingIds.push(child.id));
      }
    });

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 140; // Top header offset

      let currentActive = "";
      for (const id of headingIds) {
        const element = document.getElementById(id);
        if (element) {
          const top = element.getBoundingClientRect().top + scrollY;
          if (scrollY >= top - offset) {
            currentActive = id;
          }
        }
      }

      if (currentActive) {
        setActiveId(currentActive);
      } else if (headingIds.length > 0) {
        setActiveId(headingIds[0]);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      setIsMobileOpen(false);
    }
  };

  if (!Array.isArray(toc) || toc.length === 0) {
    return null;
  }

  return (
    <>
      {/* ================= 1. MOBILE COLLAPSIBLE ACCORDION ================= */}
      <div className="lg:hidden mb-8 rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between p-4 text-left font-bold text-ink bg-panel/60 hover:bg-panel transition-colors"
        >
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-blue" />
            <span>Table of Contents (Index)</span>
            <span className="text-xs font-mono text-muted">({toc.length} sections)</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted transition-transform ${isMobileOpen ? "rotate-180" : ""}`} />
        </button>

        {isMobileOpen && (
          <div className="p-4 border-t border-line space-y-2 bg-white max-h-80 overflow-y-auto">
            {toc.map((item) => {
              const isH2Active = activeId === item.id;
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs font-semibold transition-colors ${
                      isH2Active
                        ? "bg-blue/10 text-blue font-bold"
                        : "text-ink hover:bg-panel hover:text-blue"
                    }`}
                  >
                    <span className="font-mono text-[11px] text-blue shrink-0">{item.indexNumber}</span>
                    <span className="leading-snug">{item.text}</span>
                  </button>

                  {item.children && item.children.length > 0 && (
                    <div className="pl-6 space-y-1 border-l border-line ml-3">
                      {item.children.map((sub) => {
                        const isH3Active = activeId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => scrollToHeading(sub.id)}
                            className={`w-full flex items-start gap-2 p-1.5 rounded-lg text-left text-[11px] transition-colors ${
                              isH3Active ? "text-blue font-bold bg-blue/5" : "text-muted hover:text-ink"
                            }`}
                          >
                            <span className="text-muted/70 text-[10px]">•</span>
                            <span className="leading-snug">{sub.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= 2. DESKTOP STICKY SIDEBAR INDEX ================= */}
      <nav aria-label="Table of contents" className="hidden lg:block sticky top-28 space-y-4">
        <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-line pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-panel text-blue border border-line">
                <ListOrdered className="h-4 w-4" />
              </span>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                INDEX
              </h4>
            </div>
            <span className="text-[10px] font-mono text-muted uppercase">
              {toc.length} Sections
            </span>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {toc.map((item) => {
              const isH2Active = activeId === item.id;
              const hasActiveChild = item.children?.some((c) => c.id === activeId);
              const isActiveGroup = isH2Active || hasActiveChild;

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left text-xs transition-all duration-200 group ${
                      isH2Active
                        ? "bg-blue text-white font-bold shadow-sm"
                        : isActiveGroup
                        ? "bg-blue/5 text-blue font-semibold"
                        : "text-ink/80 hover:bg-panel hover:text-ink font-medium"
                    }`}
                  >
                    <span
                      className={`font-mono text-[11px] shrink-0 font-bold ${
                        isH2Active ? "text-white" : "text-blue"
                      }`}
                    >
                      {item.indexNumber}
                    </span>
                    <span className="leading-snug flex-1">{item.text}</span>
                  </button>

                  {/* Nested H3 submenu */}
                  {item.children && item.children.length > 0 && (
                    <div className="pl-6 space-y-1 border-l-2 border-line/60 ml-4 py-1">
                      {item.children.map((sub) => {
                        const isH3Active = activeId === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => scrollToHeading(sub.id)}
                            className={`w-full flex items-start gap-2 py-1 px-2 rounded-lg text-left text-[11px] transition-colors ${
                              isH3Active
                                ? "text-blue font-bold bg-blue/10"
                                : "text-muted hover:text-ink hover:bg-panel/50 font-medium"
                            }`}
                          >
                            <span className="text-muted/60 text-[9px] mt-0.5">•</span>
                            <span className="leading-snug">{sub.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
