import { useEffect } from 'react';

/**
 * Runtime SEO for client-side navigations. Crawlers get the prerendered
 * static shells (see the seo-prerender plugin in vite.config.js); this hook
 * keeps title / description / canonical / OG in sync as the user navigates,
 * so copied links and social shares always carry the right metadata.
 */
const SITE = 'https://blog.tony2100.xyz';
const SITE_NAME = "Tony2100's Life Log";
const DEFAULT_DESC =
  'Tony2100（tony2100）的個人部落格：生活紀錄、技術筆記、前端開發心得。';
const BASE_KEYWORDS = [
  'tony2100',
  'Tony2100',
  "Tony2100's Life Log",
  '部落格',
  '技術筆記',
  '生活紀錄',
];

function upsert(selector, create, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

const byName = (name, content) =>
  upsert(`meta[name="${name}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('name', name);
    return el;
  }, content);

const byProp = (prop, content) =>
  upsert(`meta[property="${prop}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('property', prop);
    return el;
  }, content);

export default function useSeo({
  title,
  description,
  path = '/',
  keywords = [],
  image,
  type = 'website',
} = {}) {
  const kw = keywords.join('|');
  useEffect(() => {
    const fullTitle = title ? `${title}｜${SITE_NAME}` : `${SITE_NAME}｜生活紀錄與技術筆記`;
    const desc = description || DEFAULT_DESC;
    const url = SITE + path;
    const img = image
      ? image.startsWith('http')
        ? image
        : SITE + image
      : `${SITE}/imgs/home-cover.png`;

    document.title = fullTitle;
    byName('description', desc);
    byName('keywords', [...keywords, ...BASE_KEYWORDS].join(', '));
    byProp('og:title', fullTitle);
    byProp('og:description', desc);
    byProp('og:url', url);
    byProp('og:image', img);
    byProp('og:type', type);
    byName('twitter:title', fullTitle);
    byName('twitter:description', desc);
    byName('twitter:image', img);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, image, type, kw]);
}
