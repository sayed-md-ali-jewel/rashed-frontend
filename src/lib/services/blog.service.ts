import type { BlogBlock, BlogTOCItem, BlogPost, SEOFields } from "@/lib/types";

export function slugifyText(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates clean, unique URL-safe anchor ID for a heading.
 */
export function generateHeadingAnchorId(text: string, existingAnchors?: Set<string>): string {
  const base = slugifyText(text) || "section";
  let candidate = base;
  let counter = 1;

  if (existingAnchors) {
    while (existingAnchors.has(candidate)) {
      candidate = `${base}-${counter}`;
      counter += 1;
    }
    existingAnchors.add(candidate);
  }

  return candidate;
}

/**
 * Extracts a 2-level Table of Contents from blog content blocks.
 * - H2 creates a main top-level Index item (numbered "01", "02", etc.)
 * - H3 creates a nested submenu child under the preceding H2
 * - H1, H4, H5, H6 are excluded from the main index.
 */
export function extractTableOfContents(blocks: BlogBlock[]): BlogTOCItem[] {
  if (!Array.isArray(blocks) || blocks.length === 0) return [];

  const toc: BlogTOCItem[] = [];
  const existingAnchors = new Set<string>();
  let currentH2: BlogTOCItem | null = null;
  let h2Count = 0;

  for (const block of blocks) {
    if (!block || !block.content) continue;

    const headingText = block.content.trim();
    if (!headingText) continue;

    const anchorId = block.anchorId || generateHeadingAnchorId(headingText, existingAnchors);
    existingAnchors.add(anchorId);

    if (block.type === "h2") {
      h2Count += 1;
      const indexNumber = String(h2Count).padStart(2, "0");
      currentH2 = {
        id: anchorId,
        text: headingText,
        level: 2,
        indexNumber,
        children: []
      };
      toc.push(currentH2);
    } else if (block.type === "h3") {
      const h3Item: BlogTOCItem = {
        id: anchorId,
        text: headingText,
        level: 3,
        indexNumber: currentH2 ? `${currentH2.indexNumber}.${(currentH2.children?.length || 0) + 1}` : "•"
      };

      if (currentH2) {
        currentH2.children = currentH2.children || [];
        currentH2.children.push(h3Item);
      } else {
        // If an H3 appears before any H2, add it as a standalone item
        toc.push(h3Item);
      }
    }
  }

  return toc;
}

/**
 * Calculates estimated reading time (in minutes) based on block contents.
 */
export function calculateReadingTime(blocks: BlogBlock[] | string, wpm = 200): number {
  let totalWords = 0;

  if (typeof blocks === "string") {
    const textOnly = blocks.replace(/<[^>]*>/g, " ");
    const words = textOnly.trim().split(/\s+/).filter(Boolean);
    totalWords = words.length;
  } else if (Array.isArray(blocks)) {
    for (const block of blocks) {
      if (!block) continue;
      let text = block.content || "";

      // Add extra structured data text (e.g. FAQs, lists, tables)
      if (block.data) {
        if (Array.isArray(block.data.items)) {
          text += " " + block.data.items.join(" ");
        }
        if (Array.isArray(block.data.faqs)) {
          text += " " + block.data.faqs.map((f: any) => `${f.question} ${f.answer}`).join(" ");
        }
        if (block.data.quote) text += " " + block.data.quote;
        if (block.data.author) text += " " + block.data.author;
        if (block.data.caption) text += " " + block.data.caption;
        if (Array.isArray(block.data.rows)) {
          text += " " + block.data.rows.flat().join(" ");
        }
      }

      const words = text.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean);
      totalWords += words.length;
    }
  }

  return Math.max(1, Math.ceil(totalWords / wpm));
}

/**
 * Converts legacy HTML or markdown string into structured BlogBlocks.
 */
export function convertLegacyContentToBlocks(content?: string): BlogBlock[] {
  if (!content || !content.trim()) {
    return [
      {
        id: "block-" + Math.random().toString(36).slice(2, 9),
        type: "paragraph",
        content: "Write your article content here...",
        order: 0
      }
    ];
  }

  const raw = content.trim();

  // If already JSON stringified blocks
  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
        return parsed;
      }
    } catch {
      // Continue to HTML parsing
    }
  }

  const blocks: BlogBlock[] = [];
  const existingAnchors = new Set<string>();

  // Simple HTML tag matcher for H1-H6, p, blockquote, ul, ol, img
  const tagRegex = /<(h[1-6]|p|blockquote|ul|ol|img)([^>]*)>([\s\S]*?)<\/\1>|<img([^>]*)\/?>/gi;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let order = 0;

  while ((match = tagRegex.exec(raw)) !== null) {
    const tag = (match[1] || "img").toLowerCase();
    const inner = match[3] ? match[3].trim() : "";
    const id = "block-" + Math.random().toString(36).slice(2, 9);

    if (tag.startsWith("h")) {
      const type = tag as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      const anchorId = generateHeadingAnchorId(inner.replace(/<[^>]*>/g, ""), existingAnchors);
      blocks.push({ id, type, content: inner, anchorId, order: order++ });
    } else if (tag === "p" && inner) {
      blocks.push({ id, type: "paragraph", content: inner, order: order++ });
    } else if (tag === "blockquote" && inner) {
      blocks.push({
        id,
        type: "quote",
        content: inner,
        data: { style: "modern", author: "" },
        order: order++
      });
    } else if (tag === "ul" || tag === "ol") {
      const items = (inner.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || []).map((li) =>
        li.replace(/<\/?li[^>]*>/gi, "").trim()
      );
      blocks.push({
        id,
        type: tag === "ol" ? "ordered_list" : "unordered_list",
        content: "",
        data: { items },
        order: order++
      });
    }

    lastIndex = tagRegex.lastIndex;
  }

  if (blocks.length === 0) {
    // Fallback: split paragraphs by double newline
    const paragraphs = raw.split(/\n\n+/).filter(Boolean);
    paragraphs.forEach((p, idx) => {
      blocks.push({
        id: "block-" + Math.random().toString(36).slice(2, 9),
        type: "paragraph",
        content: p.trim(),
        order: idx
      });
    });
  }

  return blocks;
}

/**
 * Generates sensible default SEO fields from blog data.
 */
export function generateDefaultSEO(post: Partial<BlogPost>): SEOFields & { focusKeyword?: string; metaRobots?: string } {
  const title = post.title || "Health Article";
  const excerpt = post.excerpt || "Read medical guidance and articles by Dr. Md. Rashedul Alam.";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rashedulalam.com";
  const postUrl = post.slug ? `${siteUrl}/blog/${post.slug}` : `${siteUrl}/blog`;
  const coverImage = post.coverImage || `${siteUrl}/images/doctor-og.jpg`;

  return {
    seoTitle: `${title} | Dr. Md. Rashedul Alam`,
    metaDescription: excerpt.slice(0, 160),
    focusKeyword: post.category || "Physical Medicine",
    canonicalUrl: postUrl,
    ogTitle: title,
    ogDescription: excerpt,
    ogImage: coverImage,
    twitterTitle: title,
    twitterDescription: excerpt,
    twitterImage: coverImage,
    noIndex: false
  };
}

export class BlogService {
  static slugify = slugifyText;
  static generateHeadingAnchorId = generateHeadingAnchorId;
  static extractTableOfContents = extractTableOfContents;
  static calculateReadingTime = calculateReadingTime;
  static convertLegacyContentToBlocks = convertLegacyContentToBlocks;
  static generateDefaultSEO = generateDefaultSEO;
}
