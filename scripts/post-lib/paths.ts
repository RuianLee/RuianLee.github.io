import path from "node:path";

export const ROOT = process.cwd();

export const CATEGORIES_FILE = path.join(ROOT, "src/config/categories.ts");
export const CONTENT_CONFIG_FILE = path.join(ROOT, "src/content.config.ts");
export const COVERS_DIR = path.join(ROOT, "src/assets/covers");
export const CONTENT_DIR = path.join(ROOT, "src/content");
