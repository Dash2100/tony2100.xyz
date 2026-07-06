// Blog editor — Vite dev server with a built-in file API that reads/writes the
// blog's markdown sources directly (../posts, ../notes, ../public/imgs/covers).
// Saving in the editor IS publishing: the .md files land in the blog project.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, join } from 'node:path';
import {
  readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync, mkdirSync,
} from 'node:fs';
import matter from 'gray-matter';

const BLOG_ROOT = resolve(__dirname, '..');
const DIRS = {
  posts: join(BLOG_ROOT, 'posts'),
  notes: join(BLOG_ROOT, 'notes'),
};
const COVERS_DIR = join(BLOG_ROOT, 'public', 'imgs', 'covers');
const COVERS_URL = '/imgs/covers';

const okType = (t) => t === 'posts' || t === 'notes';
const okSlug = (s) => typeof s === 'string' && /^[a-z0-9][a-z0-9_-]{0,80}$/i.test(s);
const okImgName = (s) =>
  typeof s === 'string' && /^[a-z0-9][a-z0-9_.-]{0,80}\.(png|jpe?g|webp|gif)$/i.test(s);

function send(res, code, data) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolvePromise, reject) => {
    let body = '';
    req.on('data', (c) => {
      body += c;
      if (body.length > 30 * 1024 * 1024) reject(new Error('body too large'));
    });
    req.on('end', () => {
      try {
        resolvePromise(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function listItems(type) {
  const dir = DIRS[type];
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const raw = readFileSync(join(dir, f), 'utf8');
      const { data, content } = matter(raw);
      return { slug, data: normalizeData(data), excerptSource: content.slice(0, 200) };
    })
    .sort((a, b) => String(b.data.date || '').localeCompare(String(a.data.date || '')));
}

// Dates in frontmatter may parse as JS Date objects — flatten to YYYY-MM-DD
// strings so the client always deals with plain data.
function normalizeData(data) {
  const d = { ...data };
  if (d.date instanceof Date && !isNaN(d.date)) {
    d.date = d.date.toISOString().slice(0, 10);
  } else if (d.date != null) {
    d.date = String(d.date).slice(0, 10);
  }
  return d;
}

function contentApi() {
  return {
    name: 'blog-content-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();
        const url = new URL(req.url, 'http://localhost');
        const type = url.searchParams.get('type');
        const slug = url.searchParams.get('slug');

        try {
          /* ---- GET /api/items?type=posts|notes — list everything ---- */
          if (url.pathname === '/api/items' && req.method === 'GET') {
            if (!okType(type)) return send(res, 400, { error: 'bad type' });
            return send(res, 200, listItems(type));
          }

          /* ---- /api/item?type=&slug= — read / write / delete one ---- */
          if (url.pathname === '/api/item') {
            if (!okType(type) || !okSlug(slug)) {
              return send(res, 400, { error: 'bad type or slug' });
            }
            const file = join(DIRS[type], `${slug}.md`);

            if (req.method === 'GET') {
              if (!existsSync(file)) return send(res, 404, { error: 'not found' });
              const { data, content } = matter(readFileSync(file, 'utf8'));
              return send(res, 200, { slug, data: normalizeData(data), content });
            }
            if (req.method === 'PUT') {
              const body = await readBody(req);
              const data = body.data || {};
              const content = String(body.content ?? '');
              if (!existsSync(DIRS[type])) mkdirSync(DIRS[type], { recursive: true });
              writeFileSync(file, matter.stringify(`\n${content.replace(/^\n+/, '')}`, data), 'utf8');
              return send(res, 200, { ok: true });
            }
            if (req.method === 'DELETE') {
              if (existsSync(file)) unlinkSync(file);
              return send(res, 200, { ok: true });
            }
          }

          /* ---- POST /api/upload — save a cover image (base64 data URL) ---- */
          if (url.pathname === '/api/upload' && req.method === 'POST') {
            const { name, dataUrl } = await readBody(req);
            if (!okImgName(name)) return send(res, 400, { error: 'bad file name' });
            const m = /^data:image\/[a-z+]+;base64,(.+)$/i.exec(String(dataUrl || ''));
            if (!m) return send(res, 400, { error: 'bad data url' });
            if (!existsSync(COVERS_DIR)) mkdirSync(COVERS_DIR, { recursive: true });
            writeFileSync(join(COVERS_DIR, name), Buffer.from(m[1], 'base64'));
            return send(res, 200, { ok: true, path: `${COVERS_URL}/${name}` });
          }

          return send(res, 404, { error: 'not found' });
        } catch (e) {
          return send(res, 500, { error: String((e && e.message) || e) });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [contentApi(), react(), tailwindcss()],
  server: {
    port: 5199,
    // serve the blog's public assets (cover previews etc.) during editing
    proxy: {},
  },
  publicDir: join(BLOG_ROOT, 'public'),
});
