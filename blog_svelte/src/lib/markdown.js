import { Marked } from 'marked';

/**
 * 將標題文字轉成 anchor id（支援中英文）。
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
	return text
		.trim()
		.toLowerCase()
		.replace(/<[^>]*>/g, '')
		.replace(/[^\p{L}\p{N}\s-]/gu, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

/**
 * 將 Markdown 內文渲染成 HTML，並回傳目錄（h2 / h3）。
 * 僅在伺服器 / build 階段使用，避免把 marked 打包進 client。
 * @param {string} body
 * @returns {{ html: string, headings: Array<{ id: string, text: string, depth: number }> }}
 */
export function renderMarkdown(body) {
	/** @type {Array<{ id: string, text: string, depth: number }>} */
	const headings = [];
	const seen = new Map();

	const marked = new Marked({ gfm: true, breaks: false });

	marked.use({
		renderer: {
			/** @param {{ tokens: any[], depth: number }} token */
			heading(token) {
				const inline = this.parser.parseInline(token.tokens);
				const raw = inline.replace(/<[^>]*>/g, '');
				let id = slugify(raw) || `section`;
				if (seen.has(id)) {
					const n = seen.get(id) + 1;
					seen.set(id, n);
					id = `${id}-${n}`;
				} else {
					seen.set(id, 0);
				}
				if (token.depth === 2 || token.depth === 3) {
					headings.push({ id, text: raw, depth: token.depth });
				}
				return `<h${token.depth} id="${id}">${inline}</h${token.depth}>\n`;
			},
			/** @param {{ href: string, title: string | null, text: string }} token */
			image(token) {
				const title = token.title ? ` title="${token.title}"` : '';
				return `<img src="${token.href}" alt="${token.text || ''}"${title} loading="lazy" decoding="async" />`;
			},
			/** @param {any} token */
			link(token) {
				const text = this.parser.parseInline(token.tokens);
				const title = token.title ? ` title="${token.title}"` : '';
				const external = /^https?:\/\//.test(token.href);
				const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
				return `<a href="${token.href}"${title}${attrs}>${text}</a>`;
			}
		}
	});

	const html = /** @type {string} */ (marked.parse(body));
	return { html, headings };
}
