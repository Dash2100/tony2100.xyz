<script lang="ts">
	import { homeClickCallback } from '$lib/stores.js';
	import { page } from '$app/state';

	function handleHomeClick(e: MouseEvent) {
		const cb = $homeClickCallback;
		if (cb) {
			e.preventDefault();
			cb();
		}
	}

	let isHome = $derived(page.url.pathname === '/');
	let isList = $derived(page.url.pathname === '/post-list');
	let isNote = $derived(page.url.pathname === '/note');
</script>

<!-- Desktop Side Nav -->
<div
	class="h-dvh w-17.5 px-2 py-10 bg-[#EDF5FA] shadow-nav flex-col items-center sticky top-0 left-0 hidden lg:flex shrink-0"
>
	<!-- Profile -->
	<div class="flex items-center justify-center">
		<img src="/imgs/profile.png" alt="Tony2100" class="h-12 w-12 rounded-full" />
	</div>

	<!-- Nav Items -->
	<div class="flex flex-col gap-10 my-16">
		<a
			href="/"
			data-sveltekit-noscroll
			onclick={handleHomeClick}
			class="flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out
			{isHome ? 'bg-[#DBECF8] shadow-inner' : 'hover:bg-[#e8f6ff] hover:shadow-inner'}"
		>
			<img src="/imgs/icon/home.svg" alt="首頁" class="h-7 w-7" />
		</a>
		<a
			href="/post-list"
			data-sveltekit-noscroll
			class="flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out
			{isList ? 'bg-[#DBECF8] shadow-inner' : 'hover:bg-[#e8f6ff] hover:shadow-inner'}"
		>
			<img src="/imgs/icon/blog.svg" alt="文章列表" class="h-7 w-7" />
		</a>
		<a
			href="/note"
			data-sveltekit-noscroll
			class="flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out
			{isNote ? 'bg-[#DBECF8] shadow-inner' : 'hover:bg-[#e8f6ff] hover:shadow-inner'}"
		>
			<img src="/imgs/icon/note.svg" alt="隨手記" class="h-7 w-7" />
		</a>
	</div>

	<!-- Settings -->
	<button
		class="flex items-center justify-center p-2 rounded-full mt-auto hover:bg-[#e8f6ff] hover:shadow-inner ease-in-out duration-200"
		aria-label="設定"
	>
		<img src="/imgs/icon/settings.svg" alt="設定" class="h-7 w-7" />
	</button>
</div>

<!-- Mobile Bottom Nav -->
<div
	class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#EDF5FA] shadow-nav pb-[env(safe-area-inset-bottom)]"
>
	<div class="flex justify-around items-center py-3 px-4">
		<a
			href="/"
			data-sveltekit-noscroll
			onclick={handleHomeClick}
			class="flex flex-col items-center justify-center p-3 rounded-full transition-all duration-200 ease-in-out
			{isHome ? 'bg-[#DBECF8] shadow-inner' : ''}"
		>
			<img src="/imgs/icon/home.svg" alt="首頁" class="h-6 w-6" />
		</a>
		<a
			href="/post-list"
			data-sveltekit-noscroll
			class="flex flex-col items-center justify-center p-3 rounded-full transition-all duration-200 ease-in-out
			{isList ? 'bg-[#DBECF8] shadow-inner' : ''}"
		>
			<img src="/imgs/icon/blog.svg" alt="文章列表" class="h-6 w-6" />
		</a>
		<a
			href="/note"
			data-sveltekit-noscroll
			class="flex flex-col items-center justify-center p-3 rounded-full transition-all duration-200 ease-in-out
			{isNote ? 'bg-[#DBECF8] shadow-inner' : ''}"
		>
			<img src="/imgs/icon/note.svg" alt="隨手記" class="h-6 w-6" />
		</a>
		<button
			class="flex flex-col items-center justify-center p-3 rounded-full ease-in-out duration-200"
			aria-label="設定"
		>
			<img src="/imgs/icon/settings.svg" alt="設定" class="h-6 w-6" />
		</button>
	</div>
</div>
