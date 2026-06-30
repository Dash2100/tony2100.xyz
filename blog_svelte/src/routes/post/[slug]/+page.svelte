<script>
	let { data } = $props();

	const post = $derived(data.post);
	const headings = $derived(data.headings ?? []);
</script>

<svelte:head>
	<title>{post.title} — Tony2100's Life Log</title>
	<meta name="description" content={post.excerpt} />
</svelte:head>

<div
	class="w-full p-4 md:p-8 lg:p-16 lg:pb-16 max-w-325 mx-auto flex flex-col gap-6 md:gap-8 mb-24"
>
	<!-- ===== Cover Hero（模糊封面當裝飾 + 標題 overlay） ===== -->
	<div
		class="relative w-full h-56 md:h-72 lg:h-80 rounded-[25px] md:rounded-[35px] mx-auto bg-[#DBECF8] shadow-inner overflow-hidden mt-5 md:mt-0"
	>
		<!-- 封面圖：模糊化當裝飾背景 -->
		<img
			src={post.cover}
			alt=""
			aria-hidden="true"
			class="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl z-10"
		/>

		<!-- 由下往上的暗色漸層，讓白字可讀 -->
		<div
			class="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/30 to-black/10 pointer-events-none"
		></div>

		<!-- 返回按鈕 -->
		<a
			href="/"
			class="absolute top-3 left-3 md:top-6 md:left-6 z-40 flex items-center gap-1.5 md:gap-2 rounded-lg md:rounded-[10px] bg-white/80 backdrop-blur-xl shadow-inner px-3 py-1.5 md:px-4 md:py-2 font-medium text-[#4E5969] border border-[#4E5969]/20 hover:bg-white transition-all duration-300 ease-in-out noto-font"
		>
			<img src="/imgs/icon/back.svg" alt="Back Icon" class="h-4 md:h-6 inline-block" />
			<span class="text-[13px] md:text-base">返回</span>
		</a>

		<!-- 疊在左下角的標題 / 日期 / 字數 / tags -->
		<div
			class="absolute bottom-0 left-0 right-0 z-30 p-5 md:p-8 lg:p-10 flex flex-col gap-2 md:gap-3 select-text"
		>
			<h1
				class="text-white text-2xl md:text-3xl lg:text-4xl font-bold noto-font leading-snug drop-shadow-md"
			>
				{post.title}
			</h1>

			<div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
				<!-- 日期 -->
				<div class="flex items-center gap-1.5">
					<img src="/imgs/icon/date.svg" alt="Calendar Icon" class="h-4 w-4 md:h-5 md:w-5 brightness-0 invert" />
					<span class="text-white/90 text-[13px] md:text-[15px] noto-font font-medium drop-shadow">
						{post.dateLabel}
					</span>
				</div>

				<!-- 分隔線 -->
				<div class="w-0.5 h-3.5 md:h-4 bg-white/60 hidden sm:block"></div>

				<!-- 字數 -->
				<div class="flex items-center gap-1.5">
					<img src="/imgs/icon/words.svg" alt="Word Count Icon" class="h-4 w-4 md:h-5 md:w-5 brightness-0 invert" />
					<span class="text-white/90 text-[13px] md:text-[15px] noto-font font-medium drop-shadow">
						{post.wordsLabel}
					</span>
				</div>
			</div>

			<!-- tags -->
			{#if post.tags.length}
				<div class="flex flex-wrap gap-1.5 md:gap-2 mt-0.5">
					{#each post.tags as tag (tag)}
						<span
							class="bg-white/85 text-[#4E5969] px-2.5 py-1 md:px-3 rounded-lg md:rounded-[10px] text-xs md:text-[13px] shadow-inner noto-font"
						>
							{tag}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- ===== 主內容 + 目錄 ===== -->
	<div class="w-full flex xl:flex-row flex-col gap-6 items-start">
		<!-- 內容卡片 -->
		<article
			class="xl:flex-1 min-w-0 w-full bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-6 md:p-10 flex flex-col gap-6 md:gap-8"
		>
			<!-- 文章區內的清晰封面（16:9），同時是列表頁的變形動畫目標 -->
			<div
				class="w-full aspect-video bg-[#DBECF8] rounded-[20px] md:rounded-[25px] shadow-inner overflow-hidden"
			>
				<img
					src={post.cover}
					alt={post.title}
					fetchpriority="high"
					class="w-full h-full object-cover"
				/>
			</div>

			<div class="prose max-w-none noto-font">
				{@html data.html}
			</div>
		</article>

		<!-- 目錄卡片 -->
		{#if headings.length}
			<aside
				class="w-full xl:w-75 shrink-0 xl:sticky xl:top-4 self-start order-first xl:order-none bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-4 md:p-6 flex flex-col gap-4"
			>
				<h2 class="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">文章目錄</h2>
				<nav class="flex flex-col gap-2">
					{#each headings as h (h.id)}
						{#if h.depth === 2}
							<a
								href="#{h.id}"
								class="text-[#4E5969] text-base md:text-lg font-bold hover:text-[#2D739A] transition-colors flex items-center gap-1 noto-font"
							>
								<img src="/imgs/icon/list-arrow.svg" alt="" class="h-4 w-4 shrink-0" />
								<span class="min-w-0 break-words">{h.text}</span>
							</a>
						{:else}
							<a
								href="#{h.id}"
								class="text-[#4E5969] text-sm md:text-base font-medium hover:text-[#2D739A] transition-colors ml-8 break-words noto-font"
							>
								{h.text}
							</a>
						{/if}
					{/each}
				</nav>
			</aside>
		{/if}
	</div>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	/* 點目錄跳轉時，標題不被頂部遮住 */
	:global(.prose :where(h2, h3)[id]) {
		scroll-margin-top: 1.5rem;
	}

	/* ===== Prose 客製化：本站藍色主題 ===== */
	:global(.prose) {
		color: #4e5969;
		line-height: 1.85;
	}

	:global(.prose h1),
	:global(.prose h2),
	:global(.prose h3),
	:global(.prose h4),
	:global(.prose h5),
	:global(.prose h6) {
		color: #4e5969;
		font-weight: 700;
		scroll-margin-top: 1.5rem;
	}

	:global(.prose h2) {
		border-bottom: 1px solid rgba(78, 89, 105, 0.15);
		padding-bottom: 0.3em;
	}

	:global(.prose a) {
		color: #538ad9;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.2s ease;
	}

	:global(.prose a:hover) {
		color: #2d739a;
	}

	:global(.prose strong) {
		color: #4e5969;
	}

	/* 引言 */
	:global(.prose blockquote) {
		border-left: 4px solid #538ad9;
		background: rgba(219, 236, 248, 0.4);
		border-radius: 12px;
		padding: 0.75em 1.25em;
		color: #4e5969;
		font-style: normal;
		quotes: none;
	}

	:global(.prose blockquote p:first-of-type::before),
	:global(.prose blockquote p:last-of-type::after) {
		content: none;
	}

	/* 行內 code */
	:global(.prose :not(pre) > code) {
		background: #dbecf8;
		color: #2d739a;
		padding: 0.15em 0.45em;
		border-radius: 6px;
		font-weight: 500;
		font-size: 0.9em;
	}

	:global(.prose :not(pre) > code::before),
	:global(.prose :not(pre) > code::after) {
		content: none;
	}

	/* code block：深色、圓角、可水平捲動 */
	:global(.prose pre) {
		background: #2b3440;
		color: #e6edf3;
		border-radius: 14px;
		padding: 1em 1.25em;
		overflow-x: auto;
		max-width: 100%;
	}

	:global(.prose pre code) {
		background: transparent;
		color: inherit;
		padding: 0;
		font-size: 0.9em;
	}

	/* 表格：邊框 + 圓角 + 可水平捲動 */
	:global(.prose table) {
		display: block;
		overflow-x: auto;
		max-width: 100%;
		width: 100%;
		border-collapse: collapse;
		border: 1px solid rgba(78, 89, 105, 0.2);
		border-radius: 12px;
		overflow: hidden;
	}

	:global(.prose thead) {
		background: #dbecf8;
	}

	:global(.prose th),
	:global(.prose td) {
		border: 1px solid rgba(78, 89, 105, 0.2);
		padding: 0.6em 0.9em;
		color: #4e5969;
	}

	/* 圖片 */
	:global(.prose img) {
		border-radius: 16px;
		box-shadow: var(--shadow-inner);
		max-width: 100%;
		height: auto;
	}

	/* 清單標記顏色 */
	:global(.prose ul > li::marker),
	:global(.prose ol > li::marker) {
		color: #538ad9;
	}

	/* 水平線 */
	:global(.prose hr) {
		border-color: rgba(78, 89, 105, 0.2);
	}
</style>
