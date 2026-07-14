# 紙頁書房

個人網站，Astro + Tailwind CSS 打造，以 [AstroPaper](https://github.com/satnaing/astro-paper) 為基礎進行客製。

## 內容結構

分類清單定義在 [`src/config/categories.ts`](./src/config/categories.ts)，是唯一的分類清單來源：導覽列、麵包屑、首頁分類卡片、`/<slug>` 路由都是從這份清單自動產生的。

- `/portfolio` — 作品集（網格版型，含標籤）
- `/blog` — 文集（技術文章；唯一有分頁 + OG 圖產生器的特殊分類）
- `/journal` — 隨筆
- `/faith` — 靈修分享

內容分別放在 `src/content/portfolio`、`src/content/blog`、`src/content/journal`、`src/content/faith` 底下，新增一篇 Markdown 檔即可上稿。

### 新增一個分類（SOP）

大部分新分類版型跟 journal／faith 一樣（純文字列表），不需要新增任何路由檔案，照以下 4 步驟即可：

1. **`src/content.config.ts`** — 用 `defineCollection` 定義 schema，並在 `collections` 物件加一筆。**key 要用 kebab-case**（例如 `"morning-revival"`），因為它同時會被當成 URL 路徑。
2. **`src/config/categories.ts`** — 在 `categories` 陣列加一筆設定，例如：

   ```ts
   {
     slug: "morning-revival",
     navKey: "morningRevival",
     titleKey: "morningRevivalTitle",
     descKey: "morningRevivalDesc",
     homeDescKey: "categoryMorningRevivalDesc",
     layout: "list",
   }
   ```

   陣列中的位置就是導覽列的顯示順序；純文字列表用 `layout: "list"`。
3. **i18n** — 在 `src/i18n/types.ts`、`src/i18n/lang/en.ts`、`src/i18n/lang/zh-Hant.ts` 補上第 2 步用到的 4 個 key（`nav.<navKey>`、`pages.<titleKey>`、`pages.<descKey>`、`home.<homeDescKey>`）。漏加會直接被 TypeScript 擋下（`satisfies UIStrings` 型別錯誤），不會發生「建置成功但某語言漏翻譯」的情況。
4. **建內容資料夾** — 建立 `src/content/<slug>/`，放第一篇 `.md`。

完成後跑 `npm run build`（內含 `astro check`）確認沒有型別錯誤，`/<slug>` 的列表頁與詳細頁會自動產生，不用碰 `Header.astro`、`Breadcrumb.astro`、`src/pages/index.astro` 或任何路由檔。

> 只有版型跟 journal/faith 明顯不同時才需要額外邏輯：
> - 像 `portfolio` 那種網格＋標籤版型，設 `layout: "grid"`，並在 [`src/pages/[category]/index.astro`](<./src/pages/[category]/index.astro>) / [`[...slug]/index.astro`](<./src/pages/[category]/[...slug]/index.astro>) 依 `layout` 分支處理渲染邏輯。
> - 像 `blog` 那種需要分頁、RSS、動態 OG 圖的重量級分類，設 `customRoute: true` 讓它跳過通用路由產生器，自己在 `src/pages/<slug>/` 下維護獨立路由（同時仍會出現在導覽列/麵包屑/首頁分類卡片）。

## 開發

```bash
npm install
npm run dev      # 本機開發伺服器
npm run build    # 產出靜態網站到 dist/
npm run preview  # 預覽 build 結果
```

## 部署

Push 到 `main` 分支後，`.github/workflows/deploy.yml` 會自動 build 並部署到 GitHub Pages（`https://<帳號>.github.io`）。

第一次部署前，記得到 GitHub repo 的 **Settings → Pages**，把 Source 設定為 **GitHub Actions**。

## 設定

網站標題、作者、社群連結等設定在 [`astro-paper.config.ts`](./astro-paper.config.ts)。
