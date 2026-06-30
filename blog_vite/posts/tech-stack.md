---
title: 打造這個部落格的技術棧
subtitle: Vite + 原生 JavaScript + 一條 Markdown 管線
date: 2025-09-02
tags: [程式開發, 技術]
cover: /imgs/covers/tech-stack.png
pinned: false
excerpt: 不用框架，用 Vite 自訂外掛把 Markdown 變成資料模組，搭配原生 JS 渲染。記錄這個部落格背後的取捨。
---

很多人問我這個站是用什麼做的。答案有點反潮流：沒有 React、沒有 Next.js，就是 Vite 加原生 JavaScript。

## 為什麼不用框架

這是一個內容為主的個人站，互動很單純。引入框架反而會增加心智負擔與打包體積。原生 JS 已經足夠，而且學到的東西更底層、更通用。

## 核心：Markdown 管線

關鍵是一個自訂的 Vite 外掛，在建置時把每個 `.md` 檔轉成資料模組：

```js
function blogMarkdownPlugin() {
  return {
    name: 'vite-plugin-blog-markdown',
    transform(code, id) {
      if (!id.endsWith('.md')) return null;
      const { data, content } = matter(code);
      const { html, toc } = renderMarkdown(content);
      const post = { ...data, html, toc, words: countWords(content) };
      return { code: `export default ${JSON.stringify(post)};` };
    },
  };
}
```

這樣一來，頁面只要 `import.meta.glob('/posts/*.md')` 就能拿到結構化的文章資料，包含 HTML、目錄、字數與閱讀時間。

## 用到的工具

- **Vite**：開發伺服器與打包。
- **marked + highlight.js**：Markdown 渲染與程式碼高亮。
- **gray-matter**：解析 frontmatter。
- **Tailwind CSS v4**：樣式。

## 取捨

這套做法的代價是「自己造輪子」，但好處是整個流程透明可控，打包出來又快又小。對個人專案來說，這個取捨很值得。
