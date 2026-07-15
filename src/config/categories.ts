import type { collections } from "@/content.config";

/**
 * Single source of truth for which content collections show up as
 * site "categories" (nav item, breadcrumb label, homepage card, /<slug> route).
 *
 * To add a new category:
 * 1. Define its collection in `src/content.config.ts` (usually one line via `collection()`).
 * 2. Add an entry here with its display text (its position controls nav order).
 * 3. Create `src/content/<slug>/` with the markdown files.
 *
 * Categories automatically get generic routes at `src/pages/[category]/`.
 * Categories with bespoke routing (e.g. `blog`, which has pagination + OG
 * image generation) set `customRoute: true` to opt out of the generic route
 * generator while still appearing in nav.
 */

type CollectionName = Exclude<keyof typeof collections, "pages">;

export interface CategoryDef {
  slug: CollectionName;
  /** Nav bar label. */
  navLabel: string;
  /** Category page <title>/<h1>. */
  pageTitle: string;
  /** Category page subtitle. */
  pageDesc: string;
  /** Short label used in the homepage/sidebar category list. */
  homeDesc: string;
  customRoute?: boolean;
}

export const categories: CategoryDef[] = [
  {
    slug: "portfolio",
    navLabel: "測試",
    pageTitle: "作品集",
    pageDesc: "一些做過的作品與side project。",
    homeDesc: "作品集",
  },
  {
    slug: "blog",
    navLabel: "文集",
    pageTitle: "文集",
    pageDesc: "關於技術與思考的長篇文章。",
    homeDesc: "文集",
    customRoute: true,
  },
  {
    slug: "journal",
    navLabel: "隨筆",
    pageTitle: "隨筆",
    pageDesc: "生活中的隨手記錄。",
    homeDesc: "隨筆",
  },
  {
    slug: "faith",
    navLabel: "靈修分享",
    pageTitle: "靈修分享",
    pageDesc: "屬靈書報與讀書心得分享。",
    homeDesc: "靈修分享",
  },
  {
    slug: "morning-revival",
    navLabel: "晨興生活",
    pageTitle: "晨興生活",
    pageDesc: "晨興聖言的享受與記錄。",
    homeDesc: "晨興生活",
  },
];

/** Categories handled by the generic `src/pages/[category]/` routes. */
export const genericCategories = categories.filter(c => !c.customRoute);
