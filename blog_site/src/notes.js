/**
 * Note data layer — short-form entries living in /notes/*.md.
 * Uses the same build-time Markdown transform as posts (see vite.config.js).
 */

const modules = import.meta.glob('/notes/*.md', { eager: true });

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y} 年 ${m} 月 ${day} 日`;
}

/** All notes, newest first. */
export const notes = Object.entries(modules)
  .map(([path, mod]) => {
    const n = mod.default || mod;
    const dateObj = n.date ? new Date(n.date) : new Date(0);
    return {
      ...n,
      dateObj,
      dateText: formatDate(n.date),
      _path: path,
    };
  })
  .sort((a, b) => b.dateObj - a.dateObj);

/** Distinct note tags with counts. */
export function getNoteTags() {
  const counts = new Map();
  for (const n of notes) {
    for (const t of n.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
