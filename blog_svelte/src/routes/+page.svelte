<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { homeClickCallback } from '$lib/stores.js';
	import PostCard from '$lib/components/PostCard.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FeaturedPost from '$lib/components/FeaturedPost.svelte';
	import TagsWidget from '$lib/components/TagsWidget.svelte';

	// --- 視圖狀態 ---
	let view = $state('list'); // 'list' | 'post'

	// --- Typewriter ---
	const texts = [
		'每個成功的男人背後，都有一條脊椎',
		'如果你願意多花一點時間了解我，你會發現你多花了一點時間',
		'我覺得這件事撇除不好玩的部分，其實都蠻好玩的',
		'注意!!!!!!!!!!!!!     感謝你的注意。',
		'為什麼警察不直接去監獄裡抓人?',
		'在成功路上，一定有紅綠燈',
		'在哪裡跌倒，就在哪裡睡覺',
		'每天喝一罐10%的蘋果汁，10天後你就吃了一顆蘋果',
		'你有什麼不開心的事? 講出來讓大家開心一下嘛',
		'如果你現在在看手機，代表你手機在你手上',
		'如果覺得冷，就蹲在牆角，因為那裡有90度',
		'研表究明，手機長期不充電，就會沒電',
		'只要每天省下買一杯奶茶的錢，十天後就能買十杯奶茶',
		'經證實，人在清醒的時候通常都沒在睡覺',
		'什麼是大數據，我只聽過陳樹據',
		'我能預測未來，比如你看完這句話後會看下一句話'
	];

	let typewriterText = $state('');
	let textIndex = 0;
	let charIndex = 0;
	let isDeleting = false;
	let typewriterTimer: ReturnType<typeof setTimeout> | null = null;

	const typeSpeed = 80;
	const backspaceSpeed = 50;
	const pauseTime = 1000;

	function typeWriter() {
		const currentText = texts[textIndex];
		if (isDeleting) {
			charIndex--;
		} else {
			charIndex++;
		}
		typewriterText = currentText.substring(0, charIndex);

		if (isDeleting && charIndex === 0) {
			isDeleting = false;
			textIndex = (textIndex + 1) % texts.length;
		}

		if (!isDeleting && charIndex === currentText.length) {
			typewriterTimer = setTimeout(() => {
				isDeleting = true;
				typeWriter();
			}, pauseTime);
			return;
		}

		const delay = isDeleting
			? currentText.charAt(charIndex) === ' '
				? 0
				: backspaceSpeed
			: typeSpeed;
		typewriterTimer = setTimeout(typeWriter, delay);
	}

	// --- Smooth Scroll ---
	function premiumSmoothScrollToTop() {
		const startY = window.scrollY;
		if (startY === 0) return;
		const duration = Math.min(Math.max(startY * 0.3, 500), 1200);
		let startTime: number | null = null;
		const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
		function scrollStep(currentTime: number) {
			if (!startTime) startTime = currentTime;
			const progress = Math.min((currentTime - startTime) / duration, 1);
			window.scrollTo(0, startY * (1 - easeOutQuart(progress)));
			if (progress < 1) requestAnimationFrame(scrollStep);
		}
		requestAnimationFrame(scrollStep);
	}

	// --- 視圖切換 ---
	function viewPost() {
		view = 'post';
		premiumSmoothScrollToTop();
	}

	function backToList() {
		view = 'list';
		premiumSmoothScrollToTop();
	}

	// --- 文章資料 ---
	type Tag = { type: 'icon'; icon: string; text: string } | { type: 'item'; text: string };
	type Post = { cover: string; title: string; date: string; words: string; tags: Tag[] };

	const posts: Post[] = [
		{
			cover: '/imgs/cover-default.png',
			title: '測試文章 1',
			date: '2025 年 07 月 24日',
			words: '5050 個字',
			tags: [
				{ type: 'icon', icon: '/imgs/icon/pin.svg', text: '置頂' },
				{ type: 'item', text: '競賽' }
			]
		},
		{
			cover: '/imgs/cover-default.png',
			title: '測試文章 2',
			date: '2025 年 07 月 25日',
			words: '3200 個字',
			tags: [{ type: 'item', text: '日常' }]
		},
		{
			cover: '/imgs/cover-default.png',
			title: '測試文章 3',
			date: '2025 年 08 月 01日',
			words: '1500 個字',
			tags: [{ type: 'item', text: '教學' }]
		},
		{
			cover: '/imgs/cover-default.png',
			title: '測試文章 4',
			date: '2025 年 08 月 15日',
			words: '2000 個字',
			tags: [{ type: 'item', text: '筆記' }]
		},
		{
			cover: '/imgs/cover-default.png',
			title: '測試文章 5',
			date: '2025 年 09 月 02日',
			words: '4100 個字',
			tags: [{ type: 'item', text: '隨筆' }]
		}
	];

	onMount(() => {
		homeClickCallback.set(backToList);
		typeWriter();
	});

	onDestroy(() => {
		homeClickCallback.set(null);
		if (typewriterTimer) clearTimeout(typewriterTimer);
	});
</script>

<svelte:head>
	<title>Tony2100's Life Log</title>
</svelte:head>

<div
	class="w-full items-center p-4 md:p-8 lg:p-16 lg:pb-16 max-w-325 mx-auto flex flex-col gap-6 md:gap-8"
>
	<!-- Cover Image Area -->
	<div
		class="relative w-full h-50 md:h-67.5 py-10 md:py-20 rounded-[25px] md:rounded-[35px] mx-auto bg-[#DBECF8] text-[#4E5969] text-[28px] md:text-[40px] leading-offset md:leading-13.75 font-bold items-center justify-center shadow-inner text-center noto-font overflow-hidden flex mt-5 md:mt-0"
	>
		<!-- Home Cover Image -->
		<img
			src="/imgs/home-cover.png"
			alt="首頁封面"
			class="absolute w-full h-full object-cover z-10 cover-element {view === 'post' ? 'cover-hidden' : 'opacity-100'}"
		/>

		<!-- Home Title -->
		<span
			class="z-50 flex-col gap-2 md:gap-4 absolute flex w-full cover-element {view === 'post' ? 'cover-hidden' : 'opacity-100'}"
		>
			<h1 class="text-3xl lg:text-4xl h-fit text-center z-10 px-4">Tony2100's Life Log</h1>
			<div class="relative w-full min-h-7 md:min-h-9 lg:min-h-12">
				<h1
					class="absolute inset-0 text-xl md:text-2xl lg:text-3xl text-center z-10 px-4 flex items-start justify-center"
				>
					{typewriterText}
				</h1>
			</div>
		</span>

		<!-- Back Button -->
		<div
			class="absolute flex gap-1.5 md:gap-3 top-3 left-3 md:top-6 md:left-6 z-50 rounded-lg md:rounded-[10px] bg-white/80 shadow-inner leading-5 md:leading-6 px-3 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-white transition-all duration-300 ease-in-out font-medium text-[#4E5969] border border-[#4E5969]/20 cover-element backdrop-blur-xl {view !== 'post' ? 'cover-hidden' : ''}"
			onclick={backToList}
			role="button"
			tabindex="0"
			onkeypress={(e) => e.key === 'Enter' && backToList()}
		>
			<img src="/imgs/icon/back.svg" alt="Back Icon" class="h-4 md:h-6 inline-block md:mr-1 my-auto" />
			<p class="my-auto text-[13px] md:text-base">返回</p>
		</div>

		<!-- Post Cover Image -->
		<img
			src="/imgs/cover-default.png"
			alt="文章封面"
			class="absolute w-full h-full object-cover z-10 cover-element blur-2xl {view !== 'post' ? 'cover-hidden' : ''}"
		/>

		<!-- Post Title -->
		<span
			class="z-50 flex-col gap-4 absolute flex w-full left-0 md:left-5 cover-element select-text {view !== 'post' ? 'cover-hidden' : ''}"
		>
			<h1 class="text-2xl md:text-3xl lg:text-4xl h-fit text-center z-10 px-4">這是一個中文的標題文字</h1>
			<h1 class="text-lg md:text-2xl lg:text-3xl h-fit text-center z-10 px-4">Haaaaiiyaaaaaaaaa</h1>
		</span>
	</div>

	<!-- Posts and SideInfo -->
	<div class="w-full flex xl:flex-row flex-col gap-6 relative items-start">

		<!-- Posts Grid -->
		<div class="view-wrapper xl:flex-1 min-w-0">
			<div
				class="view-container {view === 'list' ? 'is-active' : 'slide-left'} grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-col gap-4 sm:gap-5"
			>
				{#each posts as post (post.title)}
					<PostCard
						cover={post.cover}
						title={post.title}
						date={post.date}
						words={post.words}
						tags={post.tags}
						onclick={viewPost}
					/>
				{/each}
			</div>

			<!-- Post Content -->
			<div
				class="view-container {view === 'post' ? 'is-active' : 'slide-right'} w-full min-h-[calc(100vh-200px)] bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] mb-24"
			>
				<h1 class="text-[#4E5969] text-2xl md:text-3xl font-medium noto-font p-6 md:p-10 pv-text delay-1">
					這是一個中文的標題文字
				</h1>
				<div class="px-6 md:px-10 pb-20">
					<p class="text-[#4E5969] text-base md:text-lg noto-font leading-relaxed mb-4 pv-text delay-2">
						這裡是文章內容...
					</p>
				</div>
			</div>
		</div>

		<!-- Side Info Section -->
		<div
			class="flex flex-col gap-6 sticky top-4 self-start w-full xl:w-75 z-20 h-fit shrink-0"
		>
			<div class="view-wrapper w-full">
				<!-- Sidebar Widgets -->
				<div class="view-container {view === 'list' ? 'is-active' : 'slide-left'} flex flex-col gap-6 w-full">
					<FeaturedPost />
					<TagsWidget />
				</div>

				<!-- 目錄 -->
				<div
					class="view-container {view === 'post' ? 'is-active' : 'slide-right'} w-full h-fit bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-4 md:p-6 flex flex-col gap-4"
				>
					<h2 class="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font pv-text delay-1">
						文章目錄
					</h2>
					<div class="flex flex-col gap-5 pv-text delay-2">
						<div class="flex flex-col gap-2">
							<a
								href="#section1"
								class="text-[#4E5969] text-xl font-bold hover:text-[#2D739A] flex items-center"
							>
								<img src="/imgs/icon/list-arrow.svg" alt="Section Icon" class="mr-1" />
								第一段落標題
							</a>
							<a href="#section2" class="text-[#4E5969] text-lg font-medium hover:text-[#2D739A] ml-8">
								第二段落標題
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<Footer />
</div>
