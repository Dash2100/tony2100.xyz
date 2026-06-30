<script>
	import { allTags } from '$lib/posts.js';

	/** @type {{ tags?: Array<{tag: string, count: number}> }} */
	let { tags } = $props();

	let displayTags = $derived(tags && tags.length > 0 ? tags : allTags);
</script>

<div
	class="w-full h-fit bg-[#f7fafd] border border-[#4E5969]/20 shadow-inner rounded-[25px] md:rounded-[35px] p-6 flex flex-col gap-4"
>
	<h2 class="text-[#4E5969] text-lg md:text-[22px] font-semibold noto-font">文章標籤</h2>
	<div class="flex flex-wrap gap-2 md:gap-3">
		{#each displayTags as { tag } (tag)}
			<a
				href="/post-list?tag={encodeURIComponent(tag)}"
				class="text-[#4E5969] text-sm md:text-base px-3 md:px-4 py-1 noto-font border border-[#4E5969]/20 rounded-[10px] shadow-inner w-fit hover:bg-[#DBECF8] transition-all duration-200 ease-in-out cursor-pointer"
			>
				{tag}
			</a>
		{/each}
	</div>
</div>
