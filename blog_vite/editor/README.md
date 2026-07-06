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
- Markdown 工具列（粗體、標題、清單、引言、程式碼、連結、圖片）
- 即時預覽，樣式與部落格一致（含程式碼高亮）
- 淺色／深色模式切換（記住偏好、無閃爍）
- `Ctrl / Cmd + S` 儲存；未儲存變更有標記與離開提醒
- 手機版：資訊／撰寫／預覽 三分頁，全程單手可操作

## 備註

- 這是**本機工具**：檔案 API 只存在於 dev server，不會部署到線上。
- 專案完全獨立（自己的 package.json 與依賴）。想搬離部落格資料夾的話，
  調整 `vite.config.js` 開頭的 `BLOG_ROOT` 路徑即可。
