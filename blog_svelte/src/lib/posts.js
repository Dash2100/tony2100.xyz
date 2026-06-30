// 文章資料來源：掃描 src/posts/*.md，解析 frontmatter 提供列表用 metadata。
// 此檔可安全用於 client（不含 markdown 渲染器），內文渲染請見 markdown.js。

/** @typedef {{ slug: string, title: string, date: string, dateLabel: string, cover: string, excerpt: string, tags: string[], pinned: boolean, wordCount: number, wordsLabel: string, body: string }} Post */

const files = import.meta.glob('/src/posts/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

/**
 * 去除字串前後的引號。
 * @param {string} s
 */
function stripQuotes(s) {
	return s.replace(/^['"]|['"]$/g, '').trim();
}

/**
 * 極簡 frontmatter 解析（支援字串、布林、inline 陣列與區塊清單）。
 * @param {string} raw
 * @returns {{ data: Record<string, any>, body: string }}
 */
function parseFrontmatter(raw) {
	const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
	if (!m) return { data: {}, body: raw };
	/** @type {Record<string, any>} */
	const data = {};
	let currentKey = null;
	for (const line of m[1].split(/\r?\n/)) {
		const listItem = /^\s*-\s+(.*)$/.exec(line);
		if (listItem && currentKey) {
			if (!Array.isArray(data[currentKey])) data[currentKey] = [];
			data[currentKey].push(stripQuotes(listItem[1]));
			continue;
		}
		const kv = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
		if (!kv) continue;
		const key = kv[1];
		let val = kv[2].trim();
		if (val === '') {
			currentKey = key;
			data[key] = [];
			continue;
		}
		currentKey = null;
		if (/^\[.*\]$/.test(val)) {
			data[key] = val
				.slice(1, -1)
				.split(',')
				.map((s) => stripQuotes(s.trim()))
				.filter(Boolean);
		} else if (val === 'true' || val === 'false') {
			data[key] = val === 'true';
		} else {
			data[key] = stripQuotes(val);
		}
	}
	return { data, body: m[2] };
}

/**
 * 將 2025-07-24 轉成「2025 年 07 月 24 日」。
 * @param {string} date
 */
function formatDate(date) {
	const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(date || ''));
	if (!m) return String(date || '');
	return `${m[1]} 年 ${m[2]} 月 ${m[3]} 日`;
}

/**
 * 粗估字數：中文字 + 英數詞。
 * @param {string} body
 */
function countWords(body) {
	const text = body
		.replace(/```[\s\S]*?```/g, '')
		.replace(/`[^`]*`/g, '')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, '')
		.replace(/[#>*_\-[\]()!]/g, ' ');
	const cjk = (text.match(/[一-鿿]/g) || []).length;
	const words = (text.match(/[A-Za-z0-9]+/g) || []).length;
	return cjk + words;
}

/** @type {Post[]} */
export const posts = Object.entries(files)
	.map(([path, raw]) => {
		const slug = (path.split('/').pop() || '').replace(/\.md$/, '');
		const { data, body } = parseFrontmatter(/** @type {string} */ (raw));
		const wordCount = countWords(body);
		return {
			slug,
			title: data.title || slug,
			date: data.date || '',
			dateLabel: formatDate(data.date),
			cover: data.cover || '/imgs/cover-default.png',
			excerpt: data.excerpt || '',
			tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
			pinned: data.pinned === true,
			wordCount,
			wordsLabel: `${wordCount} 個字`,
			body
		};
	})
	.sort((a, b) => {
		if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
		return b.date.localeCompare(a.date);
	});

/** 不含內文的精簡列表（給列表頁 / 側欄用）。 */
export const postList = posts.map(({ body, ...meta }) => meta);

/** @param {string} slug */
export function getPostBySlug(slug) {
	return posts.find((p) => p.slug === slug);
}

/** 所有標籤（依出現次數排序）。 */
export const allTags = (() => {
	/** @type {Map<string, number>} */
	const counts = new Map();
	for (const p of posts) for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
	return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag, count]) => ({ tag, count }));
})();

/** 熱門文章（目前以置頂 + 最新為準，取前 N 篇）。 */
export function getFeatured(n = 3) {
	return postList.slice(0, n);
}
