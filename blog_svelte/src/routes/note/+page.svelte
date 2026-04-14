<script>
	import Footer from "$lib/components/Footer.svelte";

	const notes = [
		{
			content:
				"海浪拍打著岸邊的礁石，發出陣陣悅耳的聲響。海鷗在天空中自由地翱翔，時而俯衝向海面，時而盤旋在半空中。漁船在遠方的海平線上若隱若現，像是畫家筆下的點點墨痕。夕陽西下時，整個天空都被染成了金黃色，美得令人屏息。",
			date: "2023年10月1日",
		},
	];
</script>

<svelte:head>
	<title>隨手記 — Tony2100's Life Log</title>
</svelte:head>

<div class="w-full p-4 md:p-8 lg:p-16 max-w-300 mx-auto flex flex-col gap-8">
	<!-- Title Area -->
	<div class="flex flex-col gap-4 text-center mt-5 md:mt-0">
		<h1 class="text-4xl font-bold text-[#4E5969]">隨手記</h1>
		<h2 class="text-2xl text-[#4E5969]">無聊的時候隨手打下來的東西</h2>
	</div>

	<!-- Notes -->
	<div class="flex flex-col gap-8 grow">
		{#each notes as note (note.date)}
			<div
				class="bg-[#DBECF8] px-6 md:px-10 py-6 md:py-8 rounded-[30px] shadow-inner"
			>
				<p
					class="text-[18px] md:text-[23px] font-medium text-[#4E5969] leading-relaxed"
				>
					{note.content}
				</p>
				<p
					class="text-[16px] md:text-[20px] font-medium text-[#4E5969] mt-5 ml-auto text-end"
				>
					{note.date}
				</p>
			</div>
		{/each}
	</div>

	<Footer />
</div>
