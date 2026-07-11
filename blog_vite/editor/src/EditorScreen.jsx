import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeToggle } from './App.jsx';
import { getItem, saveItem, deleteItem, uploadImage } from './api.js';
import { renderMd } from './md.js';

/** Small stroke icon wrapper (all UI glyphs are inline SVG — no emoji). */
const I24 = ({ size = 16, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

/* ---- insertable custom objects ---- */
const INSERT_ITEMS = [
  {
    icon: <I24 size={20}><path d="M6 20V10M12 20V4M18 20v-6" /></I24>,
    name: '投票', desc: '讀者點選投票，結果存在讀者的瀏覽器',
    tpl: '```poll\nquestion: 你比較喜歡哪一個？\noptions: 選項一 | 選項二 | 選項三\n```',
  },
  {
    icon: <I24 size={20}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1.5-1 2.5h-6c0-1-.3-1.9-1-2.5A6 6 0 0 1 12 3Z" /></I24>,
    name: '提示框', desc: 'type 可用 info / tip / warning / danger / success',
    tpl: '```callout\ntype: tip\ntitle: 小提示\n\n這裡寫提示內容，支援換行。\n```',
  },
  {
    icon: <I24 size={20}><rect x="3" y="6" width="18" height="12" rx="3" /><path d="m10 9.5 5 2.5-5 2.5v-5Z" /></I24>,
    name: 'YouTube 影片', desc: '貼上影片 ID，嵌入響應式播放器',
    tpl: '```youtube\nid: dQw4w9WgXcQ\n```',
  },
  {
    icon: <I24 size={20}><path d="m12 4 2.3 4.9 5.2.7-3.8 3.7.9 5.2-4.6-2.5-4.6 2.5.9-5.2L4.5 9.6l5.2-.7L12 4Z" /></I24>,
    name: '評分條', desc: '分數進度條（例如作品評分 8.5 / 10）',
    tpl: '```rating\nlabel: 整體評價\nscore: 8.5\nmax: 10\n```',
  },
  {
    icon: <I24 size={20}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="m9 11 3 3 3-3" /></I24>,
    name: '收合段落', desc: '點擊展開的隱藏內容（劇透、補充）',
    tpl: '<details>\n<summary>點我展開</summary>\n\n隱藏的內容寫在這裡。\n\n</details>',
  },
  {
    icon: <I24 size={20}><path d="M6 4v16" /><circle cx="6" cy="7" r="1.7" /><path d="M10 7h9" /><circle cx="6" cy="14" r="1.7" /><path d="M10 14h6" /></I24>,
    name: '時間軸', desc: '里程碑記事（每行「時間: 事件」）',
    tpl: '```timeline\n2024-01: 開始學前端\n2024-06: 做出第一個作品\n2025-03: 部落格上線\n```',
  },
  {
    icon: <I24 size={20}><path d="M10 7.5H6.5A2.5 2.5 0 0 0 4 10v2.5A2.5 2.5 0 0 0 6.5 15H8v.5A3.5 3.5 0 0 1 4.5 19M20 7.5h-3.5A2.5 2.5 0 0 0 14 10v2.5a2.5 2.5 0 0 0 2.5 2.5H18v.5a3.5 3.5 0 0 1-3.5 3.5" /></I24>,
    name: '引用卡', desc: '大字金句＋出處',
    tpl: '```quote\ntext: 種一棵樹最好的時間是十年前，其次是現在。\nauthor: 諺語\n```',
  },
  {
    icon: <I24 size={20}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18" /></I24>,
    name: '連結卡片', desc: '美化的書籤卡（標題＋描述＋網址）',
    tpl: '```linkcard\ntitle: MDN Web Docs\ndesc: Web 開發者的百科全書\nurl: https://developer.mozilla.org\n```',
  },
  {
    icon: <I24 size={20}><rect x="4" y="5.5" width="11" height="3" rx="1.5" /><rect x="4" y="10.5" width="16" height="3" rx="1.5" /><rect x="4" y="15.5" width="7" height="3" rx="1.5" /></I24>,
    name: '進度條組', desc: '多條進度／技能條（每行「名稱: 0-100」）',
    tpl: '```progress\nJavaScript: 85\nCSS: 70\n設計: 60\n```',
  },
  {
    icon: <I24 size={20}><circle cx="12" cy="13" r="8" /><path d="M12 9.5V13l2.5 2.5M9 2.5h6" /></I24>,
    name: '倒數日', desc: '自動計算距離某天還有幾天（讀者端即時）',
    tpl: '```countdown\ntitle: 距離新年\ndate: 2027-01-01\n```',
  },
  {
    icon: <I24 size={20}><path d="M12 3v18" /><path d="M8 7H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M16 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" /></I24>,
    name: '圖片對比', desc: '拖曳滑桿比較前後兩張圖',
    tpl: '```compare\nbefore: /imgs/posts/before.png\nafter: /imgs/posts/after.png\n```',
  },
  {
    icon: <I24 size={20}><circle cx="6" cy="6" r="2.2" /><path d="M11 6h9" /><circle cx="6" cy="12" r="2.2" /><path d="M11 12h9" /><circle cx="6" cy="18" r="2.2" /><path d="M11 18h9" /></I24>,
    name: '步驟教學', desc: '編號步驟（每行「標題: 說明」）',
    tpl: '```steps\n安裝環境: 下載並安裝 Node.js LTS\n建立專案: npm create vite@latest\n啟動開發: npm run dev\n```',
  },
  {
    icon: <I24 size={20}><circle cx="12" cy="12" r="9" /><path d="M9.5 9.2a2.5 2.5 0 1 1 3.6 2.2c-.7.35-1.1.85-1.1 1.6M12 16.5h.01" /></I24>,
    name: '常見問答 FAQ', desc: '點擊展開的問答清單（每行「問: 答」）',
    tpl: '```faq\n這是免費的嗎？: 是的，完全免費。\n手機可以看嗎？: 可以，全站響應式設計。\n```',
  },
  {
    icon: <I24 size={20}><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 9.5h16M10 9.5V20" /></I24>,
    name: '規格表', desc: '雙欄鍵值表（開箱、評測、比較）',
    tpl: '```spec\n處理器: Apple M3\n記憶體: 16GB\n重量: 1.24kg\n```',
  },
  {
    icon: <I24 size={20}><rect x="3" y="7" width="18" height="10" rx="2" /><path d="M7 10.5h.01M11 10.5h.01M15 10.5h.01M7.5 14h9" /></I24>,
    name: '快捷鍵表', desc: '鍵帽樣式的快捷鍵清單（每行「動作: Cmd + S」）',
    tpl: '```keys\n儲存: Cmd + S\n搜尋: Cmd + F\n```',
  },
  {
    icon: <I24 size={20}><path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Z" /><path d="M13 3v6h6M12 12v5m0 0-2.5-2.5M12 17l2.5-2.5" /></I24>,
    name: '檔案下載卡', desc: '含檔名、大小與下載按鈕的卡片',
    tpl: '```file\nname: 簡報檔案.pdf\nurl: /files/slides.pdf\nsize: 2.4 MB\n```',
  },
  {
    icon: <I24 size={20}><path d="m9 4-5 1.8v14L9 18l6 2 5-1.8v-14L15 6 9 4Z" /><path d="M9 4v14M15 6v14" /></I24>,
    name: '地圖', desc: '嵌入 Google 地圖（輸入地點名稱即可）',
    tpl: '```map\nquery: 台北 101\n```',
  },
  {
    icon: <I24 size={20}><path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" /></I24>,
    name: '音訊播放', desc: '嵌入音訊播放器（podcast、錄音）',
    tpl: '```audio\ntitle: 錄音檔\nsrc: /files/audio.mp3\n```',
  },
  {
    icon: <I24 size={20}><path d="M4 12h16" /></I24>,
    name: '分隔線', desc: '水平分隔線', tpl: '---',
  },
];

/* ----------------------------- helpers ----------------------------- */

function cleanData(type, d) {
  if (type === 'notes') {
    const out = { date: String(d.date || '').slice(0, 10) };
    if (d.title) out.title = String(d.title);
    return out;
  }
  return {
    title: String(d.title || '').trim() || '未命名',
    subtitle: String(d.subtitle || '').trim(),
    date: String(d.date || '').slice(0, 10),
    tags: (d.tags || []).map(String).filter(Boolean),
    cover: String(d.cover || '').trim(),
    pinned: Boolean(d.pinned),
    excerpt: String(d.excerpt || '').trim(),
  };
}

const sanitizeFileName = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9_.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '') || 'cover.png';

/* ----------------------------- component ----------------------------- */

export default function EditorScreen({ type, slug, onBack }) {
  const isPost = type === 'posts';
  const [data, setData] = useState(null);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState('write'); // mobile: info | write | preview
  const [deskTab, setDeskTab] = useState('write'); // desktop: write | info
  const [tagInput, setTagInput] = useState('');
  const [insertOpen, setInsertOpen] = useState(false);
  const taMobileRef = useRef(null);
  const taDeskRef = useRef(null);
  const deskPreviewRef = useRef(null);
  const scrollLockRef = useRef(null);
  const unlockTimer = useRef(null);
  const fileRef = useRef(null);
  const contentImgRef = useRef(null);
  const toastTimer = useRef(null);

  /** the textarea instance the user is actually looking at */
  const getTa = () => {
    const desk = window.matchMedia('(min-width: 1024px)').matches;
    return (desk ? taDeskRef.current : taMobileRef.current) || taDeskRef.current || taMobileRef.current;
  };

  /* load */
  useEffect(() => {
    getItem(type, slug)
      .then((it) => {
        setData(it.data);
        setContent(it.content.replace(/^\n+/, ''));
      })
      .catch((e) => setError(String(e.message || e)));
  }, [type, slug]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  };

  const patch = (k, v) => {
    setData((d) => ({ ...d, [k]: v }));
    setDirty(true);
  };
  const updateContent = (v) => {
    setContent(v);
    setDirty(true);
  };

  /* save */
  const save = async () => {
    if (!data || saving) return;
    setSaving(true);
    try {
      await saveItem(type, slug, cleanData(type, data), content);
      setDirty(false);
      showToast('已儲存，內容已寫入部落格');
    } catch (e) {
      showToast(`儲存失敗：${e.message || e}`);
    } finally {
      setSaving(false);
    }
  };
  const saveRef = useRef(save);
  saveRef.current = save;

  /* Cmd/Ctrl+S + Escape + leave guard */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
      if (e.key === 'Escape') setInsertOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const back = () => {
    if (dirty && !confirm('有尚未儲存的變更，確定要離開嗎？')) return;
    onBack();
  };

  const remove = async () => {
    if (!confirm(`確定要刪除「${slug}.md」嗎？此動作無法復原。`)) return;
    try {
      await deleteItem(type, slug);
      onBack();
    } catch (e) {
      showToast(`刪除失敗：${e.message || e}`);
    }
  };

  /* ---- markdown toolbar (operates on the visible textarea) ---- */
  const applyEdit = (ta, nextValue, selStart, selEnd) => {
    updateContent(nextValue);
    requestAnimationFrame(() => {
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  };
  const surround = (before, after = before, placeholder = '文字') => {
    const ta = getTa();
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    applyEdit(ta, next, s + before.length, s + before.length + sel.length);
  };
  const linePrefix = (prefix) => {
    const ta = getTa();
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const ls = value.lastIndexOf('\n', s - 1) + 1;
    const seg = value.slice(ls, e);
    const prefixed = seg
      .split('\n')
      .map((l) => (l.startsWith(prefix) ? l.slice(prefix.length) : prefix + l))
      .join('\n');
    applyEdit(ta, value.slice(0, ls) + prefixed + value.slice(e), ls, ls + prefixed.length);
  };
  const insertBlock = (block) => {
    const ta = getTa();
    if (!ta) return;
    const { selectionStart: s, value } = ta;
    const pre = value.slice(0, s);
    const pad = pre && !pre.endsWith('\n\n') ? (pre.endsWith('\n') ? '\n' : '\n\n') : '';
    const next = pre + pad + block + '\n' + value.slice(s);
    const pos = (pre + pad + block).length;
    applyEdit(ta, next, pos, pos);
  };

  const TOOLS = [
    { label: <b>B</b>, title: '粗體', run: () => surround('**') },
    { label: <i>I</i>, title: '斜體', run: () => surround('*') },
    {
      label: <code style={{ fontSize: '0.8em' }}>{'</>'}</code>,
      title: '行內程式碼', run: () => surround('`'),
    },
    { label: 'H2', title: '大標題', run: () => linePrefix('## ') },
    { label: 'H3', title: '小標題', run: () => linePrefix('### ') },
    {
      label: <I24><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></I24>,
      title: '項目清單', run: () => linePrefix('- '),
    },
    {
      label: <I24><path d="M4 5h16M4 12h10M4 19h16" /></I24>,
      title: '引言', run: () => linePrefix('> '),
    },
    {
      label: <I24><path d="m9 8-4 4 4 4M15 8l4 4-4 4" /></I24>,
      title: '程式碼', run: () => insertBlock('```js\n// code\n```'),
    },
    {
      label: <I24><path d="M10 14a4.5 4.5 0 0 0 6.4 0l2.3-2.3a4.5 4.5 0 0 0-6.4-6.4l-1.1 1.1" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-2.3 2.3a4.5 4.5 0 0 0 6.4 6.4l1.1-1.1" /></I24>,
      title: '連結', run: () => surround('[', '](https://)', '連結文字'),
    },
    {
      label: <I24><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.4" /><path d="m5 18 4.5-4.5 3 3 3.5-3.5 3 3" /></I24>,
      title: '插入圖片（選擇檔案）', run: () => contentImgRef.current?.click(),
    },
  ];

  /* ---- content images: file picker / paste / drag-drop → upload → insert ---- */
  const insertImageFiles = async (files) => {
    showToast('圖片上傳中…');
    for (const file of files) {
      try {
        const dataUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = () => rej(new Error('讀取檔案失敗'));
          r.readAsDataURL(file);
        });
        const { path } = await uploadImage(
          sanitizeFileName(file.name || 'image.png'),
          dataUrl,
          'posts'
        );
        const alt = (file.name || '圖片').replace(/\.[a-z0-9]+$/i, '');
        insertBlock(`![${alt}](${path})`);
      } catch (err) {
        showToast(`上傳失敗：${err.message || err}`);
        return;
      }
    }
    showToast(files.length > 1 ? `已插入 ${files.length} 張圖片` : '圖片已插入');
  };
  const pickImageFiles = (list) =>
    [...(list || [])].filter((f) => f.type && f.type.startsWith('image/'));

  const onTaPaste = (e) => {
    const files = pickImageFiles(e.clipboardData?.files);
    if (!files.length) return;
    e.preventDefault();
    insertImageFiles(files);
  };
  const onTaDrop = (e) => {
    const files = pickImageFiles(e.dataTransfer?.files);
    if (!files.length) return;
    e.preventDefault();
    insertImageFiles(files);
  };
  const onTaKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.currentTarget;
      const { selectionStart: s, selectionEnd: en, value } = ta;
      applyEdit(ta, value.slice(0, s) + '  ' + value.slice(en), s + 2, s + 2);
    }
  };

  /* ---- HackMD-style two-way proportional scroll sync (desktop) ---- */
  const syncFrom = (from) => (e) => {
    if (scrollLockRef.current && scrollLockRef.current !== from) return;
    scrollLockRef.current = from;
    const src = e.currentTarget;
    const dst = from === 'editor' ? deskPreviewRef.current : taDeskRef.current;
    if (dst) {
      const max = src.scrollHeight - src.clientHeight;
      const ratio = max > 0 ? src.scrollTop / max : 0;
      dst.scrollTop = ratio * Math.max(0, dst.scrollHeight - dst.clientHeight);
    }
    clearTimeout(unlockTimer.current);
    unlockTimer.current = setTimeout(() => {
      scrollLockRef.current = null;
    }, 150);
  };

  /* ---- tags ---- */
  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!(data.tags || []).includes(t)) patch('tags', [...(data.tags || []), t]);
    setTagInput('');
  };

  /* ---- cover upload ---- */
  const onPickCover = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const { path } = await uploadImage(sanitizeFileName(file.name), reader.result, 'covers');
        patch('cover', path);
        showToast('封面已上傳');
      } catch (err) {
        showToast(`上傳失敗：${err.message || err}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const previewHtml = useMemo(() => renderMd(content), [content]);

  /* ----------------------------- render ----------------------------- */

  if (error) {
    return (
      <div className="mx-auto max-w-150 px-4 py-16 flex flex-col items-center gap-4">
        <p style={{ color: 'var(--ink-75)' }}>載入失敗：{error}</p>
        <button type="button" className="btn" onClick={onBack}>回列表</button>
      </div>
    );
  }
  if (!data) {
    return <div className="p-10 text-center" style={{ color: 'var(--ink-60)' }}>載入中…</div>;
  }

  const InfoPanel = (
    <div className="card p-4 sm:p-5 flex flex-col gap-3.5">
      {isPost ? (
        <>
          <div>
            <label className="label">標題</label>
            <input className="field" value={data.title || ''} onChange={(e) => patch('title', e.target.value)} />
          </div>
          <div>
            <label className="label">副標題</label>
            <input className="field" value={data.subtitle || ''} onChange={(e) => patch('subtitle', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">日期</label>
              <input type="date" className="field" value={data.date || ''} onChange={(e) => patch('date', e.target.value)} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input type="checkbox" checked={Boolean(data.pinned)}
                  onChange={(e) => patch('pinned', e.target.checked)}
                  className="w-4 h-4 accent-[var(--accent)]" />
                置頂這篇文章
              </label>
            </div>
          </div>
          <div>
            <label className="label">標籤（Enter 加入）</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(data.tags || []).map((t) => (
                <span key={t} className="chip">
                  {t}
                  <button type="button" aria-label={`移除 ${t}`}
                    onClick={() => patch('tags', data.tags.filter((x) => x !== t))}>
                    <I24 size={10}><path d="M6 6l12 12M18 6 6 18" /></I24>
                  </button>
                </span>
              ))}
            </div>
            <input className="field" placeholder="輸入標籤後按 Enter" value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  addTag();
                }
              }}
              onBlur={addTag} />
          </div>
          <div>
            <label className="label">封面圖（16:9）</label>
            <div className="flex gap-2">
              <input className="field" placeholder="/imgs/covers/xxx.png" value={data.cover || ''}
                onChange={(e) => patch('cover', e.target.value)} />
              <button type="button" className="btn shrink-0" onClick={() => fileRef.current?.click()}>上傳</button>
            </div>
            {data.cover && (
              <img src={data.cover} alt="封面預覽"
                className="mt-2 w-full aspect-video object-cover rounded-xl"
                style={{ boxShadow: 'var(--inset)' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
                onLoad={(e) => (e.currentTarget.style.display = '')} />
            )}
          </div>
          <div>
            <label className="label">摘要（列表卡片顯示用）</label>
            <textarea className="field" rows={2} value={data.excerpt || ''}
              onChange={(e) => patch('excerpt', e.target.value)} />
          </div>
        </>
      ) : (
        <div>
          <label className="label">日期</label>
          <input type="date" className="field" value={data.date || ''} onChange={(e) => patch('date', e.target.value)} />
          <p className="text-xs mt-2" style={{ color: 'var(--ink-60)' }}>
            筆記不需要標題——內文直接顯示在筆記頁卡片裡。
          </p>
        </div>
      )}
    </div>
  );

  const renderWrite = (desk) => (
    <div className={`card p-3 sm:p-4 flex flex-col gap-3 ${desk ? 'h-full min-h-0' : ''}`}>
      {/* toolbar — horizontally scrollable on phones */}
      <div className="flex gap-1.5 overflow-x-auto sm:flex-wrap pb-1 -mb-1 shrink-0"
        style={{ scrollbarWidth: 'none' }}>
        {TOOLS.map((t, i) => (
          <button key={i} type="button" title={t.title} aria-label={t.title}
            className="btn btn-icon shrink-0" style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            onClick={t.run}>
            {t.label}
          </button>
        ))}
        <button type="button" className="btn shrink-0"
          style={{ padding: '0.4rem 0.7rem', fontSize: '0.85rem' }}
          onClick={() => setInsertOpen(true)}>
          <I24 size={14}><path d="M12 5v14M5 12h14" /></I24>
          插入物件
        </button>
      </div>
      <textarea ref={desk ? taDeskRef : taMobileRef}
        className={`editor-area ${desk ? 'editor-area-fill flex-1' : ''}`}
        value={content}
        placeholder={isPost ? '用 Markdown 開始寫文章…（可直接貼上或拖入圖片）' : '隨手記點什麼…'}
        onChange={(e) => updateContent(e.target.value)}
        onPaste={onTaPaste} onDrop={onTaDrop} onDragOver={(e) => e.preventDefault()}
        onKeyDown={onTaKeyDown}
        onScroll={desk ? syncFrom('editor') : undefined} />
      <p className="text-xs text-right shrink-0" style={{ color: 'var(--ink-60)' }}>
        {content.length} 字元 · 支援貼上／拖入圖片 · Ctrl/Cmd+S 儲存
      </p>
    </div>
  );

  const renderPreview = (desk) => (
    <div ref={desk ? deskPreviewRef : undefined}
      onScroll={desk ? syncFrom('preview') : undefined}
      className={`card preview-light p-5 sm:p-6 ${desk ? 'h-full min-h-0 overflow-y-auto overscroll-contain' : 'overflow-hidden'}`}>
      {isPost && data.cover && (
        <img src={data.cover} alt="" className="w-full aspect-video object-cover rounded-xl mb-4"
          style={{ boxShadow: 'var(--inset)' }} />
      )}
      {isPost && (
        <div className="mb-4 pb-4" style={{ borderBottom: '1px solid var(--line-soft)' }}>
          <h1 className="text-xl sm:text-2xl font-bold leading-snug">{data.title || '未命名'}</h1>
          {data.subtitle && (
            <p className="mt-1" style={{ color: 'var(--ink-75)' }}>{data.subtitle}</p>
          )}
        </div>
      )}
      {content.trim() ? (
        <div className="md-content" dangerouslySetInnerHTML={{ __html: previewHtml }} />
      ) : (
        <p className="text-sm py-8 text-center" style={{ color: 'var(--ink-60)' }}>
          開始輸入內容後，這裡會即時預覽。
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-dvh lg:h-dvh flex flex-col screen-enter">
      {/* top bar */}
      <div className="sticky top-0 z-30 px-3 sm:px-6 py-2.5 shrink-0"
        style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--line-soft)' }}>
        <div className="mx-auto max-w-350 flex items-center gap-2">
          <button type="button" className="btn btn-icon" onClick={back} aria-label="返回列表">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <span className="chip shrink-0" style={{ fontSize: '0.72rem' }}>{isPost ? '文章' : '筆記'}</span>
            <span className="truncate text-sm font-medium" style={{ color: 'var(--ink-75)' }}>{slug}.md</span>
            {dirty && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--accent)' }} title="有未儲存變更" />}
          </div>
          <button type="button" className="btn btn-icon" onClick={remove} aria-label="刪除" title="刪除">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m3 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7M10 11v6M14 11v6" /></svg>
          </button>
          <ThemeToggle />
          <button type="button" className="btn btn-primary" onClick={save} disabled={saving || !dirty}>
            {saving ? '儲存中…' : dirty ? '儲存' : '已儲存'}
          </button>
        </div>
      </div>

      {/* hidden file inputs (single instances shared by all layouts) */}
      <input ref={contentImgRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => {
          const files = pickImageFiles(e.target.files);
          e.target.value = '';
          if (files.length) insertImageFiles(files);
        }} />
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickCover} />

      {/* mobile tabs */}
      <div className="lg:hidden px-3 sm:px-6 pt-3">
        <div className="seg">
          {[
            ['info', '資訊'],
            ['write', '撰寫'],
            ['preview', '預覽'],
          ].map(([t, label]) =>
            (isPost || t !== 'info') && (
              <button key={t} type="button" className={`seg-item ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}>
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* body */}
      <div className="mx-auto w-full max-w-350 px-3 sm:px-6 py-3 sm:py-5 flex-1 lg:min-h-0 lg:flex lg:flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))] lg:pb-5">
        {/* mobile: one panel at a time (key remount replays the animation) */}
        <div key={tab} className="lg:hidden panel-enter flex flex-col gap-3">
          {!isPost && (
            <>
              {tab !== 'preview' && InfoPanel}
              {tab !== 'preview' ? renderWrite(false) : renderPreview(false)}
            </>
          )}
          {isPost && (
            <>
              {tab === 'info' && InfoPanel}
              {tab === 'write' && renderWrite(false)}
              {tab === 'preview' && renderPreview(false)}
            </>
          )}
        </div>

        {/* desktop: tabbed — full-height split editor with synced scroll, or info form */}
        <div className="hidden lg:flex flex-col gap-3 flex-1 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <div className="seg w-64">
              <button type="button" className={`seg-item ${deskTab === 'write' ? 'active' : ''}`}
                onClick={() => setDeskTab('write')}>
                撰寫
              </button>
              <button type="button" className={`seg-item ${deskTab === 'info' ? 'active' : ''}`}
                onClick={() => setDeskTab('info')}>
                {isPost ? '文章資訊' : '筆記資訊'}
              </button>
            </div>
            {deskTab === 'write' && (
              <span className="text-xs" style={{ color: 'var(--ink-60)' }}>
                左右捲動已同步
              </span>
            )}
          </div>
          {deskTab === 'info' ? (
            <div className="panel-enter overflow-y-auto min-h-0 pb-4">
              <div className="max-w-3xl">{InfoPanel}</div>
            </div>
          ) : (
            <div className="panel-enter grid grid-cols-2 gap-4 flex-1 min-h-0">
              {renderWrite(true)}
              {renderPreview(true)}
            </div>
          )}
        </div>
      </div>

      {/* insert-object menu (bottom sheet on phones, dialog on desktop) */}
      {insertOpen && (
        <>
          <div className="fixed inset-0 z-40 backdrop-enter"
            style={{ background: 'rgba(0, 0, 0, 0.4)' }}
            onClick={() => setInsertOpen(false)} />
          <div className="insert-panel" role="dialog" aria-label="插入物件">
            <div className="h-1 w-10 rounded-full mx-auto mb-3 sm:hidden"
              style={{ background: 'var(--line)' }} />
            <h3 className="font-bold text-base mb-2">插入物件</h3>
            <div className="flex flex-col gap-1.5">
              {INSERT_ITEMS.map((it) => (
                <button key={it.name} type="button"
                  className="flex items-center gap-3 text-left rounded-xl px-3 py-2.5 cursor-pointer transition-colors duration-150 hover:bg-[var(--card-2)] active:scale-[0.99]"
                  onClick={() => {
                    insertBlock(it.tpl);
                    setInsertOpen(false);
                  }}>
                  <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg"
                    style={{ background: 'var(--card-2)', color: 'var(--accent)', boxShadow: 'var(--inset)' }}>
                    {it.icon}
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm">{it.name}</span>
                    <span className="text-xs truncate" style={{ color: 'var(--ink-60)' }}>{it.desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* toast */}
      {toast && (
        <div className="toast fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="card px-4 py-2.5 text-sm font-medium">{toast}</div>
        </div>
      )}
    </div>
  );
}
