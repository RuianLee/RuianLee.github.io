import matter from "gray-matter";

export type FrontmatterField = {
  key: string;
  value: string | undefined;
  /** Set false for values that shouldn't be YAML-quoted (e.g. dates). */
  quote?: boolean;
};

/** Hand-templates a frontmatter block, matching this repo's existing hand-written style. */
export function buildFrontmatter(fields: FrontmatterField[]): string {
  const lines = fields
    .filter((f): f is FrontmatterField & { value: string } => Boolean(f.value))
    .map(f => `${f.key}: ${f.quote === false ? f.value : JSON.stringify(f.value)}`);
  return `---\n${lines.join("\n")}\n---\n\n`;
}

export function readFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const parsed = matter(raw);
  return { data: parsed.data, content: parsed.content };
}

/** Rewrites a single frontmatter field in-place, leaving the rest of the file untouched. */
export function patchFrontmatterField(
  raw: string,
  key: string,
  value: string
): string {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error("找不到 frontmatter 區塊（檔案開頭沒有 ---）。");

  const block = match[1];
  const lineRe = new RegExp(`^${key}:.*$`, "m");
  const newLine = `${key}: ${JSON.stringify(value)}`;
  const newBlock = lineRe.test(block)
    ? block.replace(lineRe, newLine)
    : `${block}\n${newLine}`;

  return (
    raw.slice(0, match.index ?? 0) +
    `---\n${newBlock}\n---\n` +
    raw.slice(match[0].length)
  );
}
