---
title: Markdown 寫作完全指南
subtitle: 從零開始，把想法寫成漂亮的文章
date: 2025-08-12
tags: [教學, Markdown]
cover: /imgs/covers/markdown-guide.png
pinned: false
excerpt: 這篇文章用來示範本站支援的所有 Markdown 語法——標題、清單、引言、表格、程式碼高亮與圖片，順便當作排版測試頁。
---

Markdown 是一種輕量級的標記語言，讓你專注在「寫」，而不是和排版工具搏鬥。這篇同時也是本站的排版測試頁，下面把常用語法都跑過一遍。

## 標題與段落

用 `#` 的數量決定標題層級。本站會自動把 `##` 與 `###` 收進右側的文章目錄（TOC），所以善用標題能讓長文更好讀。

段落之間空一行即可。行內可以使用 **粗體**、*斜體*、`行內程式碼`，以及 [外部連結](https://www.markdownguide.org)（會自動在新分頁開啟）。

## 清單

無序清單：

- 寫作時先列大綱
- 再把每個重點展開
- 最後回頭刪掉多餘的字

有序清單：

1. 草稿
2. 修改
3. 發佈

## 引言與重點

> 寫作的祕訣，是把複雜的想法拆成簡單的句子。

## 程式碼高亮

行內像這樣 `const x = 42;`，而區塊會套用 highlight.js 的語法上色：

```js
function greet(name) {
  // 跟讀者打聲招呼
  return `Hello, ${name}!`;
}

console.log(greet('Markdown'));
```

也支援其他語言，例如 CSS：

```css
.md-img {
  border-radius: 16px;
  box-shadow: var(--shadow-inner);
}
```

## 表格

| 語法     | 寫法            | 結果        |
| -------- | --------------- | ----------- |
| 粗體     | `**字**`        | **字**      |
| 斜體     | `*字*`          | *字*        |
| 連結     | `[文字](網址)`  | 連結        |

## 圖片

圖片會自動加上圓角與陰影，並啟用 lazy-load：

![一隻在浮冰上的北極熊](/imgs/covers/polar-bear.png "示意圖")

## 小結

掌握以上語法，幾乎能應付所有寫作需求。剩下的，就是坐下來把想法寫出來而已。

## 自訂區塊

本站支援幾種特殊區塊，用程式碼圍欄語法撰寫（```` ```poll ````、```` ```callout ```` 等）。

```callout
type: tip
title: 小提示
這是提示框，支援 info / tip / warning / danger / success 五種型態。
```

```poll
question: 你最喜歡哪種自訂區塊？
options: 投票 | 提示框 | 評分條 | YouTube 嵌入
```

```rating
label: 這篇指南的完整度
score: 9
max: 10
```

<details>
<summary>點我展開隱藏內容</summary>

收合區塊用原生 `<details>` 標籤，適合放劇透或補充說明。

</details>

還有更多好玩的區塊——時間軸、引用卡、連結卡片、進度條、倒數日：

```timeline
2024-01: 開始學前端
2024-06: 做出第一個作品
2025-03: 部落格上線
```

```quote
text: 種一棵樹最好的時間是十年前，其次是現在。
author: 諺語
```

```linkcard
title: MDN Web Docs
desc: Web 開發者的百科全書
url: https://developer.mozilla.org
```

```progress
JavaScript: 85
CSS: 70
設計: 60
```

```countdown
title: 距離 2027 新年
date: 2027-01-01
```

實用型的也有——步驟教學、FAQ、規格表、快捷鍵表：

```steps
安裝環境: 下載並安裝 Node.js LTS
建立專案: npm create vite@latest
啟動開發: npm run dev
```

```faq
這是免費的嗎？: 是的，完全免費。
手機可以看嗎？: 可以，全站響應式設計。
```

```spec
處理器: Apple M3
記憶體: 16GB
重量: 1.24kg
```

```keys
儲存: Cmd + S
搜尋: Cmd + F
```
