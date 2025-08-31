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
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const postCards = document.querySelectorAll('.group.cursor-pointer');
    postCards.forEach(card => {
        card.addEventListener('click', viewPost);
    });

    post_content.addEventListener('click', backToList);
});