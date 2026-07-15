import { copyFile, mkdir, readdir, access } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { slugifyStr } from "../../src/utils/slugify";
import { COVERS_DIR } from "./paths";

const VALID_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function expandHome(p: string): string {
  return p.startsWith("~") ? path.join(os.homedir(), p.slice(1)) : p;
}

/** Resolves a user-supplied image source path, relative to `baseDir` if not absolute. */
export function resolveSourcePath(sourcePath: string, baseDir: string): string {
  const expanded = expandHome(sourcePath);
  return path.isAbsolute(expanded) ? expanded : path.resolve(baseDir, expanded);
}

/**
 * Copies `sourcePath` into `src/assets/covers/<ref>.<ext>`. A no-op if that ref
 * is already taken (treated as "already attached, reuse it") — throws if the
 * source isn't a supported image.
 */
export async function attachCoverImage(
  sourcePath: string,
  ref: string
): Promise<string> {
  const ext = path.extname(sourcePath).toLowerCase();
  if (!VALID_EXTENSIONS.has(ext)) {
    throw new Error(`不支援的圖片格式：${ext || "(無副檔名)"}`);
  }
  await access(sourcePath).catch(() => {
    throw new Error(`找不到圖片檔案：${sourcePath}`);
  });

  await mkdir(COVERS_DIR, { recursive: true });
  if (await coverRefExists(ref)) return ref;

  const dest = path.join(COVERS_DIR, `${ref}${ext}`);
  await copyFile(sourcePath, dest);
  return ref;
}

/** Returns true if `src/assets/covers/<ref>.*` already exists. */
export async function coverRefExists(ref: string): Promise<boolean> {
  const files = await readdir(COVERS_DIR).catch(() => [] as string[]);
  return files.some(f => f.replace(/\.[^.]+$/, "") === ref);
}

/**
 * Interprets a user-supplied cover image answer: if it names an already-attached
 * ref, reuse it as-is (no file operations — this is how images get shared across
 * posts). Otherwise treat it as a source file path and attach it, keyed by the
 * source file's own name so it stays reusable rather than tied to one post.
 */
export async function resolveCoverInput(
  input: string,
  baseDir: string
): Promise<string> {
  if (await coverRefExists(input)) return input;

  const resolved = resolveSourcePath(input, baseDir);
  const ref = slugifyStr(path.basename(resolved, path.extname(resolved)));
  return attachCoverImage(resolved, ref);
}
