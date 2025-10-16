const post_list = document.getElementById("post-area");
const post_content = document.getElementById("post-content");

const cover_title = document.getElementById("cover-title");
const post_title = document.getElementById("post-title");
const home_cover_image = document.getElementById("home-cover-image");
const post_cover_image = document.getElementById("post-cover-image");

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

function viewPost() {
    post_list.classList.add("opacity-0", "left-[-3px]", "pointer-events-none");
    post_content.classList.remove("opacity-0", "left-3", "pointer-events-none");
    post_content.classList.add("left-0");

    cover_title.classList.add("transition-all", "duration-300", "ease-in-out");
    cover_title.classList.add("opacity-0", "pointer-events-none", "left-[-20px]");

    post_title.classList.add("transition-all", "duration-300", "ease-in-out");
    post_title.classList.remove("opacity-0", "pointer-events-none", "left-[20px]");
    post_title.classList.add("left-0");

    // cover image fade
    home_cover_image.style.opacity = "0";
    post_cover_image.style.opacity = "1";

    // wait for animation to complete before hiding
    setTimeout(() => {
        post_list.classList.add("hidden");
    }, 500);

    // reload side info
    side_info.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => {
        table_of_contents.classList.remove("hidden");
        table_of_contents.classList.add("flex");
        side_info.classList.remove("opacity-0", "pointer-events-none");
        // ensure sideinfo is visible on mobile when viewing post
        side_info.classList.remove("hidden");
    }, 200);

    scrollToTop();
};

function backToList() {
    if (post_content.classList.contains("opacity-0") || post_content.classList.contains("pointer-events-none")) {
        return;
    }

    // first remove hidden to show element, then start animation
    post_list.classList.remove("hidden");
    post_list.classList.remove("opacity-0", "left-[-3px]", "pointer-events-none");
    post_content.classList.add("opacity-0", "left-3", "pointer-events-none");
    post_content.classList.remove("left-0");

    cover_title.classList.add("transition-all", "duration-300", "ease-in-out");
    cover_title.classList.remove("opacity-0", "pointer-events-none", "left-[-20px]");
    cover_title.classList.add("left-0");

    post_title.classList.add("transition-all", "duration-300", "ease-in-out");
    post_title.classList.add("opacity-0", "pointer-events-none", "left-[20px]");
    post_title.classList.remove("left-0");

    // cover image fade
    home_cover_image.style.opacity = "1";
    post_cover_image.style.opacity = "0";

    // reload side info
    side_info.classList.add("opacity-0", "pointer-events-none");
    setTimeout(() => {
        table_of_contents.classList.remove("flex");
        table_of_contents.classList.add("hidden");
        side_info.classList.remove("opacity-0", "pointer-events-none");
    }, 220);

    scrollToTop();
};

function scrollToTop() {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 450;
    let startTime = null;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // apply easing function
        const easedProgress = easeOutCubic(progress);
        const currentPosition = startPosition + distance * easedProgress;

        window.scrollTo(0, currentPosition);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('typewriter').textContent = '';
    typeWriter();

    const postCards = document.querySelectorAll('.group.cursor-pointer');

    postCards.forEach(card => {
        card.addEventListener('click', viewPost);
    });

    // viewPost();
});