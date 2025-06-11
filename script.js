const texts = [
    "每個成功的男人背後，都有一條脊椎",
    "如果你願意多花一點時間了解我，你會發現多花了一點時間",
    "我覺得這件事撇除不好玩的部分，其實都蠻好玩的",
    "我能預測未來，比如你看完這句話後會看下一句話",
    "如果你現在在看手機，說明你手機在你手上",
    "如果覺得冷，就蹲在牆角，因為那裡有90度",
    "在哪裡跌倒，就在那裡哭",
    "不努力一下，你怎麼會知道什麼叫做絕望",
    "每天喝一罐10%的蘋果汁，10天後你就吃了一顆蘋果",
    "遇見我是你的榮幸，遇見你是我的不幸",
    "你有什麼不開心的事? 講出來讓大家開心一下嘛",
    "研表究明，手機長期不充電，就會沒電",
    "只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶",
    "台灣競爭力低落，在美國就連小學生都會說流利的英語",
    "經證實，人在清醒的時候通常都沒在睡覺"
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

    setTimeout(typeWriter, isDeleting ? backspaceSpeed : typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('typewriter').textContent = '';
    typeWriter();
});