import path from "node:path";
import { readFile, writeFile, mkdir, rename, copyFile, unlink } from "node:fs/promises";
import isBlank from "is-blank";
import { askText, closePrompts } from "./post-lib/prompts";
import { pickOrCreateCategory, runCategoryMenu } from "./post-lib/categories";
import { resolveCoverInput, coverRefExists } from "./post-lib/coverImage";
import {
  buildFrontmatter,
  readFrontmatter,
  patchFrontmatterField,
} from "./post-lib/frontmatter";
import { missingRequiredFields, REQUIRED_EXTRA } from "./post-lib/validate";
import { slugifyStr } from "../src/utils/slugify";
import { CONTENT_DIR } from "./post-lib/paths";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

async function movePhysicalFile(source: string, dest: string) {
  try {
    await rename(source, dest);
  } catch {
    // Cross-device move (e.g. source on a different volume) — fall back to copy+delete.
    await copyFile(source, dest);
    await unlink(source);
  }
}

async function runNewFlow() {
  const menuResult = await runCategoryMenu();
  if (!menuResult) return; // 選了修改/刪除分類，已經處理完了，不用繼續建文章
  const { slug: category } = menuResult;

  const title = await askText("文章標題");
  const slug = slugifyStr(title);

  const description = await askText("描述 (description)");
  const pubDatetime = await askText("發布日期 (pubDatetime, YYYY-MM-DD)", todayStr());

  const extraFields: { key: string; value: string; quote?: boolean }[] = [];
  for (const key of REQUIRED_EXTRA[category] ?? []) {
    extraFields.push({ key, value: await askText(`請輸入 ${key}`) });
  }

  const coverInput = await askText(
    "封面圖（留空用預設圖；輸入已用過的代稱可重複使用，或輸入圖片路徑新增一張）"
  );
  const coverRef = coverInput
    ? await resolveCoverInput(coverInput, process.cwd())
    : undefined;

  const frontmatter = buildFrontmatter([
    { key: "title", value: title },
    { key: "description", value: description },
    { key: "pubDatetime", value: pubDatetime, quote: false },
    ...extraFields,
    { key: "coverImage", value: coverRef },
  ]);

  const destPath = path.join(CONTENT_DIR, category, `${slug}.md`);
  await mkdir(path.dirname(destPath), { recursive: true });
  await writeFile(destPath, frontmatter, { flag: "wx" }).catch(err => {
    if (err.code === "EEXIST") {
      throw new Error(`檔案已存在，換個標題吧：${destPath}`);
    }
    throw err;
  });

  console.log(`\n已建立文章骨架：${destPath}\n去 IDE 把內文寫完就好。`);
}

async function runPublishFlow(inputPath: string) {
  const sourcePath = path.resolve(process.cwd(), inputPath);
  const raw = await readFile(sourcePath, "utf8");
  const { data } = readFrontmatter(raw);

  const suggestedSlug = path.basename(path.dirname(sourcePath));
  const category = await pickOrCreateCategory(suggestedSlug);

  const missing = missingRequiredFields(category, data);
  if (missing.length > 0) {
    console.log(
      `\nfrontmatter 缺少必填欄位，請回去補齊後再跑一次：${missing.join(", ")}`
    );
    return;
  }

  let updatedRaw = raw;
  const existingCoverImage =
    typeof data.coverImage === "string" ? data.coverImage : undefined;
  const slug = slugifyStr(String(data.title));

  if (existingCoverImage) {
    // Already a valid ref (or a path to a file that's already attached under
    // that name) — nothing to do. Otherwise treat it as a source file path.
    const alreadyRef = await coverRefExists(existingCoverImage);
    if (!alreadyRef) {
      const ref = await resolveCoverInput(existingCoverImage, path.dirname(sourcePath)).catch(
        err => {
          console.log(`\n封面圖處理失敗，先略過：${err.message}`);
          return undefined;
        }
      );
      if (ref) updatedRaw = patchFrontmatterField(updatedRaw, "coverImage", ref);
    }
  } else {
    const coverInput = await askText(
      "沒偵測到封面圖，要補一個嗎？（輸入已用過的代稱或圖片路徑，留空跳過用預設圖）"
    );
    if (coverInput) {
      const ref = await resolveCoverInput(coverInput, path.dirname(sourcePath));
      updatedRaw = patchFrontmatterField(updatedRaw, "coverImage", ref);
    }
  }

  const destPath = path.join(CONTENT_DIR, category, `${slug}.md`);
  await mkdir(path.dirname(destPath), { recursive: true });
  if (updatedRaw !== raw) {
    await writeFile(sourcePath, updatedRaw, "utf8");
  }
  await movePhysicalFile(sourcePath, destPath);

  console.log(`\n已歸檔到：${destPath}`);
}

async function main() {
  // 選擇模式：新建文章 or 發布文章
  const input = process.argv[2];

  if (isBlank(input)) {
    await runNewFlow();
  } else {
    await runPublishFlow(input);
  }
  closePrompts();
}

main().catch(err => {
  console.error(`\n發生錯誤：${err.message}`);
  closePrompts();
  process.exitCode = 1;
});
