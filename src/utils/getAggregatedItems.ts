import { getCollection } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import type { ImageMetadata } from "astro";
import { getSortedPosts } from "./getSortedPosts";
import { getPostUrl } from "./getPostPaths";
import { getCoverImage } from "./getCoverImage";
import { categories as categoryDefs } from "@/config/categories";

export type AggregatedItem = {
  title: string;
  description: string;
  pubDatetime: Date;
  href: string;
  coverImage?: ImageMetadata;
  tags: string[];
};

/** Fields any generic category entry might carry, across collection schemas. */
type GenericEntry = {
  id: string;
  filePath?: string;
  data: {
    title: string;
    description: string;
    pubDatetime: Date;
    coverImage?: string;
    tags?: string[];
  };
};

function toAggregated(
  entries: GenericEntry[],
  collection: string,
  locale: string
): AggregatedItem[] {
  return entries.map(({ id, filePath, data }) => ({
    title: data.title,
    description: data.description,
    pubDatetime: data.pubDatetime,
    coverImage: getCoverImage(data.coverImage),
    tags: data.tags ?? [],
    href:
      collection === "blog"
        ? getPostUrl(id, filePath, locale)
        : getRelativeLocaleUrl(locale, `${collection}/${id}`),
  }));
}

/**
 * All posts across every site category, newest first. Used by the homepage
 * and tag pages. `tags` is normalized to `[]` for collections whose schema
 * doesn't define a `tags` field.
 */
export async function getAggregatedItems(
  locale: string
): Promise<AggregatedItem[]> {
  const categoryEntries = await Promise.all(
    categoryDefs.map(({ slug }) => getCollection(slug))
  );
  const categorySorted = categoryEntries.map(getSortedPosts);

  return categoryDefs
    .flatMap(({ slug }, i) =>
      toAggregated(categorySorted[i] as GenericEntry[], slug, locale)
    )
    .sort((a, b) => b.pubDatetime.getTime() - a.pubDatetime.getTime());
}
