import {
  extractTableOfContents,
  generateHeadingAnchorId,
  calculateReadingTime,
  convertLegacyContentToBlocks,
  generateDefaultSEO,
  slugifyText
} from "../blog.service";
import type { BlogBlock } from "@/lib/types";

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("▶ Running Blog Engine Unit Tests...\n");

// Test 1: Slugify
console.log("Test 1: slugifyText");
assert(slugifyText("Hello World & Special-Characters!") === "hello-world-special-characters", "slugify basic failed");
assert(slugifyText("   Multiple   Spaces   ") === "multiple-spaces", "slugify spaces failed");
console.log("  ✓ slugifyText passed");

// Test 2: Anchor ID Generation & Collision Handling
console.log("\nTest 2: generateHeadingAnchorId");
const anchors = new Set<string>();
const id1 = generateHeadingAnchorId("Clinical Assessment", anchors);
const id2 = generateHeadingAnchorId("Clinical Assessment", anchors);
const id3 = generateHeadingAnchorId("Clinical Assessment", anchors);
assert(id1 === "clinical-assessment", "First anchor failed");
assert(id2 === "clinical-assessment-1", "Duplicate anchor 1 failed");
assert(id3 === "clinical-assessment-2", "Duplicate anchor 2 failed");
console.log("  ✓ generateHeadingAnchorId unique collision resolution passed");

// Test 3: Table of Contents Extraction
console.log("\nTest 3: extractTableOfContents (H2, H3 numbering & hierarchy)");
const sampleBlocks: BlogBlock[] = [
  { id: "1", type: "h1", content: "Main Article Title (Excluded)", order: 0 },
  { id: "2", type: "paragraph", content: "Introductory paragraph", order: 1 },
  { id: "3", type: "h2", content: "First Section", order: 2 },
  { id: "4", type: "h3", content: "Subsection A", order: 3 },
  { id: "5", type: "h3", content: "Subsection B", order: 4 },
  { id: "6", type: "h4", content: "Minor Subsection (Excluded)", order: 5 },
  { id: "7", type: "h2", content: "Second Section", order: 6 },
  { id: "8", type: "h3", content: "Subsection C", order: 7 },
  { id: "9", type: "h5", content: "Deep Heading (Excluded)", order: 8 },
  { id: "10", type: "h6", content: "Deep Heading 6 (Excluded)", order: 9 }
];

const toc = extractTableOfContents(sampleBlocks);
assert(toc.length === 2, `Expected 2 top-level H2 items, got ${toc.length}`);
assert(toc[0].indexNumber === "01", `Expected 01 for first H2, got ${toc[0].indexNumber}`);
assert(toc[0].text === "First Section", "First H2 text mismatch");
assert(toc[0].children?.length === 2, `Expected 2 H3 children in first H2, got ${toc[0].children?.length}`);
assert(toc[0].children![0].indexNumber === "01.1", `Expected 01.1, got ${toc[0].children![0].indexNumber}`);
assert(toc[0].children![1].indexNumber === "01.2", `Expected 01.2, got ${toc[0].children![1].indexNumber}`);
assert(toc[1].indexNumber === "02", `Expected 02 for second H2, got ${toc[1].indexNumber}`);
assert(toc[1].children?.length === 1, `Expected 1 H3 child in second H2, got ${toc[1].children?.length}`);
assert(toc[1].children![0].indexNumber === "02.1", `Expected 02.1, got ${toc[1].children![0].indexNumber}`);
console.log("  ✓ Table of contents hierarchy and index numbering (01, 01.1, 02, etc.) passed");

// Test 4: Reading Time Calculation
console.log("\nTest 4: calculateReadingTime");
const shortBlocks: BlogBlock[] = [
  { id: "1", type: "paragraph", content: "Short sentence with five words.", order: 0 }
];
assert(calculateReadingTime(shortBlocks) === 1, "Reading time for short block should be minimum 1 min");

const longText = Array(450).fill("medical").join(" ");
const longBlocks: BlogBlock[] = [
  { id: "1", type: "paragraph", content: longText, order: 0 }
];
assert(calculateReadingTime(longBlocks, 200) === 3, "450 words at 200 wpm should equal 3 minutes");
console.log("  ✓ calculateReadingTime passed");

// Test 5: Legacy Content Converter
console.log("\nTest 5: convertLegacyContentToBlocks");
const legacyHtml = `<h2>First Section</h2><p>This is paragraph one.</p><blockquote>A notable doctor quote.</blockquote><ul><li>Item 1</li><li>Item 2</li></ul>`;
const converted = convertLegacyContentToBlocks(legacyHtml);
assert(converted.length === 4, `Expected 4 converted blocks, got ${converted.length}`);
assert(converted[0].type === "h2", `Block 0 should be h2, got ${converted[0].type}`);
assert(converted[1].type === "paragraph", `Block 1 should be paragraph, got ${converted[1].type}`);
assert(converted[2].type === "quote", `Block 2 should be quote, got ${converted[2].type}`);
assert(converted[3].type === "unordered_list", `Block 3 should be unordered_list, got ${converted[3].type}`);
assert(Array.isArray(converted[3].data?.items) && converted[3].data?.items.length === 2, "List items length mismatch");
console.log("  ✓ convertLegacyContentToBlocks passed");

// Test 6: Default SEO Generation
console.log("\nTest 6: generateDefaultSEO");
const defaultSeo = generateDefaultSEO({
  title: "Spine Care Protocol",
  excerpt: "Short summary of spine care protocol.",
  slug: "spine-care-protocol",
  category: "Spine & Pain"
});
assert(defaultSeo.seoTitle.includes("Spine Care Protocol"), "SEO title mismatch");
assert(Boolean(defaultSeo.canonicalUrl?.includes("/blog/spine-care-protocol")), "Canonical URL mismatch");
assert(defaultSeo.focusKeyword === "Spine & Pain", "Focus keyword mismatch");
console.log("  ✓ generateDefaultSEO passed");

console.log("\n All 6 Blog Engine unit tests completed successfully!");
