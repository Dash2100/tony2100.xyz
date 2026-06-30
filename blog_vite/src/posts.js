/**
 * Central post data layer.
 *
 * Every Markdown file in /posts/*.md is transformed at build time (see
 * vite.config.js) into a module whose default export is a fully-parsed post
 * object: { slug, title, subtitle, date(ISO), tags[], cover, pinned, excerpt,
 *           words, readingMinutes, toc[], html }.
 *
 * This module loads them all, normalises a few display fields and exposes
 * helpers shared by every page (home, post-list, note).
 */

const modules = import.meta.glob('/posts/*.md', { eager: true });

const DEFAULT_COVER = '/imgs/cover-default.png';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y} 年 ${m} 月 ${day} 日`;
}

/** All posts, normalised. Sorted: pinned first, then newest date first. */
export const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const p = mod.default || mod;
    const dateObj = p.date ? new Date(p.date) : new Date(0);
    return {
      ...p,
      cover: p.cover || DEFAULT_COVER,
      dateObj,
      dateText: formatDate(p.date),
      wordsText: `${p.words ?? 0} 個字`,
      _path: path,
    };
  })
  .sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.dateObj - a.dateObj;
  });

/** Posts strictly by date (newest first), ignoring the pinned flag. */
export const postsByDate = [...posts].sort((a, b) => b.dateObj - a.dateObj);

/** Look up a single post by its slug. */
export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug) || null;
}

/** Distinct tags with counts, most-used first. */
export function getAllTags() {
  const counts = new Map();
  for (const p of posts) {
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Filter helper. `tag` of null / 'all' returns everything (pinned-first order). */
export function filterByTag(tag) {
  if (!tag || tag === 'all') return posts;
  return posts.filter((p) => p.tags.includes(tag));
}

/** Top N most-recent posts (used by the sidebar "熱門文章" widget). */
export function getFeatured(limit = 3) {
  const pinned = posts.filter((p) => p.pinned);
  const rest = postsByDate.filter((p) => !p.pinned);
  return [...pinned, ...rest].slice(0, limit);
}
