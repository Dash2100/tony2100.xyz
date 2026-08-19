/**
 * Note page controller.
 * Notes are short-form, so each one is rendered in full as a card in a feed
 * (newest first), using the same build-time Markdown transform as posts.
 */

import './nav.js';
import { notes } from './notes.js';

const feed = document.getElementById('note-feed');

function esc(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function tagItem(text) {
    return `<span class="bg-[#DBECF8] text-[#4E5969] px-2.5 py-1 xl:px-3 rounded-lg xl:rounded-[10px] text-xs sm:text-[13px] xl:text-[15px] shadow-inner flex items-center">${esc(text)}</span>`;
}

function noteCard(n) {
    const tags = (n.tags || []).map(tagItem).join('');
    return `
    <article class="w-full bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-5 sm:p-6 md:p-8 flex flex-col gap-3">
        <div class="flex flex-col gap-1.5">
            <h2 class="text-[#4E5969] text-lg md:text-2xl font-semibold noto-font leading-snug">${esc(n.title)}</h2>
            <div class="flex items-center gap-1.5 text-[#4E5969]/75 text-[13px] sm:text-sm noto-font">
                <img src="./imgs/icon/date.svg" alt="Calendar Icon" class="h-4 w-4">
                <span>${esc(n.dateText)}</span>
            </div>
        </div>
        <div class="md-content text-[15px] md:text-base">${n.html}</div>
        ${tags ? `<div class="flex gap-1.5 sm:gap-2 flex-wrap pt-1">${tags}</div>` : ''}
    </article>`;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!feed) return;
    if (!notes.length) {
        feed.innerHTML = `<p class="text-[#4E5969] noto-font text-center py-10">目前還沒有筆記。</p>`;
        return;
    }
    feed.innerHTML = notes.map(noteCard).join('');
});
