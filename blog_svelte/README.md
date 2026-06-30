# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv@0.15.1 create --template minimal --types jsdoc --add eslint tailwindcss="plugins:typography,forms" --install bun blog_svelte
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## 新增文章（Markdown）

文章全部用 Markdown 管理，放在 `src/posts/` 資料夾，一個 `.md` 檔就是一篇文章。
檔名會變成網址：`src/posts/my-first-post.md` → `/post/my-first-post`。

每篇開頭要有一段 frontmatter：

```markdown
---
title: 文章標題
date: 2025-07-24          # YYYY-MM-DD，用來排序與顯示
cover: /imgs/cover-default.png   # 封面圖（放在 static/imgs/ 下）
excerpt: 一句話摘要，會顯示在列表與 SEO description。
tags: [競賽, 程式開發]     # 標籤，會自動產生標籤過濾與側欄
pinned: true             # 是否置頂（可省略，預設 false）
---

這裡開始用 Markdown 寫內文，支援標題、清單、程式碼區塊、表格、引言、圖片等。
## 第二層標題會自動進入「文章目錄」
### 第三層標題也會
```

說明：

- 字數會自動計算、日期會自動格式化成「2025 年 07 月 24 日」。
- 內文的 `##` / `###` 標題會自動產生右側「文章目錄」與錨點連結。
- 文章列表（首頁、文章列表頁）、熱門文章、標籤都會自動更新，不需要改任何程式碼。
- 內文渲染在 build / 伺服器端完成（用 `marked`），瀏覽器拿到的是靜態 HTML，效能佳。
- 新增依賴後若用 bun，請執行一次 `bun install` 讓 `bun.lockb` 同步（本次新增了 `marked`）。
