/**
 * Best-effort presence checks only — not a full re-implementation of the Zod
 * schemas in `content.config.ts`. Final correctness is still enforced by
 * `astro check` / `astro build`.
 */
export const REQUIRED_BASE = ["title", "description", "pubDatetime"];

export const REQUIRED_EXTRA: Record<string, string[]> = {
  faith: ["bookTitle", "bookAuthor"],
};

export function missingRequiredFields(
  category: string,
  data: Record<string, unknown>
): string[] {
  const required = [...REQUIRED_BASE, ...(REQUIRED_EXTRA[category] ?? [])];
  return required.filter(key => {
    const value = data[key];
    return value === undefined || value === null || value === "";
  });
}
