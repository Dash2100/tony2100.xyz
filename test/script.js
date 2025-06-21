/**
 * @fileoverview 部落格文章系統 - 主要 JavaScript 文件
 * @description 提供文章列表顯示、文章詳細頁面切換、動畫效果控制等功能
 * @author Tony2100
 * @version 1.0.0
 * @since 2025-06-15
 * @requires data.js - 文章資料檔案
 */

// ===== 應用狀態管理 =====

/**
 * 當前視圖狀態
 * @type {string} 當前顯示的頁面狀態
 * @enum {string}
 * @readonly
 */
const VIEW_STATES = {
    LIST: 'list',      // 顯示文章列表頁面
    ARTICLE: 'article' // 顯示文章詳細頁面
};

/**
 * 當前視圖狀態
 * @type {string} 目前顯示的頁面狀態，預設為列表頁面
 */
let currentView = VIEW_STATES.LIST;

/**
 * 當前選中的文章物件
 * @type {Object|null} 選中的文章資料，若無選中則為 null
 */
let selectedArticle = null;

/**
 * 動畫執行狀態旗標
 * @type {boolean} true 表示正在執行動畫，用於防止重複觸發
 */
let isAnimating = false;

// ===== 核心功能函數 =====

/**
 * 初始化應用程式
 * @description 在 DOM 載入完成後自動執行，啟動應用程式
 * @returns {void}
 */
function initializeApp() {
    renderPosts();
}

/**
 * 渲染文章列表
 * @description 將所有文章資料轉換為 HTML 卡片並插入到頁面中
 * @returns {void}
 */
function renderPosts() {
    const postContainer = document.getElementById('postContainer');

    // 清空容器內容
    postContainer.innerHTML = '';

    // 遍歷所有文章，為每篇文章創建卡片
    articles.forEach((article, index) => {
        const postCard = createPostCard(article, index);
        postContainer.appendChild(postCard);
    });
}

/**
 * 創建文章卡片元素
 * @description 根據文章資料創建對應的 DOM 元素
 * @param {Object} article - 文章資料物件
 * @param {number} index - 卡片在列表中的索引位置
 * @returns {HTMLElement} 創建的文章卡片 DOM 元素
 */
function createPostCard(article, index) {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.setAttribute('data-index', index);
    postCard.setAttribute('data-id', article.id);
    postCard.onclick = () => openArticle(article.id, index, postCard);

    // 重置所有可能存在的動畫樣式，確保卡片處於初始狀態
    resetCardStyles(postCard);

    // 設定卡片的 HTML 內容
    postCard.innerHTML = `
        <p class="post-date">${article.date}</p>
        <p class="post-title">${article.title}</p>
        <p class="post-subtitle">${article.subtitle}</p>
        <div class="post-tags">
            ${article.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
        </div>
    `;

    return postCard;
}

/**
 * 重置卡片樣式
 * @description 清除卡片上所有動畫相關的樣式設定
 * @param {HTMLElement} card - 要重置的卡片元素
 * @returns {void}
 */
function resetCardStyles(card) {
    const stylesToReset = [
        'position', 'top', 'left', 'width', 'zIndex',
        'transition', 'opacity', 'transform', 'display'
    ];

    stylesToReset.forEach(style => {
        card.style[style] = '';
    });
}

/**
 * 開啟文章詳細頁面
 * @description 執行從列表頁面切換到文章詳細頁面的動畫和狀態轉換
 * @param {number} articleId - 文章的唯一識別碼
 * @param {number} cardIndex - 卡片在列表中的索引位置
 * @param {HTMLElement} cardElement - 被點擊的卡片 DOM 元素
 * @returns {void}
 */
function openArticle(articleId, cardIndex, cardElement) {
    // 防止在文章模式或動畫執行中重複觸發
    if (currentView === VIEW_STATES.ARTICLE || isAnimating) return;

    // 設置動畫狀態，防止重複點擊
    isAnimating = true;
    currentView = VIEW_STATES.ARTICLE;

    // 根據 ID 找到對應的文章資料
    selectedArticle = articles.find(article => article.id === articleId);

    // 如果找不到文章，重置狀態並退出
    if (!selectedArticle) {
        resetAnimationState();
        return;
    }

    // 執行開啟文章動畫
    executeOpenAnimation(cardIndex, cardElement);
}

/**
 * 執行開啟文章動畫
 * @description 處理文章開啟時的所有動畫邏輯
 * @param {number} cardIndex - 卡片索引
 * @param {HTMLElement} cardElement - 卡片元素
 * @returns {void}
 */
function executeOpenAnimation(cardIndex, cardElement) {
    const elements = getPageElements();
    const allCards = document.querySelectorAll('.post-card');

    // 記錄被點擊卡片的原始位置和尺寸
    const originalRect = cardElement.getBoundingClientRect();

    // 第一階段：淡出其他卡片
    fadeOutOtherCards(allCards, cardIndex);

    // 第二階段：等待淡出完成後設置選中卡片動畫
    setTimeout(() => {
        hideOtherCards(allCards, cardIndex);
        setupSelectedCardAnimation(cardElement, originalRect);

        // 第三階段：執行滾動和卡片移動動畫
        setTimeout(() => {
            executeCardMovement(cardElement);
        }, 50);

        // 第四階段：完成動畫並切換到文章模式
        setTimeout(() => {
            completeOpenAnimation(cardElement, elements);
        }, 650);

    }, 200);
}

/**
 * 淡出其他卡片
 * @description 讓非選中的卡片執行淡出動畫
 * @param {NodeList} allCards - 所有卡片元素
 * @param {number} selectedIndex - 被選中的卡片索引
 * @returns {void}
 */
function fadeOutOtherCards(allCards, selectedIndex) {
    allCards.forEach((card, index) => {
        if (index !== selectedIndex) {
            card.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            card.style.pointerEvents = 'none';
        }
    });
}

/**
 * 隱藏其他卡片
 * @description 完全隱藏已淡出的卡片
 * @param {NodeList} allCards - 所有卡片元素
 * @param {number} selectedIndex - 被選中的卡片索引
 * @returns {void}
 */
function hideOtherCards(allCards, selectedIndex) {
    allCards.forEach((card, index) => {
        if (index !== selectedIndex) {
            card.style.display = 'none';
        }
    });
}

/**
 * 設置選中卡片動畫
 * @description 為選中的卡片設置固定定位和動畫屬性
 * @param {HTMLElement} cardElement - 選中的卡片元素
 * @param {DOMRect} originalRect - 卡片原始位置和尺寸
 * @returns {void}
 */
function setupSelectedCardAnimation(cardElement, originalRect) {
    cardElement.style.position = 'fixed';
    cardElement.style.top = originalRect.top + 'px';
    cardElement.style.left = originalRect.left + 'px';
    cardElement.style.width = originalRect.width + 'px';
    cardElement.style.margin = '0';
    cardElement.style.zIndex = '100';
    cardElement.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    cardElement.style.cursor = 'default';
}

/**
 * 執行卡片移動動畫
 * @description 讓卡片移動到頂部並滾動頁面
 * @param {HTMLElement} cardElement - 要移動的卡片元素
 * @returns {void}
 */
function executeCardMovement(cardElement) {
    // 平滑滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 移動卡片到頂部
    cardElement.style.top = '50px';
}

/**
 * 完成開啟動畫
 * @description 完成動畫並切換到文章模式
 * @param {HTMLElement} cardElement - 卡片元素
 * @param {Object} elements - 頁面元素集合
 * @returns {void}
 */
function completeOpenAnimation(cardElement, elements) {
    // 重置卡片的所有動畫樣式
    resetCardStyles(cardElement);

    // 將卡片移動到標題容器中
    elements.titleCardContainer.appendChild(cardElement);
    elements.titleCardContainer.style.display = 'block';

    // 切換文章區域到文章模式
    elements.postArea.classList.add('article-mode');

    // 載入並顯示文章內容
    elements.contentArea.innerHTML = selectedArticle.content;
    elements.contentArea.classList.add('visible');
    elements.backButton.classList.add('visible');

    // 動畫完成，重置狀態
    isAnimating = false;
}

/**
 * 返回文章列表頁面
 * @description 執行從文章詳細頁面返回到列表頁面的動畫和狀態轉換
 * @returns {void}
 */
function goBack() {
    // 防止在列表模式或動畫執行中重複觸發
    if (currentView === VIEW_STATES.LIST || isAnimating) return;

    // 設置動畫狀態
    isAnimating = true;

    const elements = getPageElements();
    const selectedCard = elements.titleCardContainer.querySelector('.post-card');

    // 第一階段：隱藏文章內容和返回按鈕
    hideArticleContent(elements);

    // 第二階段：為選中的卡片添加淡出效果
    fadeOutSelectedCard(selectedCard);

    // 第三階段：重置頁面佈局並重新渲染
    setTimeout(() => {
        resetToListMode(elements, selectedCard);

        // 第四階段：300ms延遲後重新渲染所有文章卡片
        setTimeout(() => {
            renderPostsWithAnimation();
        }, 100); // 修正延遲時間

    }, 350);
}

/**
 * 隱藏文章內容
 * @description 隱藏文章內容和返回按鈕
 * @param {Object} elements - 頁面元素集合
 * @returns {void}
 */
function hideArticleContent(elements) {
    elements.contentArea.classList.remove('visible');
    elements.backButton.classList.remove('visible');
}

/**
 * 淡出選中的卡片
 * @description 為選中的卡片添加淡出動畫
 * @param {HTMLElement|null} selectedCard - 選中的卡片元素
 * @returns {void}
 */
function fadeOutSelectedCard(selectedCard) {
    if (selectedCard) {
        selectedCard.style.transition = 'all 0.3s ease-out';
        selectedCard.style.opacity = '0';
        selectedCard.style.transform = 'translateY(-20px)';
    }
}

/**
 * 重置到列表模式
 * @description 退出文章模式並清理相關元素
 * @param {Object} elements - 頁面元素集合
 * @param {HTMLElement|null} selectedCard - 選中的卡片元素
 * @returns {void}
 */
function resetToListMode(elements, selectedCard) {
    // 退出文章模式
    elements.postArea.classList.remove('article-mode');
    elements.titleCardContainer.style.display = 'none';

    // 清理標題容器中的卡片
    if (selectedCard) {
        elements.titleCardContainer.removeChild(selectedCard);
    }

    // 清除文章內容
    elements.contentArea.innerHTML = '';
}

/**
 * 重新渲染文章並執行動畫
 * @description 重新渲染所有文章卡片並添加入場動畫
 * @returns {void}
 */
function renderPostsWithAnimation() {
    // 重新渲染所有文章卡片
    renderPosts();

    // 為新渲染的卡片設置入場動畫
    const newCards = document.querySelectorAll('.post-card');

    // 設置卡片的初始狀態（隱藏且向下偏移）
    newCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
    });

    // 短暫延遲後開始淡入動畫
    setTimeout(() => {
        newCards.forEach((card, index) => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';

            // 動畫完成後清理過渡樣式
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    }, 50);

    // 完成返回動畫，重置應用狀態
    setTimeout(() => {
        resetApplicationState();
    }, 600);
}

/**
 * 重置應用狀態
 * @description 重置動畫狀態和應用程式狀態
 * @returns {void}
 */
function resetApplicationState() {
    currentView = VIEW_STATES.LIST;
    selectedArticle = null;
    isAnimating = false;
}

/**
 * 重置動畫狀態
 * @description 僅重置動畫執行狀態
 * @returns {void}
 */
function resetAnimationState() {
    isAnimating = false;
}

/**
 * 獲取頁面元素
 * @description 取得所有需要操作的頁面元素引用
 * @returns {Object} 包含所有頁面元素的物件
 */
function getPageElements() {
    return {
        postArea: document.getElementById('postArea'),
        titleCardContainer: document.getElementById('titleCardContainer'),
        contentArea: document.getElementById('contentArea'),
        backButton: document.querySelector('.back-button')
    };
}

// ===== 事件處理與應用初始化 =====

/**
 * 防止動畫執行期間的快速點擊
 * @description 在動畫執行期間攔截對卡片的點擊事件
 * @param {Event} e - 點擊事件物件
 * @returns {void}
 */
function preventAnimationInterruption(e) {
    if (isAnimating && e.target.closest('.post-card')) {
        e.preventDefault();
        e.stopPropagation();
    }
}

/**
 * DOM 內容載入完成事件處理
 * @description 確保所有 HTML 元素都已載入再執行 JavaScript
 * @returns {void}
 */
function handleDOMContentLoaded() {
    initializeApp();
}

// ===== 事件監聽器註冊 =====

// 註冊點擊事件監聽器，防止動畫期間的重複點擊
document.addEventListener('click', preventAnimationInterruption, true);

// 註冊 DOM 載入完成事件監聽器
document.addEventListener('DOMContentLoaded', handleDOMContentLoaded);