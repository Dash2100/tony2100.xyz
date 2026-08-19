/**
 * Post list page controller.
 * Renders every post as a card (linking to the in-place reader on index.html)
 * and a tag filter bar. Supports ?tag=<tag> deep links from the home sidebar.
 */

import './nav.js';
import { posts, getAllTags, filterByTag } from './posts.js';

const filterBar = document.getElementById('tag-filter');
const listEl = document.getElementById('post-list');

let activeTag = 'all';

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

function tagIcon(icon, text) {
    return `<span class="bg-[#DBECF8] text-[#4E5969] px-2.5 py-1 xl:px-3 rounded-lg xl:rounded-[10px] text-xs sm:text-[13px] xl:text-[15px] shadow-inner flex items-center gap-1"><img src="${esc(icon)}" alt="Tag Icon" class="h-3 w-3 xl:h-4 xl:w-4" />${esc(text)}</span>`;
}

function cardHTML(p) {
    const tags = [
        p.pinned ? tagIcon('./imgs/icon/pin.svg', '置頂') : '',
        ...p.tags.map(tagItem),
    ].join('');

    return `
    <a href="./index.html?p=${encodeURIComponent(p.slug)}"
        class="w-full bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 xl:py-8 xl:px-9 flex flex-col xl:flex-row justify-between group cursor-pointer hover:bg-[#F0F8FF] transition-colors duration-300">
        <div class="w-full xl:w-70 aspect-video bg-[#DBECF8] rounded-[20px] shadow-inner overflow-hidden shrink-0 order-1 xl:order-2">
            <img src="${esc(p.cover)}" alt="${esc(p.title)}"
                class="w-full h-full object-cover transition-transform duration-300 ease-in-out lg:group-hover:scale-[1.02]">
        </div>
        <div class="flex flex-col justify-between flex-1 gap-2 sm:gap-3 mt-1 xl:mt-0 order-2 xl:order-1">
            <div class="flex flex-col gap-1.5 sm:gap-2">
                <h2 class="text-[#4E5969] text-base sm:text-lg md:text-[22px] xl:text-[25px] font-medium noto-font leading-snug">${esc(p.title)}</h2>
                <div class="flex flex-wrap lg:flex-nowrap gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 mt-0.5 sm:mt-1 mb-1 sm:mb-2 items-center">
                    <div class="flex items-center gap-1 sm:gap-1.5">
                        <img src="./imgs/icon/date.svg" alt="Calendar Icon" class="h-4 w-4 sm:h-5 sm:w-5">
                        <p class="text-[#4E5969] text-[13px] sm:text-sm xl:text-[15px] noto-font font-medium">${esc(p.dateText)}</p>
                    </div>
                    <div class="w-0.5 h-3.5 xl:h-4 bg-[#4E5969] hidden lg:block"></div>
                    <div class="flex items-center gap-1 sm:gap-1.5">
                        <img src="./imgs/icon/words.svg" alt="Word Count Icon" class="h-4 w-4 sm:h-5 sm:w-5">
                        <p class="text-[#4E5969] text-[13px] sm:text-sm xl:text-[15px] noto-font font-medium">${esc(p.wordsText)}</p>
                    </div>
                </div>
            </div>
            <div class="flex gap-1.5 sm:gap-2 w-full flex-wrap mt-auto pt-1.5 sm:pt-2 xl:pt-0">${tags}</div>
        </div>
    </a>`;
}

function pill(label, tag, count) {
    const isActive = tag === activeTag;
    const base = "px-3 md:px-4 py-1.5 noto-font text-sm md:text-base border rounded-[10px] shadow-inner w-fit transition-all duration-200 ease-in-out cursor-pointer";
    const active = "bg-[#2D739A] text-white border-[#2D739A]";
    const idle = "bg-[#f7fafd] text-[#4E5969] border-[#4E5969]/20 hover:bg-[#DBECF8]";
    const badge = count == null ? '' : ` <span class="opacity-70">${count}</span>`;
    return `<button type="button" data-tag="${esc(tag)}" class="${base} ${isActive ? active : idle}">${esc(label)}${badge}</button>`;
}

function renderFilter() {
    if (!filterBar) return;
    const total = posts.length;
    const pills = [pill('全部', 'all', total)]
        .concat(getAllTags().map(({ tag, count }) => pill(tag, tag, count)));
    filterBar.innerHTML = pills.join('');
}

function renderList() {
    if (!listEl) return;
    const items = filterByTag(activeTag);
    if (!items.length) {
        listEl.innerHTML = `<p class="text-[#4E5969] noto-font text-center py-10">這個標籤底下還沒有文章。</p>`;
        return;
    }
    listEl.innerHTML = items.map(cardHTML).join('');
}

function setTag(tag, push = true) {
    activeTag = tag || 'all';
    renderFilter();
    renderList();
    const url = activeTag === 'all'
        ? location.pathname
        : `?tag=${encodeURIComponent(activeTag)}`;
    if (push) history.replaceState({}, '', url);
}

document.addEventListener('DOMContentLoaded', () => {
    const initial = new URLSearchParams(location.search).get('tag');
    activeTag = initial || 'all';

    renderFilter();
    renderList();

    filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-tag]');
        if (!btn) return;
        setTag(btn.dataset.tag);
    });
});
