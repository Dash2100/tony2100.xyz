/**
 * Home page controller.
 *
 * Renders the post grid, sidebar (featured + tag cloud) and the in-place
 * article reader from the Markdown data layer (see src/posts.js), while
 * preserving the original cover typewriter and the slide view-transition UX.
 */

import './nav.js';
import { posts, getFeatured, getAllTags, getPostBySlug } from './posts.js';

/* ---------- DOM references ---------- */
const postArea = document.getElementById('post-area');
const postContent = document.getElementById('post-content');

const coverTitle = document.getElementById('cover-title');
const homeCoverImage = document.getElementById('home-cover-image');
const postCoverImage = document.getElementById('post-cover-image');
const postTitle = document.getElementById('post-title');
const postTitleMain = document.getElementById('post-title-main');
const postTitleSub = document.getElementById('post-title-sub');
const postBackToList = document.getElementById('post-backtolist');

const sidebarWidgets = document.getElementById('sidebar-widgets');
const tableOfContents = document.getElementById('table-of-contents');
const tocList = document.getElementById('toc-list');

/* ---------- Cover typewriter (unchanged) ---------- */
const texts = [
    "每個成功的男人背後，都有一條脊椎",
    "如果你願意多花一點時間了解我，你會發現你多花了一點時間",
    "我覺得這件事撇除不好玩的部分，其實都蠻好玩的",
    "注意!!!!!!!!!!!!!     感謝你的注意。",
    "為什麼警察不直接去監獄裡抓人?",
    "在成功路上，一定有紅綠燈",
    "在哪裡跌倒，就在哪裡睡覺",
    "每天喝一罐10%的蘋果汁，10天後你就吃了一顆蘋果",
    "你有什麼不開心的事? 講出來讓大家開心一下嘛",
    "如果你現在在看手機，代表你手機在你手上",
    "如果覺得冷，就蹲在牆角，因為那裡有90度",
    "研表究明，手機長期不充電，就會沒電",
    "只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶",
    "經證實，人在清醒的時候通常都沒在睡覺",
    "什麼是大數據，我只聽過陳樹據",
    "我能預測未來，比如你看完這句話後會看下一句話"
];

const typeSpeed = 80;
const backspaceSpeed = 50;
const pauseTime = 1000;

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const container = document.getElementById('typewriter');
    if (!container) return;
    const currentText = texts[textIndex];

    container.textContent = currentText.substring(0, isDeleting ? charIndex-- : charIndex++);

    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
    }

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, pauseTime);
    }

    let delay = typeSpeed;
    if (isDeleting) {
        const currentChar = currentText.charAt(charIndex);
        delay = currentChar === ' ' ? 0 : backspaceSpeed;
    }

    setTimeout(typeWriter, delay);
}

/* ---------- Dynamic-duration smooth scroll to top (unchanged) ---------- */
function premiumSmoothScrollToTop() {
    const startY = window.scrollY;
    if (startY === 0) return;
    const duration = Math.min(Math.max(startY * 0.3, 500), 1200);
    let startTime = null;
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function scrollStep(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        let progress = timeElapsed / duration;
        if (progress > 1) progress = 1;
        window.scrollTo(0, startY * (1 - easeOutQuart(progress)));
        if (progress < 1) requestAnimationFrame(scrollStep);
    }
    requestAnimationFrame(scrollStep);
}

/* ---------- HTML helpers ---------- */
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

function postCardHTML(p) {
    const tags = [
        p.pinned ? tagIcon('./imgs/icon/pin.svg', '置頂') : '',
        ...p.tags.map(tagItem),
    ].join('');

    return `
    <div data-slug="${esc(p.slug)}"
        class="pv-text delay-1 w-full h-full xl:h-auto bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 xl:py-8 xl:px-9 flex flex-col xl:flex-row justify-between group cursor-pointer hover:bg-[#F0F8FF] transition-colors duration-300">
        <div class="w-full xl:w-70 aspect-video bg-[#DBECF8] rounded-[20px] shadow-inner overflow-hidden shrink-0 order-1 xl:order-2">
            <img src="${esc(p.cover)}" alt="${esc(p.title)}"
                class="w-full h-full object-cover transition-transform duration-300 ease-in-out lg:group-hover:scale-[1.02]">
        </div>
        <div class="flex flex-col justify-between flex-1 gap-2 sm:gap-3 mt-1 xl:mt-0 order-2 xl:order-1">
            <div class="flex flex-col gap-1.5 sm:gap-2">
                <h1 class="text-[#4E5969] text-base sm:text-lg md:text-[22px] xl:text-[25px] font-medium noto-font leading-snug">${esc(p.title)}</h1>
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
    </div>`;
}

/* ---------- Render: post grid ---------- */
function renderPosts() {
    if (!postArea) return;
    if (!posts.length) {
        postArea.innerHTML = `<p class="text-[#4E5969] noto-font p-6">目前還沒有文章。</p>`;
        return;
    }
    postArea.innerHTML = posts.map(postCardHTML).join('');
}

/* ---------- Render: sidebar (featured + tag cloud) ---------- */
function renderSidebar() {
    if (!sidebarWidgets) return;

    const featured = getFeatured(3).map(p => `
        <div data-slug="${esc(p.slug)}"
            class="flex flex-col border border-[#4E5969]/20 w-full px-4 py-2.5 rounded-[15px] shadow-inner gap-0.5 cursor-pointer hover:bg-[#DBECF8] transition-all duration-200 ease-in-out">
            <p class="text-[#4E5969] text-[15px] noto-font truncate">${esc(p.title)}</p>
            <div class="flex gap-1">
                <img src="./imgs/icon/date.svg" alt="Calendar Icon" class="h-4 w-4 my-auto">
                <p class="text-[#4E5969] text-[13px] noto-font">${esc(p.dateText)}</p>
            </div>
        </div>`).join('');

    const tags = getAllTags().map(({ tag, count }) => `
        <a href="./post-list.html?tag=${encodeURIComponent(tag)}"
            class="text-[#4E5969] text-sm md:text-base px-3 md:px-4 py-1 noto-font border border-[#4E5969]/20 rounded-[10px] shadow-inner w-fit hover:bg-[#DBECF8] transition-all duration-200 ease-in-out cursor-pointer">${esc(tag)} <span class="opacity-60">${count}</span></a>`).join('');

    sidebarWidgets.innerHTML = `
        <div class="w-full h-fit bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-6 flex flex-col gap-4">
            <div class="flex justify-between items-center">
                <h2 class="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">熱門文章</h2>
                <a href="./post-list.html" class="text-[#4E5969] text-xs md:text-sm font-semibold noto-font border border-[#4E5969]/20 px-3 md:px-4 rounded-[10px] shadow-inner h-7 md:h-8 flex items-center hover:bg-[#DBECF8] transition-all duration-200 ease-in-out">更多</a>
            </div>
            <div class="flex flex-col gap-4">${featured}</div>
        </div>
        <div class="w-full h-fit bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-6 flex flex-col gap-4">
            <h2 class="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">文章標籤</h2>
            <div class="flex flex-wrap gap-2 md:gap-3">${tags}</div>
        </div>`;
}

/* ---------- Render: table of contents ---------- */
function renderToc(toc) {
    if (!tocList) return;
    if (!toc || !toc.length) {
        tocList.innerHTML = `<p class="text-[#4E5969]/60 text-sm noto-font">（本文沒有段落標題）</p>`;
        return;
    }
    tocList.innerHTML = toc.map(item => {
        if (item.level <= 2) {
            return `<a href="#${esc(item.id)}" class="text-[#4E5969] text-lg font-bold hover:text-[#2D739A] flex items-center">
                <img src="./imgs/icon/list-arrow.svg" alt="" class="mr-1">${esc(item.text)}</a>`;
        }
        return `<a href="#${esc(item.id)}" class="text-[#4E5969] text-base font-medium hover:text-[#2D739A] ml-8">${esc(item.text)}</a>`;
    }).join('');
}

/* ---------- View transitions (preserved) ---------- */
function switchState(element, newClass) {
    if (!element) return;
    element.classList.remove('is-active', 'slide-left', 'slide-right');
    element.classList.add(newClass);
}

function viewPost() {
    switchState(postArea, 'slide-left');
    switchState(sidebarWidgets, 'slide-left');
    switchState(postContent, 'is-active');
    switchState(tableOfContents, 'is-active');

    homeCoverImage.classList.add('cover-hidden');
    coverTitle.classList.add('cover-hidden');
    postCoverImage.classList.remove('cover-hidden');
    postTitle.classList.remove('cover-hidden');
    postBackToList.classList.remove('cover-hidden');

    premiumSmoothScrollToTop();
}

function backToList(push = true) {
    switchState(postContent, 'slide-right');
    switchState(tableOfContents, 'slide-right');
    switchState(postArea, 'is-active');
    switchState(sidebarWidgets, 'is-active');

    postCoverImage.classList.add('cover-hidden');
    postTitle.classList.add('cover-hidden');
    postBackToList.classList.add('cover-hidden');
    homeCoverImage.classList.remove('cover-hidden');
    coverTitle.classList.remove('cover-hidden');

    premiumSmoothScrollToTop();
    document.title = "Tony2100's Life Log";
    if (push) history.pushState({}, '', location.pathname);
}

/* ---------- Open a post in place ---------- */
function openPost(slug, push = true) {
    const p = getPostBySlug(slug);
    if (!p) return;

    postTitleMain.textContent = p.title;
    postTitleSub.textContent = p.subtitle || '';
    postCoverImage.src = p.cover;
    postCoverImage.alt = p.title;

    const meta = `
        <div class="px-6 md:px-10 pt-6 md:pt-10 flex flex-wrap gap-x-4 gap-y-1 items-center text-[#4E5969]/75 text-sm noto-font pv-text delay-1">
            <span class="flex items-center gap-1"><img src="./imgs/icon/date.svg" alt="" class="h-4 w-4">${esc(p.dateText)}</span>
            <span class="flex items-center gap-1"><img src="./imgs/icon/words.svg" alt="" class="h-4 w-4">${esc(p.wordsText)}</span>
            <span>· 約 ${p.readingMinutes} 分鐘</span>
        </div>`;

    postContent.innerHTML = `
        <h1 class="text-[#4E5969] text-2xl md:text-3xl font-medium noto-font px-6 md:px-10 pt-6 md:pt-8 pv-text delay-1">${esc(p.title)}</h1>
        ${meta}
        <div class="px-6 md:px-10 pb-20 pt-6 md:pt-8 md-content pv-text delay-2">${p.html}</div>`;

    renderToc(p.toc);
    viewPost();
    document.title = `${p.title}｜Tony2100's Life Log`;
    if (push) history.pushState({ slug }, '', `?p=${encodeURIComponent(slug)}`);
}

/* ---------- Event wiring ---------- */
function onCardClick(e) {
    const card = e.target.closest('[data-slug]');
    if (!card) return;
    openPost(card.dataset.slug);
}

function onTocClick(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.backToList = () => backToList(true);
window.viewPost = viewPost;

window.addEventListener('popstate', (e) => {
    const slug = e.state && e.state.slug;
    if (slug) openPost(slug, false);
    else backToList(false);
});

document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    renderSidebar();

    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        typewriterElement.textContent = '';
        typeWriter();
    }

    if (postArea) postArea.addEventListener('click', onCardClick);
    if (sidebarWidgets) sidebarWidgets.addEventListener('click', onCardClick);
    if (tocList) tocList.addEventListener('click', onTocClick);

    // Deep-link: ?p=slug opens that post directly.
    const slug = new URLSearchParams(location.search).get('p');
    if (slug && getPostBySlug(slug)) openPost(slug, false);
});
