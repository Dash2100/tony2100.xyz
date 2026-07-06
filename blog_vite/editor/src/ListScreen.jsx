import { useEffect, useMemo, useState } from 'react';
import { ThemeToggle } from './App.jsx';
import { listItems, saveItem } from './api.js';

const today = () => new Date().toISOString().slice(0, 10);
const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,60}$/;

/** Landing screen: browse posts / notes, search, create new. */
export default function ListScreen({ initialType = 'posts', onOpen }) {
  const [type, setType] = useState(initialType);
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [busy, setBusy] = useState(false);

  const load = (t) => {
    setItems(null);
    setError('');
    listItems(t)
      .then(setItems)
      .catch((e) => setError(String(e.message || e)));
  };
  useEffect(() => load(type), [type]);

  const filtered = useMemo(() => {
    if (!items) return null;
    const k = q.trim().toLowerCase();
    if (!k) return items;
    return items.filter((it) =>
      [it.slug, it.data.title, it.data.subtitle, (it.data.tags || []).join(' '), it.excerptSource]
        .join(' ')
        .toLowerCase()
        .includes(k)
    );
  }, [items, q]);

  const create = async () => {
    const slug = newSlug.trim().toLowerCase();
    if (!SLUG_RE.test(slug)) {
      alert('slug 需為 2–60 字的英數與連字號（例如 my-first-post）');
      return;
    }
    if (items?.some((it) => it.slug === slug)) {
      alert('這個 slug 已存在');
      return;
    }
    setBusy(true);
    try {
      const data =
        type === 'posts'
          ? {
              title: newTitle.trim() || slug,
              subtitle: '',
              date: today(),
              tags: [],
              cover: '',
              pinned: false,
              excerpt: '',
            }
          : { date: today() };
      await saveItem(type, slug, data, '');
      onOpen(type, slug);
    } catch (e) {
      alert(`建立失敗：${e.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-200 px-4 sm:px-6 py-5 sm:py-8 flex flex-col gap-4 sm:gap-5 pb-[calc(2rem+env(safe-area-inset-bottom))]">
      {/* header */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-bold">Life Log 編輯室</h1>
          <p className="text-[13px] sm:text-sm" style={{ color: 'var(--ink-60)' }}>
            存檔即發佈——寫入部落格的 Markdown 檔案
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* type tabs + search + new */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
        <div className="seg sm:w-56 shrink-0">
          {[
            ['posts', '文章'],
            ['notes', '筆記'],
          ].map(([t, label]) => (
            <button key={t} type="button"
              className={`seg-item ${type === t ? 'active' : ''}`}
              onClick={() => { setType(t); setCreating(false); }}>
              {label}
            </button>
          ))}
        </div>
        <input className="field" placeholder="搜尋標題、標籤、內容…"
          value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="btn btn-primary shrink-0"
          onClick={() => setCreating((v) => !v)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          新增{type === 'posts' ? '文章' : '筆記'}
        </button>
      </div>

      {/* create panel */}
      {creating && (
        <div className="card p-4 sm:p-5 flex flex-col gap-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="label">slug（網址名稱，英數與 - ）</label>
              <input className="field" placeholder="my-new-post" value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)} autoFocus />
            </div>
            {type === 'posts' && (
              <div>
                <label className="label">標題</label>
                <input className="field" placeholder="文章標題" value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && create()} />
              </div>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn" onClick={() => setCreating(false)}>取消</button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={create}>
              {busy ? '建立中…' : '建立並開始編輯'}
            </button>
          </div>
        </div>
      )}

      {/* list */}
      {error && (
        <div className="card p-5 text-sm" style={{ color: 'var(--ink-75)' }}>
          載入失敗：{error}（請確認是用 <code>npm run dev</code> 開啟編輯器）
        </div>
      )}
      {!error && filtered === null && (
        <div className="card p-5 text-sm" style={{ color: 'var(--ink-60)' }}>載入中…</div>
      )}
      {filtered && filtered.length === 0 && (
        <div className="card p-8 text-center text-sm" style={{ color: 'var(--ink-60)' }}>
          {q ? '沒有符合搜尋的項目。' : '還沒有任何內容，按「新增」開始寫第一篇吧。'}
        </div>
      )}
      <div className="flex flex-col gap-3">
        {filtered?.map((it) => (
          <button key={it.slug} type="button" onClick={() => onOpen(type, it.slug)}
            className="card p-4 sm:p-5 text-left cursor-pointer transition-transform duration-150 active:scale-[0.99] hover:brightness-[1.03] flex gap-4 items-center">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                {it.data.pinned && (
                  <span className="chip shrink-0" style={{ fontSize: '0.72rem' }}>置頂</span>
                )}
                <h2 className="font-semibold text-[15px] sm:text-base truncate">
                  {type === 'posts' ? it.data.title || it.slug : it.slug}
                </h2>
              </div>
              <p className="text-[13px] truncate" style={{ color: 'var(--ink-60)' }}>
                {type === 'posts'
                  ? it.data.excerpt || it.excerptSource || '（尚無內容）'
                  : it.excerptSource || '（尚無內容）'}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--ink-60)' }}>
                <span>{it.data.date || '未設定日期'}</span>
                <span className="truncate">{it.slug}.md</span>
                {(it.data.tags || []).map((t) => (
                  <span key={t} className="chip" style={{ fontSize: '0.72rem', padding: '0.1rem 0.5rem' }}>{t}</span>
                ))}
              </div>
            </div>
            {type === 'posts' && it.data.cover && (
              <img src={it.data.cover} alt="" loading="lazy"
                className="hidden sm:block w-28 aspect-video object-cover rounded-xl shrink-0"
                style={{ boxShadow: 'var(--inset)' }} />
            )}
            <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--ink-60)' }}>
              <path d="m9 6 6 6-6 6" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
