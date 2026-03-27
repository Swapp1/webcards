<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getBrowserLocale } from '$lib/utils/locale';

	let showBanner = $state(false);
	let dismissed = $state(false);
	let appName = $state('');

	const translations = {
		en: {
			openIn: 'Open in browser',
			betterExperience: 'For a better experience, open this page in your browser',
			dismiss: 'Continue here'
		},
		fr: {
			openIn: 'Ouvrir dans le navigateur',
			betterExperience: 'Pour une meilleure experience, ouvrez cette page dans votre navigateur',
			dismiss: 'Continuer ici'
		},
		es: {
			openIn: 'Abrir en el navegador',
			betterExperience: 'Para una mejor experiencia, abre esta pagina en tu navegador',
			dismiss: 'Continuar aqui'
		}
	};

	const locale = getBrowserLocale();
	const t = translations[locale];

	function detectInAppBrowser(): string | null {
		if (!browser) return null;
		const ua = navigator.userAgent || navigator.vendor || '';

		if (/Instagram/i.test(ua)) return 'Instagram';
		if (/FBAN|FBAV/i.test(ua)) return 'Facebook';
		if (/Musical_ly|BytedanceWebview|TikTok/i.test(ua)) return 'TikTok';
		if (/LinkedIn/i.test(ua)) return 'LinkedIn';
		if (/Snapchat/i.test(ua)) return 'Snapchat';
		if (/Twitter|X\/|x\.com/i.test(ua)) return 'X';
		if (/Pinterest/i.test(ua)) return 'Pinterest';
		if (/Telegram/i.test(ua)) return 'Telegram';
		if (/Line\//i.test(ua)) return 'LINE';
		if (/MicroMessenger/i.test(ua)) return 'WeChat';

		return null;
	}

	function openInBrowser() {
		const url = window.location.href;

		// Try intent:// for Android
		if (/android/i.test(navigator.userAgent)) {
			window.location.href = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;end`;
			return;
		}

		// iOS: Try using a trick to open Safari
		// For Instagram/FB on iOS, window.open sometimes works
		const w = window.open(url, '_blank');
		if (!w) {
			// Fallback: copy URL and alert
			navigator.clipboard?.writeText(url);
			const copyMsg = {
				en: 'Link copied! Paste it in your browser (Safari/Chrome).',
				fr: 'Lien copie ! Collez-le dans votre navigateur (Safari/Chrome).',
				es: 'Enlace copiado! Pegalo en tu navegador (Safari/Chrome).'
			};
			alert(copyMsg[locale]);
		}
	}

	onMount(() => {
		const detected = detectInAppBrowser();
		if (detected) {
			appName = detected;
			showBanner = true;
		}
	});
</script>

{#if showBanner && !dismissed}
	<div class="fixed top-0 left-0 right-0 z-[100] animate-slideDown">
		<div class="mx-3 mt-3 flex flex-col gap-3 rounded-2xl bg-[#1a1a1a] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
			<div class="flex items-start gap-3">
				<!-- Browser icon -->
				<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<path d="M2 12h20"/>
						<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
					</svg>
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium text-white">{t.betterExperience}</p>
				</div>
			</div>

			<div class="flex gap-2">
				<button
					type="button"
					onclick={() => dismissed = true}
					class="flex-1 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/70 transition-colors active:bg-white/15"
				>
					{t.dismiss}
				</button>
				<button
					type="button"
					onclick={openInBrowser}
					class="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors active:bg-white/90"
				>
					{t.openIn}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-100%);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.animate-slideDown) {
		animation: slideDown 0.4s ease-out;
	}
</style>
