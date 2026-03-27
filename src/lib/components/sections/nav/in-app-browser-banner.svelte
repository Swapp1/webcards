<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getBrowserLocale } from '$lib/utils/locale';

	let showBanner = $state(false);
	let dismissed = $state(false);
	let copied = $state(false);
	let appName = $state('');
	let isAndroid = $state(false);

	const translations = {
		en: {
			openIn: 'Open in browser',
			copyLink: 'Copy link',
			copied: 'Copied! Paste in Safari',
			betterExperience: 'Open in your browser for the full experience',
			dismiss: 'Continue here',
			howTo: 'You can also tap ••• above then "Open in browser"'
		},
		fr: {
			openIn: 'Ouvrir dans le navigateur',
			copyLink: 'Copier le lien',
			copied: 'Copie ! Collez dans Safari',
			betterExperience: 'Ouvrez dans votre navigateur pour une meilleure experience',
			dismiss: 'Continuer ici',
			howTo: 'Vous pouvez aussi appuyer sur ••• puis "Ouvrir dans le navigateur"'
		},
		es: {
			openIn: 'Abrir en el navegador',
			copyLink: 'Copiar enlace',
			copied: 'Copiado! Pega en Safari',
			betterExperience: 'Abre en tu navegador para la experiencia completa',
			dismiss: 'Continuar aqui',
			howTo: 'Tambien puedes tocar ••• y luego "Abrir en el navegador"'
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

	async function copyToClipboard() {
		const url = window.location.href;
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = url;
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			document.body.removeChild(ta);
		}
		copied = true;
		setTimeout(() => { copied = false; }, 3000);
	}

	function openInBrowser() {
		const url = window.location.href;
		const strippedUrl = url.replace(/^https?:\/\//, '');

		if (isAndroid) {
			// Android: intent:// works reliably
			window.location.href = `intent://${strippedUrl}#Intent;scheme=https;package=com.android.chrome;end`;
			setTimeout(() => {
				window.location.href = `intent://${strippedUrl}#Intent;scheme=https;end`;
			}, 500);
			return;
		}

		// iOS: no reliable way to force Safari open from a webview.
		// Copy the link and guide the user.
		copyToClipboard();
	}

	onMount(() => {
		const detected = detectInAppBrowser();
		if (detected) {
			appName = detected;
			isAndroid = /android/i.test(navigator.userAgent);
			showBanner = true;
		}
	});
</script>

{#if showBanner && !dismissed}
	<div class="fixed top-0 left-0 right-0 z-[100] animate-slideDown">
		<div class="mx-3 mt-3 flex flex-col gap-3 rounded-2xl bg-[#1a1a1a] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
			<div class="flex items-start gap-3">
				<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"/>
						<path d="M2 12h20"/>
						<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
					</svg>
				</div>
				<div class="flex-1">
					<p class="text-sm font-medium text-white">{t.betterExperience}</p>
					{#if !isAndroid}
						<p class="mt-1 text-xs text-white/40">{t.howTo}</p>
					{/if}
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
					{#if copied}
						<span class="flex items-center justify-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="20 6 9 17 4 12"/>
							</svg>
							{t.copied}
						</span>
					{:else if isAndroid}
						{t.openIn}
					{:else}
						{t.copyLink}
					{/if}
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
