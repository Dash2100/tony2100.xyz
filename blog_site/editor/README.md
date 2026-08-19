# Life Log 編輯室

部落格的本機編輯介面——在漂亮的 UI 裡寫文章、管理筆記，**存檔即發佈**（直接寫入
`../posts/*.md`、`../notes/*.md` 與 `../public/imgs/covers/`），之後照常 build / 部署部落格即可。

## 使用方式

```bash
cd editor
npm install   # 第一次使用
npm run dev   # 開啟 http://localhost:5199
```

## 功能

- 文章／筆記 兩區管理：搜尋、建立、刪除
- 完整 frontmatter 表單：標題、副標、日期、標籤、封面（可直接上傳圖片）、置頂、摘要
- Markdown 工具列（粗體、標題、清單、引言、程式碼、連結）
- **圖片直接插入**：工具列選檔、貼上剪貼簿截圖、拖入檔案，自動上傳到
  `public/imgs/posts/` 並插入 `![](…)`
- **插入物件選單**（＋插入物件）：投票、提示框、YouTube、評分條、收合段落、分隔線
  ——部落格端會渲染成互動元件（投票結果存在讀者瀏覽器）
- 即時預覽，樣式與部落格一致（含程式碼高亮與自訂區塊）
- Tab 鍵縮排、`Ctrl / Cmd + S` 儲存；未儲存變更有標記與離開提醒
- 淺色／深色模式切換（記住偏好、無閃爍）
- 手機版：資訊／撰寫／預覽 三分頁、工具列橫向捲動、插入選單為底部抽屜
- 介面動畫：畫面進場、列表瀑布、分頁切換、選單彈出（尊重 prefers-reduced-motion）

## 自訂區塊語法

````markdown
```poll
question: 你比較喜歡哪一個？
options: 選項一 | 選項二 | 選項三
```

```callout
type: tip        ← info / tip / warning / danger / success
title: 小提示

內容寫在這裡。
```

```youtube
id: dQw4w9WgXcQ
```

```rating
label: 整體評價
score: 8.5
max: 10
```

```timeline
2024-01: 開始學前端
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
```

```countdown
title: 距離新年
date: 2027-01-01
```

```compare
before: /imgs/posts/before.png
after: /imgs/posts/after.png
```

```steps
安裝環境: 下載並安裝 Node.js LTS
啟動開發: npm run dev
```

```faq
這是免費的嗎？: 是的，完全免費。
```

```spec
處理器: Apple M3
記憶體: 16GB
```

```keys
儲存: Cmd + S
```

```file
name: 簡報檔案.pdf
url: /files/slides.pdf
size: 2.4 MB
```

```map
query: 台北 101
```

```audio
title: 錄音檔
src: /files/audio.mp3
```
````

## 備註

- 這是**本機工具**：檔案 API 只存在於 dev server，不會部署到線上。
- 專案完全獨立（自己的 package.json 與依賴）。想搬離部落格資料夾的話，
  調整 `vite.config.js` 開頭的 `BLOG_ROOT` 路徑即可。
