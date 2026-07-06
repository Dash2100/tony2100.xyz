/** Thin client for the dev-server file API (see vite.config.js). */

async function j(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
  return body;
}

export const listItems = (type) =>
  fetch(`/api/items?type=${encodeURIComponent(type)}`).then(j);

export const getItem = (type, slug) =>
  fetch(`/api/item?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`).then(j);

export const saveItem = (type, slug, data, content) =>
  fetch(`/api/item?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, content }),
  }).then(j);

export const deleteItem = (type, slug) =>
  fetch(`/api/item?type=${encodeURIComponent(type)}&slug=${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  }).then(j);

export const uploadCover = (name, dataUrl) =>
  fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, dataUrl }),
  }).then(j);
