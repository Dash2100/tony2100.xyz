/** Markdown → HTML for the live preview, matching the blog's renderer. */
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

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
      return `<h${depth} class="md-h md-h${depth}">${inner}</h${depth}>\n`;
    },
    image({ href, title, text }) {
      const t = title ? ` title="${title}"` : '';
      return `<img class="md-img" src="${href}" alt="${text || ''}"${t} loading="lazy">`;
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      const t = title ? ` title="${title}"` : '';
      return `<a class="md-a" href="${href}"${t} target="_blank" rel="noopener noreferrer">${inner}</a>`;
    },
  },
});

export function renderMd(src) {
  return marked.parse(src || '');
}
