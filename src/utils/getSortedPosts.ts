import { postFilter } from "./postFilter";

type DatedEntry = {
  data: {
    draft?: boolean;
    pubDatetime: Date;
    modDatetime?: Date | null;
  };
};

/**
 * Returns entries that are eligible to be shown to users, sorted by “last updated”
 * descending (uses `modDatetime` when present, otherwise `pubDatetime`).
 * Generic across all date-based collections (blog/portfolio/journal/faith).
 *
 * Note: filtering respects drafts and scheduled entries via `postFilter()`.
 */
export function getSortedPosts<T extends DatedEntry>(posts: T[]): T[] {
  return posts
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
}
