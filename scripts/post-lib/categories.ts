import { readFile, writeFile, mkdir, rm, rename, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { askText, askChoice, askYesNo } from "./prompts";
import { CATEGORIES_FILE, CONTENT_CONFIG_FILE, CONTENT_DIR, ROOT } from "./paths";

type CategoryDef = {
  slug: string;
  navLabel: string;
  pageTitle: string;
  pageDesc: string;
  homeDesc: string;
  customRoute?: boolean;
};

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function loadCategories(): Promise<CategoryDef[]> {
  const mod = await import("../../src/config/categories.ts");
  return mod.categories;
}

function slugToIdentifier(slug: string): string {
  const [first, ...rest] = slug.split("-");
  return first + rest.map(s => s[0].toUpperCase() + s.slice(1)).join("");
}

async function runPrettier(files: string[]) {
  const prettierBin = path.join(ROOT, "node_modules/.bin/prettier");
  execFileSync(prettierBin, ["--write", ...files], {
    cwd: ROOT,
    stdio: "inherit",
  });
}

/** Prompts for a fresh, valid, unused slug. */
async function askNewSlug(existing: CategoryDef[]): Promise<string> {
  while (true) {
    const slug = await askText("slug（英文 kebab-case，例如 book-notes）");
    if (!SLUG_RE.test(slug)) {
      console.log("格式不對，只能用小寫英文、數字、連字號。");
      continue;
    }
    if (slug === "pages" || existing.some(c => c.slug === slug)) {
      console.log("這個 slug 已經被用掉了，換一個。");
      continue;
    }
    return slug;
  }
}

async function appendToCategoriesFile(entry: CategoryDef) {
  const content = await readFile(CATEGORIES_FILE, "utf8");
  const startMarker = "export const categories: CategoryDef[] = [";
  const startIdx = content.indexOf(startMarker);
  const closeIdx = content.indexOf("\n];", startIdx);
  if (startIdx === -1 || closeIdx === -1) {
    throw new Error(`找不到 ${CATEGORIES_FILE} 裡的 categories 陣列，請手動新增分類。`);
  }

  const block = `  {
    slug: "${entry.slug}",
    navLabel: "${entry.navLabel}",
    pageTitle: "${entry.pageTitle}",
    pageDesc: "${entry.pageDesc}",
    homeDesc: "${entry.homeDesc}",
  },`;

  const updated =
    content.slice(0, closeIdx) + "\n" + block + content.slice(closeIdx);
  await writeFile(CATEGORIES_FILE, updated, "utf8");
}

async function appendToContentConfig(slug: string, identifier: string) {
  const content = await readFile(CONTENT_CONFIG_FILE, "utf8");

  const collectionAnchor = "const pages = defineCollection({";
  const collectionIdx = content.indexOf(collectionAnchor);
  const collectionsExportAnchor = "  pages,\n};";
  const exportIdx = content.indexOf(collectionsExportAnchor);
  if (collectionIdx === -1 || exportIdx === -1) {
    throw new Error(
      `找不到 ${CONTENT_CONFIG_FILE} 裡預期的結構，請手動新增分類。`
    );
  }

  const collectionDecl = `const ${identifier} = collection("./src/content/${slug}", basePostSchema);\n\n`;
  const withCollection =
    content.slice(0, collectionIdx) +
    collectionDecl +
    content.slice(collectionIdx);

  const shift = collectionDecl.length;
  const exportInsertIdx = exportIdx + shift;
  const exportLine = `  "${slug}": ${identifier},\n`;
  const updated =
    withCollection.slice(0, exportInsertIdx) +
    exportLine +
    withCollection.slice(exportInsertIdx);

  await writeFile(CONTENT_CONFIG_FILE, updated, "utf8");
}

/** Finds the `{ slug: "<slug>", ... },` block in categories.ts; throws if not found. */
function findCategoryBlockRange(content: string, slug: string): { start: number; end: number } {
  const startMarker = `  {\n    slug: "${slug}",`;
  const start = content.indexOf(startMarker);
  if (start === -1) {
    throw new Error(`找不到分類 "${slug}" 的定義，請手動確認 categories.ts。`);
  }
  const closeIdx = content.indexOf("\n  },", start);
  if (closeIdx === -1) {
    throw new Error(`categories.ts 裡 "${slug}" 的區塊格式異常，請手動處理。`);
  }
  return { start, end: closeIdx + "\n  },".length };
}

function removeCategoriesEntry(content: string, slug: string): string {
  const { start, end } = findCategoryBlockRange(content, slug);
  return content.slice(0, start) + content.slice(end);
}

function replaceCategoriesEntry(content: string, oldSlug: string, entry: CategoryDef): string {
  const { start, end } = findCategoryBlockRange(content, oldSlug);
  const block = `  {
    slug: "${entry.slug}",
    navLabel: "${entry.navLabel}",
    pageTitle: "${entry.pageTitle}",
    pageDesc: "${entry.pageDesc}",
    homeDesc: "${entry.homeDesc}",${entry.customRoute ? "\n    customRoute: true," : ""}
  },`;
  return content.slice(0, start) + block + content.slice(end);
}

/** Only supports the simple `collection(path, basePostSchema)` form the CLI itself generates. */
function assertSimpleCollectionDecl(content: string, slug: string, identifier: string) {
  const declPattern = `const ${identifier} = collection("./src/content/${slug}", basePostSchema);`;
  if (!content.includes(declPattern)) {
    throw new Error(
      `分類 "${slug}" 的定義不是簡單的共用 schema 形式（可能有客製欄位），CLI 無法自動處理，請手動修改 content.config.ts。`
    );
  }
}

function removeContentConfigEntries(content: string, slug: string, identifier: string): string {
  assertSimpleCollectionDecl(content, slug, identifier);
  const declPattern = new RegExp(
    `const ${identifier} = collection\\("\\./src/content/${slug}", basePostSchema\\);\\n\\n`
  );
  let updated = content.replace(declPattern, "");

  const quotedPattern = new RegExp(`  "${slug}": ${identifier},\\n`);
  const barePattern = new RegExp(`  ${identifier},\\n`);
  if (quotedPattern.test(updated)) {
    updated = updated.replace(quotedPattern, "");
  } else if (barePattern.test(updated)) {
    updated = updated.replace(barePattern, "");
  } else {
    throw new Error(`找不到 "${slug}" 在 collections 匯出裡的項目，請手動確認 content.config.ts。`);
  }
  return updated;
}

function renameContentConfigEntry(
  content: string,
  oldSlug: string,
  newSlug: string,
  oldIdentifier: string,
  newIdentifier: string
): string {
  assertSimpleCollectionDecl(content, oldSlug, oldIdentifier);
  const declPattern = new RegExp(
    `const ${oldIdentifier} = collection\\("\\./src/content/${oldSlug}", basePostSchema\\);`
  );
  let updated = content.replace(
    declPattern,
    `const ${newIdentifier} = collection("./src/content/${newSlug}", basePostSchema);`
  );

  const quotedPattern = new RegExp(`"${oldSlug}": ${oldIdentifier},`);
  const barePattern = new RegExp(`(^|\\s)${oldIdentifier},`);
  if (quotedPattern.test(updated)) {
    updated = updated.replace(quotedPattern, `"${newSlug}": ${newIdentifier},`);
  } else {
    const match = updated.match(barePattern);
    if (!match) {
      throw new Error(`找不到 "${oldSlug}" 在 collections 匯出裡的項目，請手動確認 content.config.ts。`);
    }
    updated = updated.replace(barePattern, `${match[1]}${newIdentifier},`);
  }
  return updated;
}

async function createCategory(): Promise<string> {
  const existing = await loadCategories();
  const slug = await askNewSlug(existing);

  const navLabel = await askText("導覽列顯示文字（navLabel）");
  const pageTitle = await askText("分類頁標題（pageTitle）", navLabel);
  const pageDesc = await askText("分類頁副標（pageDesc）");
  const homeDesc = await askText("首頁側欄顯示文字（homeDesc）", navLabel);

  const identifier = slugToIdentifier(slug);

  await mkdir(path.join(CONTENT_DIR, slug), { recursive: true });
  await appendToContentConfig(slug, identifier);
  await appendToCategoriesFile({ slug, navLabel, pageTitle, pageDesc, homeDesc });
  await runPrettier([CONTENT_CONFIG_FILE, CATEGORIES_FILE]);

  console.log(
    `\n已建立新分類 "${slug}"。若之後這個分類需要客製欄位（像 faith 的 bookTitle/bookAuthor），要自己去 src/content.config.ts 手動加。\n`
  );

  return slug;
}

/** Prompts the user to pick an existing category, or create a new (shared-schema) one. */
export async function pickOrCreateCategory(
  suggestedSlug?: string
): Promise<string> {
  const categories = await loadCategories();

  if (suggestedSlug && categories.some(c => c.slug === suggestedSlug)) {
    if (await askYesNo(`偵測到路徑符合既有分類「${suggestedSlug}」，要用這個嗎？`, true)) {
      return suggestedSlug;
    }
  }

  const choice = await askChoice<string>(
    "選擇分類：",
    [
      ...categories.map(c => ({ value: c.slug, label: `${c.navLabel} (${c.slug})` })),
      { value: "__new__", label: "+ 新增分類" },
    ]
  );

  if (choice === "__new__") {
    return createCategory();
  }
  return choice;
}

/**
 * The single entry point for `npm run post` (no args): pick a category to post
 * into, or manage categories themselves — all as options on one menu, rather
 * than separate CLI subcommands to remember.
 *
 * Returns the chosen category slug to continue into "new post", or `null` if
 * the choice was a management action that's already been carried out (rename/delete).
 */
export async function runCategoryMenu(): Promise<{ slug: string } | null> {
  const categories = await loadCategories();

  const choice = await askChoice<string>("選擇分類：", [
    ...categories.map(c => ({ value: c.slug, label: `${c.navLabel} (${c.slug})` })),
    { value: "__new__", label: "+ 新增分類" },
    { value: "__rename__", label: "修改分類名稱" },
    { value: "__delete__", label: "刪除分類" },
  ]);

  switch (choice) {
    case "__new__":
      return { slug: await createCategory() };
    case "__rename__":
      await renameCategoryFlow();
      return null;
    case "__delete__":
      await deleteCategoryFlow();
      return null;
    default:
      return { slug: choice };
  }
}

/**
 * Deletes a category. Only shared-schema categories without a custom route
 * (`blog` is excluded — it has hand-written routing/text the CLI can't safely touch).
 */
async function deleteCategoryFlow(): Promise<void> {
  const categories = await loadCategories();
  const deletable = categories.filter(c => !c.customRoute);
  if (deletable.length === 0) {
    console.log("目前沒有可以刪除的分類（自訂路由的分類，如 blog，需要手動處理）。");
    return;
  }

  const slug = await askChoice<string>(
    "選擇要刪除的分類（自訂路由的分類不列在這裡）：",
    deletable.map(c => ({ value: c.slug, label: `${c.navLabel} (${c.slug})` }))
  );
  const category = deletable.find(c => c.slug === slug)!;

  if (!(await askYesNo(`確定要刪除分類「${category.navLabel} (${slug})」嗎？這會修改程式碼檔案。`, false))) {
    console.log("已取消。");
    return;
  }

  const identifier = slugToIdentifier(slug);
  const contentConfigRaw = await readFile(CONTENT_CONFIG_FILE, "utf8");
  const categoriesRaw = await readFile(CATEGORIES_FILE, "utf8");

  // Validate both edits are possible *before* touching any files on disk.
  const updatedContentConfig = removeContentConfigEntries(contentConfigRaw, slug, identifier);
  const updatedCategories = removeCategoriesEntry(categoriesRaw, slug);

  const categoryDir = path.join(CONTENT_DIR, slug);
  const articleFiles = await readdir(categoryDir).catch(() => [] as string[]);

  const deleteAll = await askYesNo(
    `該分類目前有 ${articleFiles.length} 篇文章，要一併刪除所有文章嗎？`,
    false
  );

  if (deleteAll) {
    await rm(categoryDir, { recursive: true, force: true });
    console.log(`\n已刪除 ${articleFiles.length} 篇文章。`);
  } else if (articleFiles.length > 0) {
    if (await askYesNo("要不要先備份這些文章？", true)) {
      const backupDir = path.join(ROOT, ".post-backups", `${slug}-${Date.now()}`);
      await mkdir(path.dirname(backupDir), { recursive: true });
      await rename(categoryDir, backupDir);
      console.log(`\n文章已備份到：${backupDir}`);
    } else {
      console.log(
        `\n文章保留在原位：${categoryDir}（分類定義移除後，網站不會再讀取這個資料夾）。`
      );
    }
  }

  await writeFile(CONTENT_CONFIG_FILE, updatedContentConfig, "utf8");
  await writeFile(CATEGORIES_FILE, updatedCategories, "utf8");
  await runPrettier([CONTENT_CONFIG_FILE, CATEGORIES_FILE]);

  console.log(`\n已刪除分類 "${slug}"。`);
}

/**
 * Edits a category's display text, and optionally its slug (URL + folder name).
 * Same `blog` exclusion as `deleteCategoryFlow` — its slug/text are partly
 * hand-written elsewhere and unsafe to auto-edit.
 */
async function renameCategoryFlow(): Promise<void> {
  const categories = await loadCategories();
  const editable = categories.filter(c => !c.customRoute);
  if (editable.length === 0) {
    console.log("目前沒有可以修改的分類（自訂路由的分類，如 blog，需要手動處理）。");
    return;
  }

  const slug = await askChoice<string>(
    "選擇要修改的分類（自訂路由的分類不列在這裡）：",
    editable.map(c => ({ value: c.slug, label: `${c.navLabel} (${c.slug})` }))
  );
  const category = editable.find(c => c.slug === slug)!;

  console.log("\n直接按 Enter 保留原值。");
  const navLabel = await askText("導覽列顯示文字（navLabel）", category.navLabel);
  const pageTitle = await askText("分類頁標題（pageTitle）", category.pageTitle);
  const pageDesc = await askText("分類頁副標（pageDesc）", category.pageDesc);
  const homeDesc = await askText("首頁側欄顯示文字（homeDesc）", category.homeDesc);

  let newSlug = slug;
  if (
    await askYesNo(
      `要順便改網址代稱／資料夾名稱嗎？目前是 "${slug}"，改了網址跟資料夾都會跟著變。`,
      false
    )
  ) {
    newSlug = await askNewSlug(categories);
  }

  const updatedCategories = replaceCategoriesEntry(
    await readFile(CATEGORIES_FILE, "utf8"),
    slug,
    { slug: newSlug, navLabel, pageTitle, pageDesc, homeDesc, customRoute: category.customRoute }
  );

  let updatedContentConfig: string | undefined;
  if (newSlug !== slug) {
    updatedContentConfig = renameContentConfigEntry(
      await readFile(CONTENT_CONFIG_FILE, "utf8"),
      slug,
      newSlug,
      slugToIdentifier(slug),
      slugToIdentifier(newSlug)
    );
    await rename(path.join(CONTENT_DIR, slug), path.join(CONTENT_DIR, newSlug));
  }

  await writeFile(CATEGORIES_FILE, updatedCategories, "utf8");
  const touchedFiles = [CATEGORIES_FILE];
  if (updatedContentConfig) {
    await writeFile(CONTENT_CONFIG_FILE, updatedContentConfig, "utf8");
    touchedFiles.push(CONTENT_CONFIG_FILE);
  }
  await runPrettier(touchedFiles);

  console.log(
    `\n已更新分類「${navLabel}」${newSlug !== slug ? `（網址代稱從 "${slug}" 改成 "${newSlug}"）` : ""}。`
  );
}
