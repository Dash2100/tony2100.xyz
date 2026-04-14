<script lang="ts">
	import { onMount } from "svelte";
	import Footer from "$lib/components/Footer.svelte";

	const allTags = [
		{ id: "all", label: "全部" },
		{ id: "competition", label: "競賽" },
		{ id: "development", label: "程式開發" },
		{ id: "test", label: "測試" },
		{ id: "history", label: "秦始皇" },
		{ id: "animal", label: "北極熊" },
		{ id: "travel", label: "旅遊" },
		{ id: "food", label: "美食" },
		{ id: "tech", label: "科技" },
		{ id: "life", label: "生活" },
	];

	const posts = [
		{
			cover: "/imgs/cover-default.png",
			title: "這是一段文章的標題文字",
			date: "2025 年 07 月 24 日",
			tags: ["pin", "competition"],
			pinned: true,
		},
		{
			cover: "/imgs/cover-default.png",
			title: "這是一段文章的標題文字",
			date: "2025 年 07 月 24 日",
			tags: ["competition"],
			pinned: false,
		},
		{
			cover: "/imgs/cover-default.png",
			title: "這是一段文章的標題文字",
			date: "2025 年 07 月 24 日",
			tags: ["competition"],
			pinned: false,
		},
		{
			cover: "/imgs/cover-default.png",
			title: "這是一段文章的標題文字",
			date: "2025 年 07 月 24 日",
			tags: ["competition"],
			pinned: false,
		},
	];

	let activeTag = $state("all");
	let sliderStyle = $state("width: 48px; left: 0px;");
	let tagScrollContainer: HTMLDivElement | null = $state(null);
	let leftArrowOpacity = $state("0");
	let rightArrowOpacity = $state("0");

	function updateSlider(btn: HTMLButtonElement) {
		sliderStyle = `width: ${btn.offsetWidth}px; left: ${btn.offsetLeft}px;`;
	}

	function updateArrows() {
		if (!tagScrollContainer) return;
		const scrollable =
			tagScrollContainer.scrollWidth > tagScrollContainer.clientWidth;
		const atStart = tagScrollContainer.scrollLeft <= 0;
		const atEnd =
			tagScrollContainer.scrollLeft >=
			tagScrollContainer.scrollWidth - tagScrollContainer.clientWidth - 1;
		leftArrowOpacity = scrollable && !atStart ? "1" : "0";
		rightArrowOpacity = scrollable && !atEnd ? "1" : "0";
	}

	function scrollTags(direction: "left" | "right") {
		if (!tagScrollContainer) return;
		tagScrollContainer.scrollLeft += direction === "left" ? -200 : 200;
	}

	function selectTag(tagId: string, btn: HTMLButtonElement) {
		activeTag = tagId;
		updateSlider(btn);
		btn.scrollIntoView({
			behavior: "smooth",
			block: "nearest",
			inline: "center",
		});
	}

	onMount(() => {
		updateArrows();
		const firstBtn =
			tagScrollContainer?.querySelector<HTMLButtonElement>(
				"button[data-tag]",
			);
		if (firstBtn) updateSlider(firstBtn);
	});
</script>

<svelte:head>
	<title>文章列表 — Tony2100's Life Log</title>
</svelte:head>

<div class="w-full p-4 md:p-8 lg:p-16 flex flex-col gap-8">
	<div class="max-w-4xl mx-auto w-full flex flex-col gap-8">
		<!-- Title Area -->
		<div class="flex flex-col gap-4 text-center mt-5 md:mt-0">
			<h1 class="text-4xl font-bold text-[#4E5969]">文章列表</h1>
			<h2 class="text-2xl text-[#4E5969]">
				我覺得這件事撇除不好玩的部分，其實都蠻好玩的
			</h2>
		</div>

		<div class="flex flex-col gap-5">
			<!-- Tags Filter Bar -->
			<div
				class="h-14 mx-2 bg-[#f7fafd] shadow-inner border border-[#4E5969]/20 rounded-[20px] flex items-center px-2 relative overflow-hidden"
			>
				<!-- Left Arrow -->
				<button
					class="absolute left-3 z-20 p-1 transition-all duration-300 hover:scale-110"
					style="opacity: {leftArrowOpacity}"
					aria-label="向左滾動"
					onclick={() => scrollTags("left")}
				>
					<svg
						class="w-6 h-6 text-[#4E5969]"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<!-- Right Arrow -->
				<button
					class="absolute right-3 z-20 p-1 transition-all duration-300 hover:scale-110"
					style="opacity: {rightArrowOpacity}"
					aria-label="向右滾動"
					onclick={() => scrollTags("right")}
				>
					<svg
						class="w-6 h-6 text-[#4E5969]"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>

				<!-- Scrollable Tags -->
				<div
					bind:this={tagScrollContainer}
					class="flex gap-5 relative z-10 overflow-x-auto overflow-y-hidden w-full scroll-smooth h-full items-center mx-8"
					style="scrollbar-width: none; -ms-overflow-style: none;"
					onscroll={updateArrows}
				>
					<!-- Slider Background -->
					<div
						class="absolute top-1/2 -translate-y-1/2 bg-[#DBECF8] shadow-inner rounded-lg transition-all duration-300 ease-in-out h-8 pointer-events-none z-0"
						style={sliderStyle}
					></div>

					{#each allTags as tag (tag.id)}
						<button
							class="cursor-pointer whitespace-nowrap text-[#4E5969] px-4 py-1 rounded-lg text-sm font-semibold transition-all duration-300 shrink-0 relative z-10 focus:outline-none"
							data-tag={tag.id}
							aria-pressed={activeTag === tag.id}
							onclick={(e) =>
								selectTag(
									tag.id,
									e.currentTarget as HTMLButtonElement,
								)}
						>
							{tag.label}
						</button>
					{/each}
				</div>

				<style>
					div[style*="scrollbar-width"]::-webkit-scrollbar {
						display: none;
					}
				</style>
			</div>

			<!-- Posts Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				{#each posts as post, i (i)}
					<div
						class="w-full bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[35px] flex flex-col gap-2 items-center p-6 md:p-8 select-none cursor-pointer group hover:bg-[#F0F8FF] transition-colors duration-300"
					>
						<!-- Cover Image -->
						<div
							class="w-full aspect-video bg-[#DBECF8] rounded-[20px] mb-2 shadow-inner overflow-hidden"
						>
							<img
								src={post.cover}
								alt="文章封面"
								class="w-full h-full object-cover rounded-[20px] transition-transform duration-300 ease-in-out group-hover:scale-105"
							/>
						</div>

						<!-- Tags -->
						<div class="flex gap-2 w-full flex-wrap">
							{#if post.pinned}
								<span
									class="bg-[#DBECF8] text-[#4E5969] px-3 py-1 rounded-lg text-sm shadow-inner flex items-center gap-1"
								>
									<img
										src="/imgs/icon/pin.svg"
										alt="Pin Icon"
										class="inline my-auto h-3 w-3"
									/>
									置頂
								</span>
							{/if}
							{#each post.tags.filter((t) => t !== "pin") as tag (tag)}
								<span
									class="bg-[#DBECF8] text-[#4E5969] px-3 py-1 rounded-lg text-sm shadow-inner"
								>
									{allTags.find((t) => t.id === tag)?.label ??
										tag}
								</span>
							{/each}
						</div>

						<!-- Title and Date -->
						<div class="flex flex-col gap-2 w-full">
							<h2
								class="text-[#4E5969] text-[20px] md:text-[22px] font-semibold noto-font"
							>
								{post.title}
							</h2>
							<div class="flex gap-2">
								<img
									src="/imgs/icon/date.svg"
									alt="Calendar Icon"
									class="h-5 w-5 my-auto"
								/>
								<p
									class="text-[#4E5969] text-sm noto-font font-semibold my-auto"
								>
									{post.date}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
	<Footer />
</div>
