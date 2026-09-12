"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  FileText,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Link as LinkIcon,
  List,
  ListOrdered,
  Maximize2,
  MessageSquareQuote,
  Minus,
  MoveDown,
  MoveUp,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Table as TableIcon,
  Trash2,
  Upload,
  Workflow
} from "lucide-react";
import type { BlogBlock, BlogBlockType } from "@/lib/types";
import { generateHeadingAnchorId, extractTableOfContents, slugifyText } from "@/lib/services/blog.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type BlockEditorProps = {
  blocks: BlogBlock[];
  onChange: (blocks: BlogBlock[]) => void;
  mediaList?: Array<{ url?: string; title?: string; [key: string]: any }>;
};

const BLOCK_DEFINITIONS: Array<{
  type: BlogBlockType;
  label: string;
  icon: any;
  category: "Headings" | "Text" | "Media & Layout" | "Callouts & Quotes" | "Interactive";
  description: string;
}> = [
  { type: "h1", label: "Heading 1", icon: Heading1, category: "Headings", description: "Top level section header" },
  { type: "h2", label: "Heading 2 (TOC Index)", icon: Heading2, category: "Headings", description: "Main index section heading" },
  { type: "h3", label: "Heading 3 (TOC Sub)", icon: Heading3, category: "Headings", description: "Sub-section under H2 in TOC" },
  { type: "h4", label: "Heading 4", icon: Heading4, category: "Headings", description: "Minor sub-heading" },
  { type: "h5", label: "Heading 5", icon: Heading5, category: "Headings", description: "Small section label" },
  { type: "h6", label: "Heading 6", icon: Heading6, category: "Headings", description: "Fine detail heading" },
  { type: "paragraph", label: "Paragraph", icon: FileText, category: "Text", description: "Standard editorial body text" },
  { type: "unordered_list", label: "Bullet List", icon: List, category: "Text", description: "Bullet-pointed item list" },
  { type: "ordered_list", label: "Numbered List", icon: ListOrdered, category: "Text", description: "Sequenced step-by-step list" },
  { type: "quote", label: "Quote / Blockquote", icon: MessageSquareQuote, category: "Callouts & Quotes", description: "Highlighted medical or patient quote" },
  { type: "note", label: "Callout / Note Box", icon: BookOpen, category: "Callouts & Quotes", description: "Important tip, warning, or advice alert" },
  { type: "image", label: "Image with Caption", icon: ImageIcon, category: "Media & Layout", description: "High-resolution image with caption" },
  { type: "link", label: "Link / Action Button", icon: LinkIcon, category: "Interactive", description: "External resource or appointment link" },
  { type: "divider", label: "Divider Line", icon: Minus, category: "Media & Layout", description: "Visual horizontal break" },
  { type: "cta", label: "CTA Banner", icon: Sparkles, category: "Interactive", description: "Appointment booking call-to-action" },
  { type: "before_after", label: "Before / After", icon: Workflow, category: "Interactive", description: "Clinical visual comparison card" },
  { type: "faq", label: "FAQ Accordion", icon: HelpCircle, category: "Interactive", description: "Expandable questions and answers" },
  { type: "table", label: "Data Table", icon: TableIcon, category: "Interactive", description: "Structured columns and rows table" },
  { type: "custom_spacing", label: "Custom Spacing", icon: LayoutTemplate, category: "Media & Layout", description: "Adjustable vertical spacing" }
];

export function BlockEditor({ blocks, onChange, mediaList = [] }: BlockEditorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showTOCPreview, setShowTOCPreview] = useState<boolean>(true);
  const [selectedMediaTargetIndex, setSelectedMediaTargetIndex] = useState<number | null>(null);

  // Live Table of Contents generated from H2 + H3 blocks
  const liveTOC = useMemo(() => extractTableOfContents(blocks), [blocks]);

  const addBlock = (type: BlogBlockType, insertIndex?: number) => {
    const newId = "block-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    let initialContent = "";
    let initialData: Record<string, any> = {};

    switch (type) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        initialContent = type === "h2" ? "New Section Title" : "New Subheading";
        break;
      case "paragraph":
        initialContent = "Write clear and informative medical content here...";
        break;
      case "unordered_list":
      case "ordered_list":
        initialData = { items: ["First clinical point", "Second clinical point", "Third clinical point"] };
        break;
      case "quote":
        initialContent = "Physical therapy and early intervention are crucial for long-term spinal health.";
        initialData = { author: "Dr. Md. Rashedul Alam", citation: "Specialist Advice", style: "modern" };
        break;
      case "note":
        initialContent = "Always consult with a medical professional before starting any intensive rehabilitation exercise.";
        initialData = { title: "Doctor's Recommendation", variant: "tip" };
        break;
      case "image":
        initialData = { url: "", caption: "Clinical illustration of spinal alignment", alt: "Medical Diagram", align: "center" };
        break;
      case "link":
        initialContent = "Book Consultation Serial";
        initialData = { url: "/#schedules", target: "_self", style: "button" };
        break;
      case "cta":
        initialData = {
          badge: "Personalized Care",
          title: "Suffering from Chronic Back or Joint Pain?",
          description: "Schedule a comprehensive clinical assessment with Dr. Md. Rashedul Alam today.",
          buttonText: "Book Appointment Now",
          buttonUrl: "/#schedules",
          theme: "teal"
        };
        break;
      case "before_after":
        initialData = {
          beforeImage: "",
          beforeLabel: "Before Treatment",
          afterImage: "",
          afterLabel: "After 4 Weeks of Rehab",
          description: "Patient posture alignment improvement following tailored physical medicine protocol."
        };
        break;
      case "faq":
        initialData = {
          faqs: [
            { question: "How long does physical rehabilitation take?", answer: "Treatment duration varies depending on the severity of the injury or condition, typically ranging between 4 to 8 weeks." },
            { question: "Is surgery always required for back pain?", answer: "In over 90% of cases, non-invasive physical medicine and targeted exercises successfully resolve symptoms without surgery." }
          ]
        };
        break;
      case "table":
        initialData = {
          headers: ["Condition", "Recommended Therapy", "Expected Recovery"],
          rows: [
            ["Cervical Spondylosis", "Targeted traction & posture exercises", "3-6 Weeks"],
            ["Lumbar Disc Herniation", "Core stabilization & spinal decompression", "6-8 Weeks"],
            ["Osteoarthritis Knee", "Low-impact quad strengthening & PRP", "Ongoing Management"]
          ]
        };
        break;
      case "custom_spacing":
        initialData = { height: 32 };
        break;
      default:
        break;
    }

    const newBlock: BlogBlock = {
      id: newId,
      type,
      content: initialContent,
      anchorId: type.startsWith("h") ? generateHeadingAnchorId(initialContent) : undefined,
      data: initialData,
      order: blocks.length
    };

    if (typeof insertIndex === "number") {
      const next = [...blocks];
      next.splice(insertIndex + 1, 0, newBlock);
      onChange(next);
    } else {
      onChange([...blocks, newBlock]);
    }
  };

  const updateBlock = (index: number, updates: Partial<BlogBlock>) => {
    const next = [...blocks];
    const target = { ...next[index], ...updates };

    // Auto update anchorId when heading content changes if not manually overridden
    if (target.type.startsWith("h") && updates.content && !updates.anchorId) {
      target.anchorId = generateHeadingAnchorId(updates.content);
    }

    next[index] = target;
    onChange(next);
  };

  const updateBlockData = (index: number, key: string, value: any) => {
    const next = [...blocks];
    const currentData = next[index].data || {};
    next[index] = {
      ...next[index],
      data: { ...currentData, [key]: value }
    };
    onChange(next);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const next = [...blocks];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  };

  const duplicateBlock = (index: number) => {
    const target = blocks[index];
    const copy: BlogBlock = {
      ...JSON.parse(JSON.stringify(target)),
      id: "block-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6)
    };
    const next = [...blocks];
    next.splice(index + 1, 0, copy);
    onChange(next);
  };

  const deleteBlock = (index: number) => {
    if (blocks.length <= 1) {
      // Keep at least one paragraph
      onChange([{ id: "block-init", type: "paragraph", content: "", order: 0 }]);
      return;
    }
    const next = blocks.filter((_, i) => i !== index);
    onChange(next);
  };

  const filteredDefinitions = useMemo(() => {
    if (activeCategory === "all") return BLOCK_DEFINITIONS;
    return BLOCK_DEFINITIONS.filter((d) => d.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      {/* Editor Top Bar: Quick Add Block Toolbar & TOC Toggle */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-teal-400" />
              <span>Add Content Block</span>
            </span>
            <span className="text-[11px] text-slate-400">({blocks.length} blocks total)</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTOCPreview(!showTOCPreview)}
              className={`h-7 px-2.5 text-[11px] rounded-lg border gap-1.5 ${
                showTOCPreview ? "border-teal-500/50 bg-teal-500/10 text-teal-300" : "border-slate-800 text-slate-400"
              }`}
            >
              <BookOpen className="h-3 w-3" />
              <span>{showTOCPreview ? "Hide Live TOC (Index)" : "Show Live TOC"}</span>
              <Badge className="bg-teal-500/20 text-teal-300 border-0 text-[10px] px-1 py-0 ml-1">
                {liveTOC.length} H2s
              </Badge>
            </Button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-1 border-b border-slate-800 pb-2">
          {["all", "Headings", "Text", "Callouts & Quotes", "Media & Layout", "Interactive"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-[11px] rounded-md font-medium transition-all ${
                activeCategory === cat ? "bg-teal-600 text-white font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {cat === "all" ? "All Blocks" : cat}
            </button>
          ))}
        </div>

        {/* Blocks Palette Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-1.5 pt-1">
          {filteredDefinitions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => addBlock(item.type)}
                className="group flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800/80 bg-slate-950/80 hover:border-teal-500/50 hover:bg-teal-950/30 text-slate-300 hover:text-white transition-all text-center"
              >
                <Icon className="h-4 w-4 mb-1 text-slate-400 group-hover:text-teal-400 transition-colors" />
                <span className="text-[10px] font-semibold truncate w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout: Content Blocks List + Sticky TOC Preview Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
        {/* Left: Active Block Stream */}
        <div className="space-y-4">
          {blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center space-y-3">
              <FileText className="mx-auto h-10 w-10 text-slate-600" />
              <p className="text-xs text-slate-400">Your article is currently empty. Add your first heading or paragraph above.</p>
              <Button type="button" size="sm" onClick={() => addBlock("h2")} className="bg-teal-600 hover:bg-teal-500 text-white text-xs">
                Add Section Heading (H2)
              </Button>
            </div>
          ) : (
            blocks.map((block, index) => (
              <div
                key={block.id}
                className={`relative rounded-2xl border transition-all ${
                  block.type === "h2"
                    ? "border-teal-500/40 bg-slate-900/90 shadow-md shadow-teal-950/30"
                    : block.type === "h3"
                    ? "border-emerald-500/30 bg-slate-900/80"
                    : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                } p-4 space-y-3`}
              >
                {/* Block Header & Action Toolbar */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 place-items-center rounded-full bg-slate-800 text-[10px] font-mono text-slate-400">
                      {index + 1}
                    </span>
                    <Badge
                      className={`text-[10px] font-bold ${
                        block.type === "h2"
                          ? "bg-teal-500/20 text-teal-300 border-teal-500/40"
                          : block.type === "h3"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      {block.type.toUpperCase()}
                      {block.type === "h2" && " (Index Heading)"}
                      {block.type === "h3" && " (Nested Submenu)"}
                    </Badge>

                    {block.anchorId && (
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <span>#</span>
                        <input
                          type="text"
                          value={block.anchorId}
                          onChange={(e) => updateBlock(index, { anchorId: slugifyText(e.target.value) })}
                          title="Click to customize Anchor ID for TOC"
                          className="bg-transparent border-b border-dotted border-slate-600 focus:border-teal-400 focus:outline-none text-[10px] text-teal-300 w-32"
                        />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveBlock(index, "up")}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === blocks.length - 1}
                      onClick={() => moveBlock(index, "down")}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateBlock(index)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      title="Duplicate Block"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBlock(index)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      title="Delete Block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Block Content Inputs based on Block Type */}

                {/* 1. HEADINGS (H1-H6) */}
                {block.type.startsWith("h") && (
                  <div className="space-y-1.5">
                    <Input
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      placeholder={`Enter ${block.type.toUpperCase()} heading text...`}
                      className={`border-slate-800 bg-slate-950 text-white font-bold ${
                        block.type === "h1" ? "text-base" : block.type === "h2" ? "text-sm text-teal-300" : "text-xs text-emerald-300"
                      }`}
                    />
                    {block.type === "h2" && (
                      <p className="text-[10px] text-teal-400/80">
                        ✓ This H2 heading will automatically appear in the frontend Table of Contents (Index).
                      </p>
                    )}
                    {block.type === "h3" && (
                      <p className="text-[10px] text-emerald-400/80">
                        ✓ This H3 heading will automatically nest under the nearest preceding H2 in the Index.
                      </p>
                    )}
                  </div>
                )}

                {/* 2. PARAGRAPH */}
                {block.type === "paragraph" && (
                  <div>
                    <textarea
                      rows={3}
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      placeholder="Write your paragraph here. Supports clean formatting..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-teal-500 focus:outline-none leading-relaxed"
                    />
                  </div>
                )}

                {/* 3. LISTS (ORDERED & UNORDERED) */}
                {(block.type === "unordered_list" || block.type === "ordered_list") && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>List Items ({block.type === "ordered_list" ? "Numbered 1, 2, 3" : "Bullet Points"})</span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentItems = block.data?.items || [];
                          updateBlockData(index, "items", [...currentItems, "New list item"]);
                        }}
                        className="text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="h-3 w-3" /> Add Item
                      </button>
                    </div>

                    {(block.data?.items || []).map((item: string, itemIdx: number) => (
                      <div key={itemIdx} className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500 w-5 text-right">
                          {block.type === "ordered_list" ? `${itemIdx + 1}.` : "•"}
                        </span>
                        <Input
                          value={item}
                          onChange={(e) => {
                            const nextItems = [...(block.data?.items || [])];
                            nextItems[itemIdx] = e.target.value;
                            updateBlockData(index, "items", nextItems);
                          }}
                          className="border-slate-800 bg-slate-950 text-xs text-slate-200 flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextItems = (block.data?.items || []).filter((_: any, i: number) => i !== itemIdx);
                            updateBlockData(index, "items", nextItems);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. QUOTE / BLOCKQUOTE */}
                {block.type === "quote" && (
                  <div className="space-y-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <textarea
                      rows={2}
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      placeholder="Quote content / patient statement..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 italic focus:border-teal-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        value={block.data?.author || ""}
                        onChange={(e) => updateBlockData(index, "author", e.target.value)}
                        placeholder="Author / Attribution (e.g. Dr. Rashedul Alam)"
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                      />
                      <Input
                        value={block.data?.citation || ""}
                        onChange={(e) => updateBlockData(index, "citation", e.target.value)}
                        placeholder="Citation / Title (e.g. Spine Health Journal)"
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                      />
                      <select
                        value={block.data?.style || "modern"}
                        onChange={(e) => updateBlockData(index, "style", e.target.value)}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                      >
                        <option value="modern">Modern Glass Quote</option>
                        <option value="card">Card Box Quote</option>
                        <option value="border">Left Border Elegant</option>
                        <option value="minimal">Minimal Italic</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 5. CALLOUT NOTE */}
                {block.type === "note" && (
                  <div className="space-y-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={block.data?.title || ""}
                        onChange={(e) => updateBlockData(index, "title", e.target.value)}
                        placeholder="Note Title (e.g. Doctor's Advice / Caution)"
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-bold"
                      />
                      <select
                        value={block.data?.variant || "tip"}
                        onChange={(e) => updateBlockData(index, "variant", e.target.value)}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                      >
                        <option value="tip">💡 Tip / Recommendation (Emerald)</option>
                        <option value="info">ℹ️ Information (Sky Blue)</option>
                        <option value="warning">⚠️ Warning / Precaution (Amber)</option>
                        <option value="note">📝 Clinical Note (Slate)</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      placeholder="Note message..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                )}

                {/* 6. IMAGE WITH CAPTION */}
                {block.type === "image" && (
                  <div className="space-y-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={block.data?.url || ""}
                        onChange={(e) => updateBlockData(index, "url", e.target.value)}
                        placeholder="Image URL or select from media gallery..."
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200 flex-1 font-mono"
                      />
                      {mediaList.length > 0 && (
                        <select
                          onChange={(e) => {
                            if (e.target.value) updateBlockData(index, "url", e.target.value);
                          }}
                          className="rounded-xl border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs text-slate-300 max-w-[140px]"
                        >
                          <option value="">Choose Media</option>
                          {mediaList.filter((m) => Boolean(m.url)).map((m, i) => (
                            <option key={i} value={m.url!}>
                              {m.title || (m.url ? m.url.split("/").pop() : "Image")}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={block.data?.caption || ""}
                        onChange={(e) => updateBlockData(index, "caption", e.target.value)}
                        placeholder="Caption text displayed below image..."
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                      />
                      <Input
                        value={block.data?.alt || ""}
                        onChange={(e) => updateBlockData(index, "alt", e.target.value)}
                        placeholder="SEO Alt text for image..."
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                      />
                    </div>

                    {block.data?.url && (
                      <div className="relative aspect-[16/9] max-h-40 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                        <img src={block.data.url} alt={block.data.alt || "Preview"} className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* 7. LINK / BUTTON */}
                {block.type === "link" && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Input
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      placeholder="Button / Link Label"
                      className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-bold"
                    />
                    <Input
                      value={block.data?.url || ""}
                      onChange={(e) => updateBlockData(index, "url", e.target.value)}
                      placeholder="Destination URL (e.g. /#schedules)"
                      className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-mono"
                    />
                    <select
                      value={block.data?.style || "button"}
                      onChange={(e) => updateBlockData(index, "style", e.target.value)}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-200"
                    >
                      <option value="button">Gold CTA Button</option>
                      <option value="card">Linked Banner Card</option>
                      <option value="inline">Inline Text Link</option>
                    </select>
                  </div>
                )}

                {/* 8. CTA BANNER */}
                {block.type === "cta" && (
                  <div className="space-y-2 rounded-xl border border-teal-500/30 bg-teal-950/20 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={block.data?.badge || "Book Appointment"}
                        onChange={(e) => updateBlockData(index, "badge", e.target.value)}
                        placeholder="Badge Label (e.g. Spine Health)"
                        className="border-slate-800 bg-slate-950 text-xs text-teal-300"
                      />
                      <Input
                        value={block.data?.title || ""}
                        onChange={(e) => updateBlockData(index, "title", e.target.value)}
                        placeholder="CTA Headline Title"
                        className="border-slate-800 bg-slate-950 text-xs text-white font-bold"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={block.data?.description || ""}
                      onChange={(e) => updateBlockData(index, "description", e.target.value)}
                      placeholder="CTA supporting description..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={block.data?.buttonText || "Book Serial"}
                        onChange={(e) => updateBlockData(index, "buttonText", e.target.value)}
                        placeholder="Button Text"
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-semibold"
                      />
                      <Input
                        value={block.data?.buttonUrl || "/#schedules"}
                        onChange={(e) => updateBlockData(index, "buttonUrl", e.target.value)}
                        placeholder="Button URL (e.g. /#schedules)"
                        className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* 9. BEFORE / AFTER COMPARISON */}
                {block.type === "before_after" && (
                  <div className="space-y-2.5 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Input
                          value={block.data?.beforeLabel || "Before Treatment"}
                          onChange={(e) => updateBlockData(index, "beforeLabel", e.target.value)}
                          placeholder="Before Label"
                          className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                        />
                        <Input
                          value={block.data?.beforeImage || ""}
                          onChange={(e) => updateBlockData(index, "beforeImage", e.target.value)}
                          placeholder="Before Image URL"
                          className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Input
                          value={block.data?.afterLabel || "After Treatment"}
                          onChange={(e) => updateBlockData(index, "afterLabel", e.target.value)}
                          placeholder="After Label"
                          className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                        />
                        <Input
                          value={block.data?.afterImage || ""}
                          onChange={(e) => updateBlockData(index, "afterImage", e.target.value)}
                          placeholder="After Image URL"
                          className="border-slate-800 bg-slate-950 text-xs text-slate-200 font-mono"
                        />
                      </div>
                    </div>
                    <Input
                      value={block.data?.description || ""}
                      onChange={(e) => updateBlockData(index, "description", e.target.value)}
                      placeholder="Clinical description of before & after results..."
                      className="border-slate-800 bg-slate-950 text-xs text-slate-200"
                    />
                  </div>
                )}

                {/* 10. FAQ ACCORDION */}
                {block.type === "faq" && (
                  <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Frequently Asked Questions ({block.data?.faqs?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() => {
                          const faqs = block.data?.faqs || [];
                          updateBlockData(index, "faqs", [...faqs, { question: "New Question?", answer: "Clear answer here..." }]);
                        }}
                        className="text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="h-3 w-3" /> Add FAQ
                      </button>
                    </div>

                    {(block.data?.faqs || []).map((faq: any, fIdx: number) => (
                      <div key={fIdx} className="space-y-1.5 rounded-lg border border-slate-800/80 bg-slate-900/50 p-2.5">
                        <div className="flex items-center gap-2">
                          <Input
                            value={faq.question}
                            onChange={(e) => {
                              const faqs = [...(block.data?.faqs || [])];
                              faqs[fIdx] = { ...faqs[fIdx], question: e.target.value };
                              updateBlockData(index, "faqs", faqs);
                            }}
                            placeholder="Question"
                            className="border-slate-800 bg-slate-950 text-xs text-white font-bold flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const faqs = (block.data?.faqs || []).filter((_: any, i: number) => i !== fIdx);
                              updateBlockData(index, "faqs", faqs);
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => {
                            const faqs = [...(block.data?.faqs || [])];
                            faqs[fIdx] = { ...faqs[fIdx], answer: e.target.value };
                            updateBlockData(index, "faqs", faqs);
                          }}
                          placeholder="Answer explanation..."
                          className="w-full rounded-md border border-slate-800 bg-slate-950 p-2 text-xs text-slate-200"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 11. DATA TABLE */}
                {block.type === "table" && (
                  <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Table Headers & Rows</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const currentHeaders = block.data?.headers || ["Col 1", "Col 2"];
                            const currentRows = block.data?.rows || [["", ""]];
                            updateBlockData(index, "headers", [...currentHeaders, `Col ${currentHeaders.length + 1}`]);
                            updateBlockData(
                              index,
                              "rows",
                              currentRows.map((r: string[]) => [...r, ""])
                            );
                          }}
                          className="text-teal-400 hover:underline text-[10px] font-semibold"
                        >
                          + Column
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const currentHeaders = block.data?.headers || ["Col 1", "Col 2"];
                            const currentRows = block.data?.rows || [];
                            updateBlockData(index, "rows", [...currentRows, new Array(currentHeaders.length).fill("")]);
                          }}
                          className="text-teal-400 hover:underline text-[10px] font-semibold"
                        >
                          + Row
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            {(block.data?.headers || []).map((h: string, hIdx: number) => (
                              <th key={hIdx} className="p-1">
                                <Input
                                  value={h}
                                  onChange={(e) => {
                                    const nextH = [...(block.data?.headers || [])];
                                    nextH[hIdx] = e.target.value;
                                    updateBlockData(index, "headers", nextH);
                                  }}
                                  className="border-slate-800 bg-slate-900 text-xs font-bold text-teal-300 h-8"
                                />
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(block.data?.rows || []).map((row: string[], rIdx: number) => (
                            <tr key={rIdx}>
                              {row.map((cell: string, cIdx: number) => (
                                <td key={cIdx} className="p-1">
                                  <Input
                                    value={cell}
                                    onChange={(e) => {
                                      const nextR = [...(block.data?.rows || [])];
                                      nextR[rIdx] = [...nextR[rIdx]];
                                      nextR[rIdx][cIdx] = e.target.value;
                                      updateBlockData(index, "rows", nextR);
                                    }}
                                    className="border-slate-800 bg-slate-950 text-xs text-slate-200 h-8"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 12. DIVIDER */}
                {block.type === "divider" && (
                  <div className="py-2">
                    <hr className="border-slate-800" />
                    <span className="block text-[10px] text-slate-500 text-center mt-1">Horizontal Rule Divider</span>
                  </div>
                )}

                {/* 13. CUSTOM SPACING */}
                {block.type === "custom_spacing" && (
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-xs text-slate-400">Vertical Space:</span>
                    <input
                      type="range"
                      min={16}
                      max={96}
                      step={8}
                      value={block.data?.height || 32}
                      onChange={(e) => updateBlockData(index, "height", Number(e.target.value))}
                      className="flex-1 accent-teal-500"
                    />
                    <span className="text-xs font-mono text-teal-300 font-bold w-12 text-right">
                      {block.data?.height || 32}px
                    </span>
                  </div>
                )}

                {/* Quick Add block below button */}
                <div className="pt-1 flex justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => addBlock("paragraph", index)}
                    className="inline-flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-teal-600 text-slate-300 hover:text-white px-2.5 py-0.5 rounded-full shadow transition-all"
                  >
                    <Plus className="h-3 w-3" /> Insert Block Below
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Live Table of Contents (Index) Preview Panel */}
        {showTOCPreview && (
          <div className="sticky top-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-teal-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Live Article Index</h4>
              </div>
              <Badge className="bg-teal-500/15 text-teal-300 border-teal-500/30 text-[10px]">
                {liveTOC.length} Items
              </Badge>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every <strong>H2</strong> automatically generates an index entry. <strong>H3</strong> headings nest underneath.
            </p>

            {liveTOC.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950 p-4 text-center">
                <p className="text-[11px] text-slate-500 italic">
                  No H2 headings found yet. Add an H2 block to start building the table of contents.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {liveTOC.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                      <span className="font-mono font-bold text-teal-400 text-[11px] shrink-0">
                        {item.indexNumber}
                      </span>
                      <span className="text-slate-200 font-semibold truncate flex-1">{item.text}</span>
                    </div>

                    {item.children && item.children.length > 0 && (
                      <div className="pl-5 space-y-1 border-l-2 border-slate-800 ml-2.5">
                        {item.children.map((sub) => (
                          <div key={sub.id} className="flex items-center gap-1.5 text-[11px] text-slate-400 py-0.5">
                            <span className="text-emerald-400 font-mono text-[10px]">{sub.indexNumber}</span>
                            <span className="truncate">{sub.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
