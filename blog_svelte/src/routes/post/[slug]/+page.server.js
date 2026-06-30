import { error } from '@sveltejs/kit';
import { getPostBySlug, postList } from '$lib/posts.js';
import { renderMarkdown } from '$lib/markdown.js';

export const prerender = true;

export function entries() {
	return postList.map((p) => ({ slug: p.slug }));
}

export function load({ params }) {
	const post = getPostBySlug(params.slug);
	if (!post) throw error(404, '找不到這篇文章');
	const { html, headings } = renderMarkdown(post.body);
	const { body, ...meta } = post; // 不要把 body 傳到 client
	return { post: meta, html, headings };
}
