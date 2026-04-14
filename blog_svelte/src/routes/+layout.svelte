<script>
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Tony2100's Life Log</title>
	<meta name="description" content="Tony2100 的個人部落格，記錄生活、競賽與程式開發" />
</svelte:head>

<div class="m-0 bg-[#EDF5FA] flex font-noto min-h-screen select-none overflow-x-clip">
	<Navbar />
	{@render children()}
</div>
