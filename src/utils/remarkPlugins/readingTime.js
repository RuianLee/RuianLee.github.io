import { toString } from "mdast-util-to-string";

/** Matches CJK ideographs, which reading-time tools count per-character rather than per-word. */
const CJK_REGEX = /[㐀-鿿豈-﫿]/g;

/** Approximate combined reading speed: CJK characters + Latin words per minute. */
const UNITS_PER_MINUTE = 400;

/**
 * Remark plugin that estimates reading time from the post body and exposes it
 * as `minutesRead` on `remarkPluginFrontmatter` (see `render()` in Astro).
 */
export function remarkReadingTime() {
  return (tree, file) => {
    const contentNodes = tree.children.filter(node => node.type !== "yaml");
    const text = toString({ ...tree, children: contentNodes });

    const cjkChars = text.match(CJK_REGEX) ?? [];
    const nonCjkText = text.replace(CJK_REGEX, " ");
    const words = nonCjkText.trim().split(/\s+/).filter(Boolean);
    const unitCount = cjkChars.length + words.length;

    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.minutesRead = Math.max(
      1,
      Math.round(unitCount / UNITS_PER_MINUTE)
    );
  };
}
