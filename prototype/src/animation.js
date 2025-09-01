const post_list = document.getElementById("post-area");
const post_content = document.getElementById("post-content");

const cover_title = document.getElementById("cover-title");
const post_title = document.getElementById("post-title");
const home_cover_image = document.getElementById("home-cover-image");
const post_cover_image = document.getElementById("post-cover-image");

function viewPost() {
    post_list.classList.add("opacity-0", "left-[-3px]", "pointer-events-none");
    post_content.classList.remove("opacity-0", "left-3", "pointer-events-none");
    post_content.classList.add("left-0");

    cover_title.classList.add("transition-all", "duration-300", "ease-in-out");
    cover_title.classList.add("opacity-0", "pointer-events-none", "left-[-20px]");

    post_title.classList.add("transition-all", "duration-300", "ease-in-out");
    post_title.classList.remove("opacity-0", "pointer-events-none", "left-[20px]");
    post_title.classList.add("left-0");

    // 淡出淡入切換封面圖片
    home_cover_image.style.opacity = "0";
    post_cover_image.style.opacity = "1";

    scrollToTop();
};

function backToList() {
    post_list.classList.remove("opacity-0", "left-[-3px]", "pointer-events-none");
    post_content.classList.add("opacity-0", "left-3", "pointer-events-none");
    post_content.classList.remove("left-0");

    cover_title.classList.add("transition-all", "duration-300", "ease-in-out");
    cover_title.classList.remove("opacity-0", "pointer-events-none", "left-[-20px]");
    cover_title.classList.add("left-0");

    post_title.classList.add("transition-all", "duration-300", "ease-in-out");
    post_title.classList.add("opacity-0", "pointer-events-none", "left-[20px]");
    post_title.classList.remove("left-0");

    // 淡出淡入切換回原始封面圖片
    home_cover_image.style.opacity = "1";
    post_cover_image.style.opacity = "0";

    scrollToTop();
};

function scrollToTop() {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 500;
    let startTime = null;

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // 套用 easing 函數
        const easedProgress = easeOutCubic(progress);
        const currentPosition = startPosition + distance * easedProgress;

        window.scrollTo(0, currentPosition);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

document.addEventListener('DOMContentLoaded', function () {
    const postCards = document.querySelectorAll('.group.cursor-pointer');
    postCards.forEach(card => {
        card.addEventListener('click', viewPost);
    });

    // 為 cover image 區域添加點擊返回功能
    const coverImage = document.querySelector('.relative.w-full.h-\\[200px\\]');
    if (coverImage) {
        coverImage.addEventListener('click', backToList);
        coverImage.style.cursor = 'pointer';
    }
});