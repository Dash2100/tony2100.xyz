---
title: CSS 排版技巧筆記
date: 2025-09-20
cover: /imgs/cover-default.png
excerpt: 幾個讓版面不跑版、RWD 更穩的實用技巧，都是我自己常用、踩過雷才整理出來的。
tags: [教學, 筆記, 程式開發]
pinned: false
---

排版這件事，會的時候覺得很簡單，不會的時候覺得在跟瀏覽器吵架。這篇整理幾個我最常用的技巧。

## 用 Flexbox 置中

垂直水平置中曾經是 CSS 的世紀難題，現在三行就解決：

```css
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## RWD 不跑版的關鍵

跑版十之八九是寬度沒控制好。我的習慣是：

- 容器永遠加 `max-width` 搭配 `margin-inline: auto`
- 圖片一律 `max-width: 100%`
- 用 `min-width: 0` 解決 flex 子元素溢出
- 文字用 `clamp()` 做流體字級

### clamp 真的好用

```css
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

字級會隨著視窗大小平順縮放，不用寫一堆 media query。

## Grid 做卡片牆

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}
```

`auto-fill` 搭配 `minmax` 可以讓卡片自動換行，手機、平板、桌機都不用各寫一套。

> 經證實，版面會跑掉通常都是因為有東西沒設寬度。

## 小結

排版沒有魔法，只有習慣。把這些變成預設動作，之後做任何專案都會輕鬆很多。
