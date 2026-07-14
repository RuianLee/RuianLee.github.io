import type { collections } from "@/content.config";
import type { UIStrings } from "@/i18n/types";

/**
 * Single source of truth for which content collections show up as
 * site "categories" (nav item, breadcrumb label, homepage card, /<slug> route).
 *
 * To add a new category:
 * 1. Define its collection + schema in `src/content.config.ts`.
 * 2. Add an entry here (its position controls nav order).
 * 3. Add the referenced i18n keys to `src/i18n/types.ts`, `en.ts`, `zh-Hant.ts`.
 * 4. Create `src/content/<slug>/` with the markdown files.
 *
 * `layout: "list"` categories automatically get generic routes at
 * `src/pages/[category]/`. Categories with bespoke routing (e.g. `blog`,
 * which has pagination + OG image generation) set `customRoute: true` to
 * opt out of the generic route generator while still appearing in nav.
 */

type CollectionName = Exclude<keyof typeof collections, "pages">;

export interface CategoryDef {
  slug: CollectionName;
  navKey: keyof UIStrings["nav"];
  titleKey: keyof UIStrings["pages"];
  descKey: keyof UIStrings["pages"];
  homeDescKey: keyof UIStrings["home"];
  layout: "grid" | "list";
  customRoute?: boolean;
}

export const categories: CategoryDef[] = [
  {
    slug: "portfolio",
    navKey: "portfolio",
    titleKey: "portfolioTitle",
    descKey: "portfolioDesc",
    homeDescKey: "categoryPortfolioDesc",
    layout: "grid",
  },
  {
    slug: "blog",
    navKey: "blog",
    titleKey: "blogTitle",
    descKey: "blogDesc",
    homeDescKey: "categoryBlogDesc",
    layout: "list",
    customRoute: true,
  },
  {
    slug: "journal",
    navKey: "journal",
    titleKey: "journalTitle",
    descKey: "journalDesc",
    homeDescKey: "categoryJournalDesc",
    layout: "list",
  },
  {
    slug: "faith",
    navKey: "faith",
    titleKey: "faithTitle",
    descKey: "faithDesc",
    homeDescKey: "categoryFaithDesc",
    layout: "list",
  },
  {
    slug: "morning-revival",
    navKey: "morningRevival",
    titleKey: "morningRevivalTitle",
    descKey: "morningRevivalDesc",
    homeDescKey: "categoryMorningRevivalDesc",
    layout: "list",
  },
];

/** Categories handled by the generic `src/pages/[category]/` routes. */
export const genericCategories = categories.filter(c => !c.customRoute);
