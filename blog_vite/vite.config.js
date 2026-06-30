// vite.config.js — React SPA + build-time Markdown → data-module pipeline
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { basename } from 'node:path';
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

  const html = marked.parse(content);
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

export default defineConfig({
  plugins: [
    blogMarkdownPlugin(),
    react(),
    tailwindcss(),
  ],
});
