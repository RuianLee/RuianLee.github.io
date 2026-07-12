---
title: "靜態網站部署到 GitHub Pages 的筆記"
description: "用 GitHub Actions 自動化 build 與部署流程，push 到 main 之後就自動上線。"
pubDatetime: 2026-07-05
---

把一個 Astro 專案部署到 GitHub Pages，最省心的做法是用 GitHub Actions：每次 push 到 `main`，就自動跑一次 build，把產出的靜態檔案部署上去，不用手動上傳。

## 大致流程

1. 在 repo 的 Settings → Pages 裡，把來源設定為「GitHub Actions」。
2. 寫一個 workflow：checkout 專案、安裝依賴、跑 `astro build`，再用官方的 Pages actions 把 `dist/` 上傳並部署。
3. 因為網址是 `<帳號>.github.io`（使用者頁面），部署路徑是網站根目錄，Astro 設定不需要額外的 `base` 前綴。

## 小提醒

- 使用者頁面（`<帳號>.github.io`）只能有一個，且必須是公開 repo。
- 私人筆記或內容如果不想公開，記得不要放進這個 repo，或是額外用 `.gitignore`／分開的 repo 管理。

之後如果需要在同一個帳號下再開其他專案頁面（project pages），流程也大同小異，只是網址會變成 `<帳號>.github.io/<repo名稱>`，記得對應調整 Astro 的 `base` 設定。
