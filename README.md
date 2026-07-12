# 紙頁書房

個人網站，Astro + Tailwind CSS 打造，以 [AstroPaper](https://github.com/satnaing/astro-paper) 為基礎進行客製。

## 內容結構

- `/portfolio` — 作品集
- `/blog` — 文集（技術文章）
- `/journal` — 隨筆
- `/faith` — 靈修分享

內容分別放在 `src/content/portfolio`、`src/content/blog`、`src/content/journal`、`src/content/faith` 底下，新增一篇 Markdown 檔即可上稿。

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
