<script>
	import { getFeatured } from '$lib/posts.js';

	/** @type {{ posts?: Array<{slug: string, title: string, dateLabel: string}> }} */
	let { posts } = $props();

	let displayPosts = $derived(posts && posts.length > 0 ? posts : getFeatured());
</script>

<div
	class="w-full h-fit bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-6 flex flex-col gap-4"
>
	<div class="flex justify-between items-center">
		<h2 class="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">熱門文章</h2>
		<a
			href="/post-list"
			class="text-[#4E5969] text-xs md:text-sm font-semibold noto-font border border-[#4E5969]/20 px-3 md:px-4 rounded-[10px] shadow-inner h-7 md:h-8 flex items-center hover:bg-[#DBECF8] transition-all duration-200 ease-in-out cursor-pointer"
			>更多</a
		>
	</div>
	<div class="flex flex-col gap-4 items-center">
		{#each displayPosts as post (post.slug)}
			<a
				href="/post/{post.slug}"
				class="flex flex-col border border-[#4E5969]/20 w-full px-4 py-2.5 rounded-[15px] shadow-inner gap-0.5 cursor-pointer hover:bg-[#DBECF8] transition-all duration-200 ease-in-out"
			>
				<p class="text-[#4E5969] text-[15px] noto-font truncate">{post.title}</p>
				<div class="flex gap-1">
					<img src="/imgs/icon/date.svg" alt="Calendar Icon" class="h-4 w-4 my-auto" />
					<p class="text-[#4E5969] text-[13px] noto-font">{post.dateLabel}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
