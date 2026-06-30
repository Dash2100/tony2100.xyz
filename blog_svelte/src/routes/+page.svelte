<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { postList } from '$lib/posts.js';
	import PostCard from '$lib/components/PostCard.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import FeaturedPost from '$lib/components/FeaturedPost.svelte';
	import TagsWidget from '$lib/components/TagsWidget.svelte';

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

	onMount(() => {
		typeWriter();
	});

	onDestroy(() => {
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
			class="absolute w-full h-full object-cover z-10"
		/>

		<!-- Home Title -->
		<span class="z-50 flex-col gap-2 md:gap-4 absolute flex w-full">
			<h1 class="text-3xl lg:text-4xl h-fit text-center z-10 px-4">Tony2100's Life Log</h1>
			<div class="relative w-full min-h-7 md:min-h-9 lg:min-h-12">
				<h1
					class="absolute inset-0 text-xl md:text-2xl lg:text-3xl text-center z-10 px-4 flex items-start justify-center"
				>
					{typewriterText}
				</h1>
			</div>
		</span>
	</div>

	<!-- Posts and SideInfo -->
	<div class="w-full flex xl:flex-row flex-col gap-6 relative items-start">
		<!-- Posts Grid -->
		<div class="xl:flex-1 min-w-0 w-full">
			<div
				class="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-col gap-4 sm:gap-5"
			>
				{#each postList as post, i (post.slug)}
					<PostCard
						slug={post.slug}
						cover={post.cover}
						title={post.title}
						dateLabel={post.dateLabel}
						wordsLabel={post.wordsLabel}
						tags={post.tags}
						pinned={post.pinned}
						index={i}
					/>
				{/each}
			</div>
		</div>

		<!-- Side Info Section -->
		<div class="flex flex-col gap-6 sticky top-4 self-start w-full xl:w-75 z-20 h-fit shrink-0">
			<FeaturedPost />
			<TagsWidget />
		</div>
	</div>

	<Footer />
</div>
