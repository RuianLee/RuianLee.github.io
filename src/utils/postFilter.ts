import config from "@/config";

type DatedEntry = {
  data: { draft?: boolean; pubDatetime: Date };
};

/**
 * Determines whether an entry is eligible to be listed/rendered.
 * Works across all date-based collections (blog/portfolio/journal/faith).
 *
 * - Excludes drafts always
 * - In production, excludes scheduled entries until `pubDatetime` minus the configured margin
 * - In dev, always shows non-draft entries to make authoring easier
 */
export function postFilter({ data }: DatedEntry) {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
}
