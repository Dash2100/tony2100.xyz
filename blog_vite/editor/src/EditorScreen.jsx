import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeToggle } from './App.jsx';
import { getItem, saveItem, deleteItem, uploadCover } from './api.js';
import { renderMd } from './md.js';

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
  const [tagInput, setTagInput] = useState('');
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const toastTimer = useRef(null);

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
      showToast('已儲存，內容已寫入部落格 ✓');
    } catch (e) {
      showToast(`儲存失敗：${e.message || e}`);
    } finally {
      setSaving(false);
    }
  };
  const saveRef = useRef(save);
  saveRef.current = save;

  /* Cmd/Ctrl+S + leave guard */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
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

  /* ---- markdown toolbar ---- */
  const applyEdit = (nextValue, selStart, selEnd) => {
    updateContent(nextValue);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(selStart, selEnd);
    });
  };
  const surround = (before, after = before, placeholder = '文字') => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    applyEdit(next, s + before.length, s + before.length + sel.length);
  };
  const linePrefix = (prefix) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const ls = value.lastIndexOf('\n', s - 1) + 1;
    const seg = value.slice(ls, e);
    const prefixed = seg
      .split('\n')
      .map((l) => (l.startsWith(prefix) ? l.slice(prefix.length) : prefix + l))
      .join('\n');
    applyEdit(value.slice(0, ls) + prefixed + value.slice(e), ls, ls + prefixed.length);
  };
  const insertBlock = (block) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, value } = ta;
    const pre = value.slice(0, s);
    const pad = pre && !pre.endsWith('\n\n') ? (pre.endsWith('\n') ? '\n' : '\n\n') : '';
    const next = pre + pad + block + '\n' + value.slice(s);
    const pos = (pre + pad + block).length;
    applyEdit(next, pos, pos);
  };

  const TOOLS = [
    { label: <b>B</b>, title: '粗體', run: () => surround('**') },
    { label: <i>I</i>, title: '斜體', run: () => surround('*') },
    { label: <code style={{ fontSize: '0.8em' }}>{'</>'}</code>, title: '行內程式碼', run: () => surround('`') },
    { label: 'H2', title: '大標題', run: () => linePrefix('## ') },
    { label: 'H3', title: '小標題', run: () => linePrefix('### ') },
    { label: '•', title: '項目清單', run: () => linePrefix('- ') },
    { label: '❝', title: '引言', run: () => linePrefix('> ') },
    { label: '{ }', title: '程式碼區塊', run: () => insertBlock('```js\n// code\n```') },
    { label: '🔗', title: '連結', run: () => surround('[', '](https://)', '連結文字') },
    { label: '🖼', title: '圖片', run: () => insertBlock('![說明](/imgs/covers/xxx.png)') },
  ];

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
        const { path } = await uploadCover(sanitizeFileName(file.name), reader.result);
        patch('cover', path);
        showToast('封面已上傳 ✓');
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
                    onClick={() => patch('tags', data.tags.filter((x) => x !== t))}>✕</button>
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
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickCover} />
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

  const WritePanel = (
    <div className="card p-3 sm:p-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {TOOLS.map((t, i) => (
          <button key={i} type="button" title={t.title} aria-label={t.title}
            className="btn btn-icon" style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
            onClick={t.run}>
            {t.label}
          </button>
        ))}
      </div>
      <textarea ref={taRef} className="editor-area flex-1" value={content}
        placeholder={isPost ? '用 Markdown 開始寫文章…' : '隨手記點什麼…'}
        onChange={(e) => updateContent(e.target.value)} />
      <p className="text-xs text-right" style={{ color: 'var(--ink-60)' }}>
        {content.length} 字元 · Ctrl/Cmd+S 儲存
      </p>
    </div>
  );

  const PreviewPanel = (
    <div className="card p-5 sm:p-6 overflow-hidden">
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
    <div className="min-h-dvh flex flex-col">
      {/* top bar */}
      <div className="sticky top-0 z-30 px-3 sm:px-6 py-2.5"
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
      <div className="mx-auto w-full max-w-350 px-3 sm:px-6 py-3 sm:py-5 flex-1 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {/* mobile: one panel at a time */}
        <div className="lg:hidden flex flex-col gap-3">
          {!isPost && (
            <div className="flex flex-col gap-3">
              {tab !== 'preview' && InfoPanel}
              {tab !== 'preview' ? WritePanel : PreviewPanel}
            </div>
          )}
          {isPost && (
            <>
              {tab === 'info' && InfoPanel}
              {tab === 'write' && WritePanel}
              {tab === 'preview' && PreviewPanel}
            </>
          )}
        </div>
        {/* desktop: form + editor left, live preview right */}
        <div className="hidden lg:grid grid-cols-2 gap-5 items-start">
          <div className="flex flex-col gap-4">
            {InfoPanel}
            {WritePanel}
          </div>
          <div className="sticky top-20">{PreviewPanel}</div>
        </div>
      </div>

      {/* toast */}
      {toast && (
        <div className="toast fixed bottom-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="card px-4 py-2.5 text-sm font-medium">{toast}</div>
        </div>
      )}
    </div>
  );
}
