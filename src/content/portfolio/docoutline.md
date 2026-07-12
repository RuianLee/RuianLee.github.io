---
title: "DocOutline"
description: "自製 VSCode 擴充套件，把 Skim 標註的 PDF 螢光筆重點自動轉成 LaTeX 內容，用於製作聖經陪讀教材。"
pubDatetime: 2026-02-20
tags: ["VSCode Extension", "TypeScript", "LaTeX"]
---

閱讀 PDF 時用 Skim 畫的螢光筆重點，常常需要手動謄寫進陪讀教材裡，很花時間。這個擴充套件會依照畫重點的顏色（標題／小標／段落／引言）自動判斷格式，直接把內容插入到目前聚焦的 `.tex` 檔案中，把「畫重點」跟「寫教材」這兩件事串在一起。
