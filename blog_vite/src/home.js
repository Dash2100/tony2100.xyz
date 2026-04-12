const post_list = document.getElementById("post-area");
const post_content = document.getElementById("post-content");

const cover_title = document.getElementById("cover-title");
const post_title = document.getElementById("post-title");
const home_cover_image = document.getElementById("home-cover-image");
const post_cover_image = document.getElementById("post-cover-image");
const post_backtolist = document.getElementById("post-backtolist");

const sidebarWidgets = document.getElementById('sidebar-widgets');
const side_info = document.getElementById("side-info");
const table_of_contents = document.getElementById("table-of-contents");

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

    // if it's a space character, don't add delay
    let delay = typeSpeed;
    if (isDeleting) {
        const currentChar = currentText.charAt(charIndex);
        delay = currentChar === ' ' ? 0 : backspaceSpeed;
    }

    setTimeout(typeWriter, delay);
}

// [重構]：動態時長的 Smooth Scroll (避免長距離滑動過快)
function premiumSmoothScrollToTop() {
    const startY = window.scrollY;
    if (startY === 0) return;

    // 根據滑動距離動態計算時間，確保速度不會過於誇張，限制在 500ms 到 1200ms 之間
    const duration = Math.min(Math.max(startY * 0.3, 500), 1200);
    let startTime = null;

    // 數學公式：EaseOutQuart (平滑減速，手感自然)
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    function scrollStep(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        let progress = timeElapsed / duration;
        if (progress > 1) progress = 1;

        window.scrollTo(0, startY * (1 - easeOutQuart(progress)));

        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }
    requestAnimationFrame(scrollStep);
}

// 狀態切換函數
function switchState(element, newClass) {
    if (!element) return;
    element.classList.remove('is-active', 'slide-left', 'slide-right');
    element.classList.add(newClass);
}

function viewPost() {
    // 1. 舊畫面往左推
    switchState(post_list, 'slide-left');
    switchState(sidebarWidgets, 'slide-left');

    // 2. 新畫面滑入中央
    switchState(post_content, 'is-active');
    switchState(table_of_contents, 'is-active');

    // 3. 封面過渡
    home_cover_image.classList.add('cover-hidden');
    cover_title.classList.add('cover-hidden');
    post_cover_image.classList.remove('cover-hidden');
    post_title.classList.remove('cover-hidden');
    post_backtolist.classList.remove('cover-hidden');

    // 觸發高階平滑滾動
    premiumSmoothScrollToTop();
};

function backToList() {
    // 1. 文章畫面往右退
    switchState(post_content, 'slide-right');
    switchState(table_of_contents, 'slide-right');

    // 2. 列表畫面滑入中央
    switchState(post_list, 'is-active');
    switchState(sidebarWidgets, 'is-active');

    // 3. 封面過渡還原
    post_cover_image.classList.add('cover-hidden');
    post_title.classList.add('cover-hidden');
    post_backtolist.classList.add('cover-hidden');
    home_cover_image.classList.remove('cover-hidden');
    cover_title.classList.remove('cover-hidden');

    // 觸發高階平滑滾動
    premiumSmoothScrollToTop();
};

window.backToList = backToList;
window.viewPost = viewPost;

document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        typewriterElement.textContent = '';
        typeWriter();
    }

    const postCards = document.querySelectorAll('.group.cursor-pointer');

    postCards.forEach(card => {
        card.addEventListener('click', viewPost);
    });
});