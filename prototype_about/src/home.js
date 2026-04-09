import './input.css';
import { initNavbarIcons } from './icons.js';

const texts = [
    "每個成功的男人背後，都有一條脊椎",
    "如果你願意多花一點時間了解我，你會發現你多花了一點時間",
    // "醫生說我有拖延症，但我決定下次再去治療",
    "我覺得這件事撇除不好玩的部分，其實都蠻好玩的",
    // "你知道嗎? 其實我也不知道",
    // "後天的努力是很重要的，所以今天跟明天先休息",
    "恭喜你！被我恭喜到了",
    "注意!!!!!!!!!!!!!     感謝你的注意。",
    "為什麼警察不直接去監獄裡抓人?",
    "在成功路上，一定有紅綠燈",
    // "在哪裡跌倒，就在哪裡睡覺",
    "每天喝一罐10%的蘋果汁，10天後你就吃了一顆蘋果",
    "如果覺得冷，就蹲在牆角，因為那裡有90度",
    "研表究明，手機長期不充電，就會沒電",
    "只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶",
    "經證實，人在清醒的時候通常都沒在睡覺",
    // "什麼是大數據，我只聽過陳樹據",
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

let toastTimeout = null;

function showToast() {
    const toast = document.getElementById('toast');

    // Clear existing timeout if user clicks again quickly
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Reset animation by briefly removing classes
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-20');

    // Force reflow to restart animation
    void toast.offsetWidth;

    // Show toast with slide-up animation
    requestAnimationFrame(() => {
        toast.classList.remove('opacity-0', 'translate-y-20', 'pointer-events-none');
        toast.classList.add('opacity-100', 'translate-y-0');
    });

    toastTimeout = setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-20', 'pointer-events-none');
        toastTimeout = null;
    }, 2000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('typewriter').textContent = '';
    typeWriter();
    initNavbarIcons();

    // Discord card click handler
    const discordCard = document.getElementById('discord-card');
    if (discordCard) {
        discordCard.addEventListener('click', (e) => {
            e.preventDefault();
            const userId = discordCard.dataset.userId;
            copyToClipboard(userId);
        });
    }
});