"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Info,
  Lightbulb,
  MessageSquareQuote,
  Sparkles,
  Workflow
} from "lucide-react";
import type { BlogBlock } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type BlockRendererProps = {
  blocks: BlogBlock[];
};

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 text-ink">
      {blocks.map((block) => (
        <SingleBlockView key={block.id} block={block} />
      ))}
    </div>
  );
}

function SingleBlockView({ block }: { block: BlogBlock }) {
  const anchorId = block.anchorId || undefined;

  switch (block.type) {
    // 1. HEADINGS H1 - H6
    case "h1":
      return (
        <h1 id={anchorId} className="scroll-mt-28 text-3xl sm:text-4xl font-extrabold text-ink leading-tight pt-4">
          {block.content}
        </h1>
      );

    case "h2":
      return (
        <div id={anchorId} className="scroll-mt-28 pt-8 pb-2 border-b border-line/70">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink flex items-center gap-3 leading-snug group">
            <span className="h-6 w-1.5 rounded-full bg-blue shrink-0" />
            <span>{block.content}</span>
            {anchorId && (
              <a
                href={`#${anchorId}`}
                className="opacity-0 group-hover:opacity-100 text-muted hover:text-blue transition-opacity text-base font-normal"
                aria-label="Link to section"
              >
                #
              </a>
            )}
          </h2>
        </div>
      );

    case "h3":
      return (
        <h3 id={anchorId} className="scroll-mt-28 text-xl sm:text-2xl font-bold text-ink leading-snug pt-5">
          {block.content}
        </h3>
      );

    case "h4":
      return (
        <h4 id={anchorId} className="scroll-mt-28 text-lg font-bold text-ink leading-snug pt-3">
          {block.content}
        </h4>
      );

    case "h5":
      return (
        <h5 id={anchorId} className="scroll-mt-28 text-base font-bold text-ink leading-snug pt-2">
          {block.content}
        </h5>
      );

    case "h6":
      return (
        <h6 id={anchorId} className="scroll-mt-28 text-sm font-bold text-muted uppercase tracking-wider pt-2">
          {block.content}
        </h6>
      );

    // 2. PARAGRAPH
    case "paragraph":
      return (
        <p className="text-[16px] sm:text-[17px] leading-relaxed text-ink/90 font-normal">
          {block.content}
        </p>
      );

    // 3. UNORDERED LIST
    case "unordered_list": {
      const items = block.data?.items || (block.content ? [block.content] : []);
      return (
        <ul className="space-y-2.5 my-4 pl-2">
          {items.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink/90">
              <span className="grid size-5 place-items-center rounded-full bg-blue/10 text-blue shrink-0 mt-0.5 text-xs font-bold">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    // 4. ORDERED LIST
    case "ordered_list": {
      const items = block.data?.items || (block.content ? [block.content] : []);
      return (
        <ol className="space-y-2.5 my-4 pl-2">
          {items.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink/90">
              <span className="grid size-5 place-items-center rounded-full bg-panel text-ink border border-line shrink-0 mt-0.5 text-xs font-mono font-bold">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    }

    // 5. QUOTE / BLOCKQUOTE
    case "quote": {
      const author = block.data?.author;
      const citation = block.data?.citation;
      const style = block.data?.style || "modern";

      return (
        <blockquote className="my-6 rounded-3xl border border-line bg-gradient-to-br from-panel via-white to-sky-50/40 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-4 right-4 text-blue/15 pointer-events-none">
            <MessageSquareQuote className="h-16 w-16" />
          </div>
          <p className="text-lg sm:text-xl font-semibold italic leading-relaxed text-ink relative z-10">
            &ldquo;{block.content}&rdquo;
          </p>
          {(author || citation) && (
            <div className="mt-4 pt-3 border-t border-line flex items-center gap-2 text-sm text-muted">
              {author && <strong className="font-bold text-ink">{author}</strong>}
              {author && citation && <span>&bull;</span>}
              {citation && <span className="text-xs text-muted">{citation}</span>}
            </div>
          )}
        </blockquote>
      );
    }

    // 6. CALLOUT NOTE
    case "note": {
      const variant = block.data?.variant || "tip";
      const title = block.data?.title;

      const variantStyles = {
        tip: {
          border: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
          icon: Lightbulb,
          iconColor: "text-emerald-600",
          badge: "bg-emerald-600 text-white"
        },
        info: {
          border: "border-sky-200 bg-sky-50/70 text-sky-950",
          icon: Info,
          iconColor: "text-sky-600",
          badge: "bg-sky-600 text-white"
        },
        warning: {
          border: "border-amber-200 bg-amber-50/70 text-amber-950",
          icon: AlertTriangle,
          iconColor: "text-amber-600",
          badge: "bg-amber-600 text-white"
        },
        note: {
          border: "border-line bg-panel text-ink",
          icon: BookOpen,
          iconColor: "text-blue",
          badge: "bg-blue text-white"
        }
      }[variant as "tip" | "info" | "warning" | "note"] || {
        border: "border-line bg-panel text-ink",
        icon: Info,
        iconColor: "text-blue",
        badge: "bg-blue text-white"
      };

      const Icon = variantStyles.icon;

      return (
        <div className={`my-6 rounded-2xl border ${variantStyles.border} p-5 sm:p-6 shadow-xs`}>
          <div className="flex items-start gap-3.5">
            <span className="grid size-8 place-items-center rounded-xl bg-white shadow-xs border border-white/80 shrink-0 mt-0.5">
              <Icon className={`h-4 w-4 ${variantStyles.iconColor}`} />
            </span>
            <div className="space-y-1">
              {title && <h5 className="font-bold text-base leading-snug">{title}</h5>}
              <p className="text-sm sm:text-[15px] leading-relaxed opacity-90">{block.content}</p>
            </div>
          </div>
        </div>
      );
    }

    // 7. IMAGE WITH CAPTION
    case "image": {
      const url = block.data?.url || "";
      const caption = block.data?.caption;
      const alt = block.data?.alt || caption || "Article illustration";

      if (!url) return null;

      return (
        <figure className="my-8 space-y-2.5">
          <div className="overflow-hidden rounded-3xl border border-line bg-panel shadow-sm">
            <img
              src={url}
              alt={alt}
              className="w-full object-cover max-h-[500px] transition-transform duration-500 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-xs text-muted font-medium italic pt-1">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // 8. LINK / BUTTON
    case "link": {
      const url = block.data?.url || "#";
      const target = block.data?.target || "_self";
      const style = block.data?.style || "button";

      if (style === "card") {
        return (
          <div className="my-6">
            <Link
              href={url}
              target={target}
              className="flex items-center justify-between p-5 rounded-2xl border border-line bg-white hover:border-blue hover:shadow-md transition-all group"
            >
              <div className="space-y-0.5">
                <span className="text-sm font-bold text-ink group-hover:text-blue transition-colors">
                  {block.content}
                </span>
                <span className="text-xs text-muted font-mono block">{url}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-blue group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        );
      }

      return (
        <div className="my-4">
          <Link href={url} target={target}>
            <Button variant="gold" size="sm" className="gap-2">
              <span>{block.content}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      );
    }

    // 9. CTA BANNER
    case "cta": {
      const badge = block.data?.badge || "Doctor Appointment";
      const title = block.data?.title || "Book a Medical Consultation";
      const description = block.data?.description || "Get expert diagnosis and customized physical rehabilitation plan.";
      const buttonText = block.data?.buttonText || "Book Serial Now";
      const buttonUrl = block.data?.buttonUrl || "/#schedules";

      return (
        <div className="my-10 rounded-3xl border border-blue/20 bg-gradient-to-br from-blue via-[#1e3a8a] to-slate-950 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-white/5 blur-2xl" />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white border border-white/20 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>{badge}</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
              {title}
            </h3>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {description}
            </p>

            <div className="pt-2">
              <Link href={buttonUrl}>
                <Button variant="gold" size="lg" className="rounded-full px-7 font-bold shadow-lg gap-2">
                  <span>{buttonText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // 10. BEFORE / AFTER COMPARISON
    case "before_after": {
      const beforeImg = block.data?.beforeImage;
      const afterImg = block.data?.afterImage;
      const beforeLabel = block.data?.beforeLabel || "Before Treatment";
      const afterLabel = block.data?.afterLabel || "After Treatment";
      const description = block.data?.description;

      return (
        <div className="my-8 rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-line pb-3">
            <Workflow className="h-5 w-5 text-blue" />
            <h4 className="font-bold text-ink text-base">Clinical Case Comparison</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                {beforeLabel}
              </span>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-line">
                {beforeImg ? (
                  <img src={beforeImg} alt={beforeLabel} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted">No image</div>
                )}
              </div>
            </div>

            {/* After */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                {afterLabel}
              </span>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-line">
                {afterImg ? (
                  <img src={afterImg} alt={afterLabel} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted">No image</div>
                )}
              </div>
            </div>
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-muted leading-relaxed italic pt-2">
              {description}
            </p>
          )}
        </div>
      );
    }

    // 11. FAQ ACCORDION
    case "faq": {
      const faqs: Array<{ question: string; answer: string }> = block.data?.faqs || [];
      return <FAQBlockView faqs={faqs} />;
    }

    // 12. DATA TABLE
    case "table": {
      const headers: string[] = block.data?.headers || [];
      const rows: string[][] = block.data?.rows || [];

      return (
        <div className="my-8 overflow-hidden rounded-2xl border border-line bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-panel border-b border-line text-ink font-bold text-xs uppercase tracking-wider">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-5 py-3.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white" : "bg-panel/40"}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-5 py-3.5 text-ink/90 font-medium text-xs sm:text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // 13. DIVIDER
    case "divider":
      return (
        <div className="py-6">
          <hr className="border-line" />
        </div>
      );

    // 14. CUSTOM SPACING
    case "custom_spacing": {
      const h = block.data?.height || 32;
      return <div style={{ height: h }} aria-hidden="true" />;
    }

    default:
      return null;
  }
}

function FAQBlockView({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (!Array.isArray(faqs) || faqs.length === 0) return null;

  return (
    <div className="my-8 rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <HelpCircle className="h-5 w-5 text-blue" />
        <h4 className="font-bold text-ink text-base">Frequently Asked Questions</h4>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);
          return (
            <div key={idx} className="rounded-2xl border border-line overflow-hidden transition-colors">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-sm sm:text-base text-ink bg-panel/40 hover:bg-panel transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`h-4 w-4 text-muted transition-transform shrink-0 ml-2 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="p-4 bg-white border-t border-line text-xs sm:text-sm text-muted leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
