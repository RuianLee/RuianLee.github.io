import type { ImageMetadata } from "astro";

const covers = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/covers/*",
  { eager: true }
);

const coversByRef = new Map(
  Object.entries(covers).map(([path, mod]) => [
    path.split("/").pop()!.replace(/\.[^.]+$/, ""),
    mod.default,
  ])
);

/**
 * Reserved ref for a site-wide fallback cover. Optional — drop an image at
 * `src/assets/covers/default.<ext>` to enable it; until then posts without a
 * `coverImage` just show the placeholder box.
 */
const DEFAULT_REF = "default";

/**
 * Resolves a `coverImage` frontmatter ref to its optimized asset. Falls back to
 * `default.<ext>` when no ref is set (and that file exists); an explicit ref that
 * doesn't match anything resolves to `undefined` so typos are visible, not masked.
 */
export function getCoverImage(ref?: string): ImageMetadata | undefined {
  return coversByRef.get(ref ?? DEFAULT_REF);
}
