---
title: 用 SvelteKit 打造這個部落格
date: 2025-08-12
cover: /imgs/cover-default.png
excerpt: 為什麼選 SvelteKit、怎麼用 Markdown 寫文章、還有那些讓動畫變 smooth 的小細節。
tags: [程式開發, 教學]
pinned: false
---

這個部落格從零到上線大概花了我兩個禮拜。這篇就來聊聊技術選型，還有一些我覺得蠻關鍵的決定。

## 為什麼是 SvelteKit

我比較過幾個選項，最後選 SvelteKit 的原因很簡單：

- 編譯後沒有 runtime，效能好
- 檔案式路由，心智負擔小
- 內建 SSR 與預渲染，SEO 友善
- 寫起來很舒服

## 用 Markdown 寫文章

我不想每寫一篇文章就改一次程式碼，所以文章全部用 Markdown 管理。每篇 `.md` 開頭都有一段 frontmatter：

```markdown
---
title: 文章標題
date: 2025-08-12
cover: /imgs/cover.png
tags: [程式開發, 教學]
pinned: false
---

這裡開始寫內容...
```

建置時用 `import.meta.glob` 一次掃進所有文章，frontmatter 拿來做列表，內文則在伺服器端用 marked 渲染成 HTML，這樣 client 端就不用打包 markdown 解析器，bundle 更小。

### 效能上的取捨

把渲染放在 build 階段，意味著瀏覽器拿到的就是純 HTML，首屏快、互動成本低。圖片我也都加上了 `loading="lazy"`，避免一次載入拖慢頁面。

## 讓動畫 smooth

切換頁面時的動畫我用了瀏覽器原生的 View Transitions API，搭配共享元素，讓封面圖在列表與文章頁之間平順地變形：

```js
onNavigate((navigation) => {
  if (!document.startViewTransition) return;
  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await navigation.complete;
    });
  });
});
```

> 好的動畫不是越多越好，而是讓使用者感覺不到斷點。

## 結語

整體下來我很滿意。如果你也想做一個自己的部落格，SvelteKit 真的是很值得一試的選擇。
