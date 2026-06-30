<script lang="ts">
	import './layout.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	/** 平滑捲動控制器（桌機滑鼠才啟用，觸控與 reduced-motion 用原生）。 */
	let scroller: { reset: () => void } | null = null;

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const coarse = window.matchMedia('(pointer: coarse)').matches;
		if (reduce || coarse) return; // 觸控裝置 / 減少動態：保留原生捲動

		const root = document.documentElement;
		const prevBehavior = root.style.scrollBehavior;
		root.style.scrollBehavior = 'auto'; // 由 JS 接管，避免與 CSS smooth 打架

		let target = window.scrollY;
		let current = target;
		let rafId = 0;
		let running = false;
		const EASE = 0.115;

		const maxScroll = () => root.scrollHeight - window.innerHeight;
		const clamp = (v: number) => Math.max(0, Math.min(v, maxScroll()));

		function frame() {
			const diff = target - current;
			if (Math.abs(diff) < 0.4) {
				current = target;
				window.scrollTo(0, current);
				running = false;
				rafId = 0;
				return;
			}
			current += diff * EASE;
			window.scrollTo(0, current);
			rafId = requestAnimationFrame(frame);
		}
		function start() {
			if (!running) {
				running = true;
				rafId = requestAnimationFrame(frame);
			}
		}
		function smoothTo(y: number) {
			if (!running) current = window.scrollY;
			target = clamp(y);
			start();
		}
		function onWheel(e: WheelEvent) {
			if (e.ctrlKey) return; // 縮放
			if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // 讓水平捲動原生處理
			if (maxScroll() <= 0) return; // 沒有可捲動空間
			e.preventDefault();
			const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
			if (!running) current = window.scrollY;
			target = clamp(target + e.deltaY * unit);
			start();
		}
		function onAnchorClick(e: MouseEvent) {
			const el = e.target as Element | null;
			const a = el?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
			if (!a) return;
			const id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
			if (!id) return;
			const dest = document.getElementById(id);
			if (!dest) return;
			e.preventDefault();
			const top = dest.getBoundingClientRect().top + window.scrollY - 24;
			history.replaceState(null, '', '#' + id);
			smoothTo(top);
		}
		function syncIfIdle() {
			if (!running) {
				current = window.scrollY;
				target = window.scrollY;
			}
		}

		window.addEventListener('wheel', onWheel, { passive: false });
		document.addEventListener('click', onAnchorClick);
		window.addEventListener('resize', syncIfIdle);
		window.addEventListener('scroll', syncIfIdle, { passive: true });

		scroller = {
			reset: () => {
				if (rafId) cancelAnimationFrame(rafId);
				running = false;
				rafId = 0;
				target = 0;
				current = 0;
			}
		};

		return () => {
			window.removeEventListener('wheel', onWheel);
			document.removeEventListener('click', onAnchorClick);
			window.removeEventListener('resize', syncIfIdle);
			window.removeEventListener('scroll', syncIfIdle);
			if (rafId) cancelAnimationFrame(rafId);
			root.style.scrollBehavior = prevBehavior;
			scroller = null;
		};
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
				window.scrollTo({ top: 0, behavior: 'instant' });
				scroller?.reset();
			});
		});
	});
</script>

<svelte:head>
	<title>Tony2100's Life Log</title>
	<meta name="description" content="Tony2100 的個人部落格，記錄生活、競賽與程式開發" />
</svelte:head>

<div class="m-0 bg-[#EDF5FA] flex font-noto min-h-screen select-none overflow-x-clip">
	<Navbar />
	<div style="view-transition-name: page-content" class="flex-1 min-w-0">
		{@render children()}
	</div>
</div>
