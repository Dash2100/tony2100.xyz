// vite.config.js — React SPA + build-time Markdown → data-module pipeline
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { basename, join, resolve } from 'node:path';
import {
  readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, copyFileSync,
} from 'node:fs';
import matter from 'gray-matter';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

/* ---------- Markdown → data module pipeline (runs at build/dev time) ---------- */

function makeSlugger() {
  const seen = new Map();
  return (raw) => {
    let base = String(raw)
      .toLowerCase()
      .trim()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\w一-鿿぀-ヿ＀-￯\- ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section';
    if (seen.has(base)) {
      const n = seen.get(base) + 1;
      seen.set(base, n);
      return `${base}-${n}`;
    }
    seen.set(base, 0);
    return base;
  };
}

function countWords(text) {
  const cjk = (text.match(/[一-鿿぀-ヿ가-힯]/g) || []).length;
  const latin = (
    text.replace(/[一-鿿぀-ヿ가-힯]/g, ' ').match(/[A-Za-z0-9]+/g) || []
  ).length;
  return cjk + latin;
}

function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ---------- Custom blocks (poll / callout / youtube / rating) ----------
   Authored as fenced code blocks (```poll …), replaced with widget HTML
   BEFORE marked runs. The editor project mirrors this logic for its live
   preview (editor/src/md.js) — keep the two in sync. */

const escHtml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const simpleHash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
};

/** `key: value` lines up to the first blank line; the rest becomes `_body`. */
function parseBlockMeta(text) {
  const meta = {};
  const lines = String(text).replace(/\r/g, '').split('\n');
  let bodyStart = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) {
      bodyStart = i + 1;
      break;
    }
    const m = /^([A-Za-z_-]+)\s*:\s*(.*)$/.exec(lines[i]);
    if (m) meta[m[1].toLowerCase()] = m[2].trim();
    else {
      bodyStart = i;
      break;
    }
  }
  meta._body = lines.slice(bodyStart).join('\n').trim();
  return meta;
}

const svgIcon = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const CALLOUT_ICONS = {
  info: svgIcon('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/>'),
  tip: svgIcon('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.7.6-1 1.5-1 2.5h-6c0-1-.3-1.9-1-2.5A6 6 0 0 1 12 3Z"/>'),
  warning: svgIcon('<path d="M12 4 3 19h18L12 4Z"/><path d="M12 10v4M12 16.5h.01"/>'),
  danger: svgIcon('<circle cx="12" cy="12" r="9"/><path d="m8.5 8.5 7 7M15.5 8.5l-7 7"/>'),
  success: svgIcon('<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5.5"/>'),
};

/** every non-empty `label: text` line (both half/full-width colons) */
const parseLines = (text) =>
  String(text)
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.search(/[:：]/);
      return i === -1 ? null : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
    .filter(Boolean);

const daysFromToday = (dateStr) => {
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
};

/** like parseLines, but lines without a colon become title-only items */
const parseLinesLoose = (text) =>
  String(text)
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const i = l.search(/[:：]/);
      return i === -1 ? [l, ''] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    });

function renderCustomBlock(lang, text) {
  if (lang === 'poll') {
    const m = parseBlockMeta(text);
    const q = m.question || '投票';
    const opts = (m.options || '').split('|').map((s) => s.trim()).filter(Boolean);
    if (!opts.length) return null;
    const id = m.id || simpleHash(q + opts.join('|'));
    return (
      `<div class="md-poll" data-poll="${escHtml(id)}">` +
      `<p class="md-poll-q">${escHtml(q)}</p>` +
      opts
        .map(
          (o, i) =>
            `<button type="button" class="md-poll-opt" data-i="${i}">` +
            `<span class="md-poll-fill"></span>` +
            `<span class="md-poll-label">${escHtml(o)}</span>` +
            `<span class="md-poll-pct"></span></button>`
        )
        .join('') +
      `<p class="md-poll-note">點選即可投票，結果儲存在你的瀏覽器</p></div>`
    );
  }
  if (lang === 'callout') {
    const m = parseBlockMeta(text);
    const type = CALLOUT_ICONS[m.type] ? m.type : 'info';
    const body = escHtml(m._body || m.body || '').replace(/\n/g, '<br>');
    const title =
      `<p class="md-callout-title"><span class="md-callout-icon">${CALLOUT_ICONS[type]}</span>` +
      `${m.title ? `<span>${escHtml(m.title)}</span>` : ''}</p>`;
    return `<div class="md-callout md-callout-${type}">${title}<div class="md-callout-body">${body}</div></div>`;
  }
  if (lang === 'youtube') {
    const m = parseBlockMeta(text);
    const id = (m.id || m._body || '').trim().replace(/[^A-Za-z0-9_-]/g, '');
    if (!id) return null;
    return (
      `<div class="md-youtube"><iframe src="https://www.youtube-nocookie.com/embed/${id}" ` +
      `title="YouTube video" loading="lazy" allowfullscreen ` +
      `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>`
    );
  }
  if (lang === 'rating') {
    const m = parseBlockMeta(text);
    const max = Math.max(1, parseFloat(m.max) || 10);
    const score = Math.min(max, Math.max(0, parseFloat(m.score) || 0));
    const pct = ((score / max) * 100).toFixed(1);
    return (
      `<div class="md-rating"><span class="md-rating-label">${escHtml(m.label || '評分')}</span>` +
      `<span class="md-rating-track"><span class="md-rating-fill" style="width:${pct}%"></span></span>` +
      `<span class="md-rating-score">${score} / ${max}</span></div>`
    );
  }
  if (lang === 'timeline') {
    const items = parseLines(text);
    if (!items.length) return null;
    return (
      `<div class="md-timeline">` +
      items
        .map(
          ([label, body]) =>
            `<div class="md-tl-item"><span class="md-tl-dot"></span>` +
            `<div class="md-tl-content"><span class="md-tl-label">${escHtml(label)}</span>` +
            `<span class="md-tl-text">${escHtml(body)}</span></div></div>`
        )
        .join('') +
      `</div>`
    );
  }
  if (lang === 'quote') {
    const m = parseBlockMeta(text);
    const quoteText = m.text || m._body;
    if (!quoteText) return null;
    return (
      `<figure class="md-quote"><span class="md-quote-icon">` +
      svgIcon('<path d="M10 7.5H6.5A2.5 2.5 0 0 0 4 10v2.5A2.5 2.5 0 0 0 6.5 15H8v.5A3.5 3.5 0 0 1 4.5 19M20 7.5h-3.5A2.5 2.5 0 0 0 14 10v2.5a2.5 2.5 0 0 0 2.5 2.5H18v.5a3.5 3.5 0 0 1-3.5 3.5"/>') +
      `</span><blockquote>${escHtml(quoteText)}</blockquote>` +
      `${m.author ? `<figcaption>— ${escHtml(m.author)}</figcaption>` : ''}</figure>`
    );
  }
  if (lang === 'linkcard') {
    const m = parseBlockMeta(text);
    if (!m.url) return null;
    let host = '';
    try {
      host = new URL(m.url).host;
    } catch {
      host = m.url;
    }
    return (
      `<a class="md-linkcard" href="${escHtml(m.url)}" target="_blank" rel="noopener noreferrer">` +
      `<span class="md-linkcard-icon">` +
      svgIcon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>') +
      `</span><span class="md-linkcard-body">` +
      `<span class="md-linkcard-title">${escHtml(m.title || host)}</span>` +
      `${m.desc ? `<span class="md-linkcard-desc">${escHtml(m.desc)}</span>` : ''}` +
      `<span class="md-linkcard-url">${escHtml(host)}</span></span>` +
      `<span class="md-linkcard-arrow">${svgIcon('<path d="M7 17 17 7M9 7h8v8"/>')}</span></a>`
    );
  }
  if (lang === 'progress') {
    const items = parseLines(text);
    if (!items.length) return null;
    return (
      `<div class="md-progress">` +
      items
        .map(([label, val]) => {
          const v = Math.min(100, Math.max(0, parseFloat(val) || 0));
          return (
            `<div class="md-progress-row"><span class="md-progress-label">${escHtml(label)}</span>` +
            `<span class="md-progress-track"><span class="md-progress-fill" style="width:${v}%"></span></span>` +
            `<span class="md-progress-val">${v}%</span></div>`
          );
        })
        .join('') +
      `</div>`
    );
  }
  if (lang === 'countdown') {
    const m = parseBlockMeta(text);
    const diff = daysFromToday(m.date || '');
    if (diff === null) return null;
    // rendered at build time, corrected live in the reader's browser
    const num = diff === 0 ? '今天' : Math.abs(diff);
    const unit = diff === 0 ? '' : diff > 0 ? '天後' : '天前';
    return (
      `<div class="md-countdown" data-date="${escHtml(m.date)}">` +
      `<p class="md-countdown-title">${escHtml(m.title || '倒數')}</p>` +
      `<p class="md-countdown-num">${num}</p>` +
      `<p class="md-countdown-unit">${unit}</p></div>`
    );
  }
  if (lang === 'compare') {
    const m = parseBlockMeta(text);
    if (!m.before || !m.after) return null;
    return (
      `<div class="md-compare">` +
      `<img class="md-compare-before" src="${escHtml(m.before)}" alt="before" loading="lazy">` +
      `<img class="md-compare-after" src="${escHtml(m.after)}" alt="after" loading="lazy">` +
      `<span class="md-compare-divider"></span>` +
      `<input type="range" class="md-compare-range" min="0" max="100" value="50" aria-label="前後對比滑桿">` +
      `</div>`
    );
  }
  if (lang === 'steps') {
    const items = parseLinesLoose(text);
    if (!items.length) return null;
    return (
      `<div class="md-steps">` +
      items
        .map(
          ([t, d], i) =>
            `<div class="md-step"><span class="md-step-num">${i + 1}</span>` +
            `<div class="md-step-body"><span class="md-step-title">${escHtml(t)}</span>` +
            `${d ? `<span class="md-step-text">${escHtml(d)}</span>` : ''}</div></div>`
        )
        .join('') +
      `</div>`
    );
  }
  if (lang === 'faq') {
    const items = parseLines(text);
    if (!items.length) return null;
    return (
      `<div class="md-faq">` +
      items
        .map(
          ([q, a]) =>
            `<details class="md-faq-item"><summary>${escHtml(q)}</summary>` +
            `<p>${escHtml(a)}</p></details>`
        )
        .join('') +
      `</div>`
    );
  }
  if (lang === 'spec') {
    const items = parseLines(text);
    if (!items.length) return null;
    return (
      `<div class="md-spec">` +
      items
        .map(
          ([k, v]) =>
            `<div class="md-spec-row"><span class="md-spec-key">${escHtml(k)}</span>` +
            `<span class="md-spec-val">${escHtml(v)}</span></div>`
        )
        .join('') +
      `</div>`
    );
  }
  if (lang === 'keys') {
    const items = parseLines(text);
    if (!items.length) return null;
    return (
      `<div class="md-keys">` +
      items
        .map(([label, combo]) => {
          const caps = combo.split('+').map((s) => s.trim()).filter(Boolean);
          return (
            `<div class="md-keys-row"><span class="md-keys-label">${escHtml(label)}</span>` +
            `<span class="md-keys-combo">` +
            caps.map((c) => `<kbd>${escHtml(c)}</kbd>`).join('<span class="md-keys-plus">+</span>') +
            `</span></div>`
          );
        })
        .join('') +
      `</div>`
    );
  }
  if (lang === 'file') {
    const m = parseBlockMeta(text);
    if (!m.url) return null;
    const name = m.name || m.url.split('/').pop() || '下載檔案';
    return (
      `<a class="md-file" href="${escHtml(m.url)}" download>` +
      `<span class="md-file-icon">` +
      svgIcon('<path d="M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M13 3v6h6"/><path d="M12 12v5m0 0-2.5-2.5M12 17l2.5-2.5"/>') +
      `</span><span class="md-file-body"><span class="md-file-name">${escHtml(name)}</span>` +
      `${m.size ? `<span class="md-file-meta">${escHtml(m.size)}</span>` : ''}</span>` +
      `<span class="md-file-btn">下載</span></a>`
    );
  }
  if (lang === 'map') {
    const m = parseBlockMeta(text);
    const q = m.query || m._body;
    if (!q) return null;
    return (
      `<div class="md-map"><iframe src="https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed" ` +
      `loading="lazy" title="地圖：${escHtml(q)}" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe></div>`
    );
  }
  if (lang === 'audio') {
    const m = parseBlockMeta(text);
    const src = m.src || m._body;
    if (!src) return null;
    return (
      `<div class="md-audio">` +
      `${m.title ? `<p class="md-audio-title">${escHtml(m.title)}</p>` : ''}` +
      `<audio controls preload="none" src="${escHtml(src)}"></audio></div>`
    );
  }
  return null;
}

function extractCustomBlocks(md) {
  return md.replace(
    /```(poll|callout|youtube|rating|timeline|quote|linkcard|progress|countdown|compare|steps|faq|spec|keys|file|map|audio)[ \t]*\n([\s\S]*?)```/g,
    (all, lang, body) => {
      const html = renderCustomBlock(lang, body);
      return html ? `\n\n${html}\n\n` : all;
    }
  );
}

function renderMarkdown(content) {
  const toc = [];
  const slugger = makeSlugger();

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        try {
          return hljs.highlight(code, { language }).value;
        } catch {
          return hljs.highlight(code, { language: 'plaintext' }).value;
        }
      },
    })
  );

  marked.use({
    gfm: true,
    breaks: false,
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const plain = inner.replace(/<[^>]+>/g, '').trim();
        const id = slugger(plain);
        if (depth >= 2 && depth <= 3) toc.push({ id, text: plain, level: depth });
        return `<h${depth} id="${id}" class="md-h md-h${depth}"><a class="md-anchor" href="#${id}" aria-hidden="true">#</a>${inner}</h${depth}>\n`;
      },
      image({ href, title, text }) {
        const t = title ? ` title="${title}"` : '';
        return `<img class="md-img" src="${href}" alt="${text || ''}"${t} loading="lazy" decoding="async">`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        const t = title ? ` title="${title}"` : '';
        const external = /^https?:\/\//.test(href);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a class="md-a" href="${href}"${t}${attrs}>${inner}</a>`;
      },
    },
  });

  const html = marked.parse(extractCustomBlocks(content));
  return { html, toc };
}

function blogMarkdownPlugin() {
  return {
    name: 'vite-plugin-blog-markdown',
    enforce: 'pre',
    transform(code, id) {
      const clean = id.split('?')[0];
      if (!clean.endsWith('.md')) return null;

      const { data, content } = matter(code);
      const { html, toc } = renderMarkdown(content);
      const plain = stripMarkdown(content);
      const words = countWords(plain);
      const slug = (data.slug || basename(clean).replace(/\.md$/, '')).toString();

      let isoDate = null;
      if (data.date) {
        const d = new Date(data.date);
        isoDate = isNaN(d.getTime()) ? String(data.date) : d.toISOString();
      }

      const tags = Array.isArray(data.tags)
        ? data.tags.map(String)
        : data.tags
          ? [String(data.tags)]
          : [];

      const post = {
        slug,
        title: (data.title ?? slug).toString(),
        subtitle: data.subtitle ? String(data.subtitle) : '',
        date: isoDate,
        tags,
        cover: data.cover ? String(data.cover) : null,
        pinned: Boolean(data.pinned),
        excerpt: (data.excerpt ? String(data.excerpt) : plain.slice(0, 90)).trim(),
        words,
        readingMinutes: Math.max(1, Math.round(words / 350)),
        toc,
        html,
      };

      return { code: `export default ${JSON.stringify(post)};`, map: null };
    },
  };
}

/* ---------- SEO prerender (runs after build) ----------
   Emits a static HTML shell per route with full per-page metadata, so every
   article is individually crawlable and shareable:
     /posts/index.html  /notes/index.html  /post/<slug>/index.html
   plus sitemap.xml, robots.txt and a 404.html SPA fallback. */

const SITE_ORIGIN = 'https://blog.tony2100.xyz';
const SITE_NAME = "Tony2100's Life Log";
const BASE_KEYWORDS = [
  'tony2100', 'Tony2100', "Tony2100's Life Log", '部落格', '技術筆記', '生活紀錄',
];

function seoPrerenderPlugin() {
  let outDir = '';
  return {
    name: 'seo-prerender',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const tplPath = join(outDir, 'index.html');
      if (!existsSync(tplPath)) return;
      const tpl = readFileSync(tplPath, 'utf8');

      const inject = (o) => {
        let h = tpl;
        const byName = (n, v) => {
          h = h.replace(
            new RegExp(`(<meta name="${n}" content=")[^"]*(")`),
            `$1${escHtml(v)}$2`
          );
        };
        const byProp = (p, v) => {
          h = h.replace(
            new RegExp(`(<meta property="${p.replace(':', '\\:')}" content=")[^"]*(")`),
            `$1${escHtml(v)}$2`
          );
        };
        h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(o.title)}</title>`);
        byName('description', o.description);
        byName('keywords', o.keywords.join(', '));
        h = h.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${o.url}$2`);
        byProp('og:title', o.title);
        byProp('og:description', o.description);
        byProp('og:url', o.url);
        byProp('og:image', o.image);
        byProp('og:type', o.type);
        byName('twitter:title', o.title);
        byName('twitter:description', o.description);
        byName('twitter:image', o.image);
        if (o.jsonld) {
          h = h.replace(
            '</head>',
            `<script type="application/ld+json">${JSON.stringify(o.jsonld)}</script>\n</head>`
          );
        }
        return h;
      };

      const write = (relDir, html) => {
        const dir = join(outDir, relDir);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), html);
      };

      // posts straight from the markdown sources
      const postsDir = resolve(__dirname, 'posts');
      const posts = readdirSync(postsDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          const { data, content } = matter(readFileSync(join(postsDir, f), 'utf8'));
          const slug = (data.slug || f.replace(/\.md$/, '')).toString();
          const date = data.date ? new Date(data.date) : null;
          return {
            slug,
            title: String(data.title ?? slug),
            excerpt: (data.excerpt ? String(data.excerpt) : stripMarkdown(content).slice(0, 120)).trim(),
            tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
            cover: data.cover ? String(data.cover) : null,
            dateIso: date && !isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : null,
          };
        });

      const allTags = [...new Set(posts.flatMap((p) => p.tags))];
      const pages = [];

      write('posts', inject({
        title: `文章列表｜${SITE_NAME}`,
        description: 'Tony2100 的所有文章：技術筆記、生活紀錄與隨筆。',
        keywords: [...allTags, ...BASE_KEYWORDS],
        url: `${SITE_ORIGIN}/posts`,
        image: `${SITE_ORIGIN}/imgs/home-cover.png`,
        type: 'website',
      }));
      pages.push({ loc: `${SITE_ORIGIN}/posts` });

      write('notes', inject({
        title: `筆記｜${SITE_NAME}`,
        description: '那些不夠長到寫成一篇文章，卻又想記下來的事——Tony2100 的隨手筆記。',
        keywords: BASE_KEYWORDS,
        url: `${SITE_ORIGIN}/notes`,
        image: `${SITE_ORIGIN}/imgs/home-cover.png`,
        type: 'website',
      }));
      pages.push({ loc: `${SITE_ORIGIN}/notes` });

      for (const p of posts) {
        const url = `${SITE_ORIGIN}/post/${p.slug}`;
        const image = SITE_ORIGIN + (p.cover || '/imgs/cover-default.png');
        write(`post/${p.slug}`, inject({
          title: `${p.title}｜${SITE_NAME}`,
          description: p.excerpt,
          keywords: [...p.tags, ...BASE_KEYWORDS],
          url,
          image,
          type: 'article',
          jsonld: {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: p.title,
            description: p.excerpt,
            image: [image],
            url,
            mainEntityOfPage: url,
            datePublished: p.dateIso || undefined,
            dateModified: p.dateIso || undefined,
            keywords: p.tags.join(', '),
            inLanguage: 'zh-Hant',
            author: {
              '@type': 'Person',
              name: 'Tony2100',
              alternateName: 'tony2100',
              url: 'https://tony2100.xyz',
            },
            publisher: { '@type': 'Person', name: 'Tony2100' },
          },
        }));
        pages.push({ loc: url, lastmod: p.dateIso });
      }

      const urls = [{ loc: `${SITE_ORIGIN}/` }, ...pages];
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map(
            (u) =>
              `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
          )
          .join('\n') +
        `\n</urlset>\n`
      );
      writeFileSync(
        join(outDir, 'robots.txt'),
        `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
      );
      // SPA fallback for hosts like GitHub Pages (unknown paths → app shell)
      copyFileSync(tplPath, join(outDir, '404.html'));
    },
  };
}

export default defineConfig({
  plugins: [
    blogMarkdownPlugin(),
    react(),
    tailwindcss(),
    seoPrerenderPlugin(),
  ],
});
