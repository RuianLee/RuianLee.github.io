import { getCollection } from "astro:content";
import { categories as categoryDefs } from "@/config/categories";
import { getSortedPosts } from "./getSortedPosts";

export type CategorySummary = {
  path: string;
  label: string;
  count: number;
};

/** Category nav list (with post counts) shown in the sidebar on listing pages. */
export async function getCategorySummaries(): Promise<CategorySummary[]> {
  const entries = await Promise.all(
    categoryDefs.map(({ slug }) => getCollection(slug))
  );

  return categoryDefs
    .map(({ slug, homeDesc }, i) => ({
      path: slug,
      label: homeDesc,
      count: getSortedPosts(entries[i]).length,
    }))
    .sort((a, b) => b.count - a.count);
}
