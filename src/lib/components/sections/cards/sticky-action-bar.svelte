<script lang="ts">
	import { cn } from '$lib/utils';
	import type { SwappsTypes } from '$lib/types/cards';
	import { Drawer } from 'vaul-svelte';
	import { onMount } from 'svelte';
	import type { CardStyleType } from '$lib/config/card-styles';

	let {
		showLeadCapture = false,
		hasAlreadySubmitted = false,
		name,
		title,
		pic,
		swapps,
		onConnect,
		onSaveContact,
		cardStyleType = 'original'
	}: {
		showLeadCapture: boolean;
		hasAlreadySubmitted: boolean;
		name: string;
		title: string;
		pic: string;
		swapps?: SwappsTypes[];
		onConnect: () => void;
		onSaveContact: () => void;
		cardStyleType?: CardStyleType;
	} = $props();

	let loading = $state(false);
	let menuOpen = $state(false);
	let showBottomBar = $state(false);

	// Animate bottom bar on mount if no lead capture
	onMount(() => {
		if (!showLeadCapture) {
			// Delay to trigger animation after mount
			setTimeout(() => {
				showBottomBar = true;
			}, 300);
		} else {
			showBottomBar = true;
		}
	});

	// Export function to open menu from parent
	export function openMenu() {
		menuOpen = true;
	}

	// Hide bottom bar for classic style (has its own button)
	const shouldShowBottomBar = $derived(cardStyleType !== 'classic');

	// Show Connect button only if lead capture is enabled AND user hasn't submitted yet
	const showConnectBtn = $derived(showLeadCapture && !hasAlreadySubmitted);

	async function optimizeImage(imageUrl: string, maxWidth = 300, maxHeight = 300) {
		try {
			const img = new Image();
			img.crossOrigin = 'anonymous';

			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
				img.src = imageUrl;
			});

			let width = img.width;
			let height = img.height;

			if (width > height) {
				if (width > maxWidth) {
					height *= maxWidth / width;
					width = maxWidth;
				}
			} else {
				if (height > maxHeight) {
					width *= maxHeight / height;
					height = maxHeight;
				}
			}

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			ctx?.drawImage(img, 0, 0, width, height);

			const base64Data = canvas.toDataURL('image/jpeg', 0.6);
			return base64Data.split(',')[1];
		} catch (error) {
			console.error('Error optimizing image:', error);
			return null;
		}
	}

	// Export downloadVCF for classic style button
	export async function downloadVCF() {
		loading = true;
		menuOpen = false;

		try {
			let vcfData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTITLE:${title}\n`;

			const base64Image = await optimizeImage(pic);
			if (base64Image) {
				vcfData += `PHOTO;ENCODING=BASE64;TYPE=JPEG:${base64Image}\n`;
			}

			if (swapps && swapps.length > 0) {
				for (const swapp of swapps) {
					if (!['Empty', 'Image', 'Header', 'Title', 'Video', 'Text', 'File'].includes(swapp.title)) {
						if (swapp.title === 'Phone number') {
							vcfData += `TEL;TYPE=CELL:${swapp.extras?.countryCode ?? ''}${swapp.detail}\n`;
						} else if (swapp.title === 'Email') {
							vcfData += `EMAIL:${swapp.detail}\n`;
						} else if (swapp.title === 'Address') {
							vcfData += `ADR:${swapp.detail}\n`;
						} else if (swapp.link) {
							vcfData += `URL;TYPE=${swapp.title}:${swapp.link}${swapp.detail}\n`;
						}
					}
				}
			}

			vcfData += 'END:VCARD';

			const blob = new Blob([vcfData], { type: 'text/vcard' });
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${name.replace(/\s+/g, '_')}.vcf`;
			a.click();
			window.URL.revokeObjectURL(url);

			onSaveContact();
		} finally {
			loading = false;
		}
	}

	function handleShareMyInfo() {
		menuOpen = false;
		onConnect();
	}
</script>

<!-- Menu Drawer (triggered from page header) -->
<Drawer.Root bind:open={menuOpen}>
	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 z-50 bg-black/40" />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[1.5rem] bg-[#2a2a2a] px-6 pb-8 pt-4 focus-visible:outline-none"
		>
			<!-- Drag handle -->
			<div class="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/20"></div>

			<!-- Menu items -->
			<div class="flex flex-col gap-3">
				<!-- Add to Contacts -->
				<button
					type="button"
					onclick={downloadVCF}
					disabled={loading}
					class="flex w-full items-center gap-4 rounded-[20px] bg-[#363434] px-4 py-4 text-left font-inter transition-colors active:bg-[#404040]"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
							<circle cx="9" cy="7" r="4"/>
							<line x1="19" x2="19" y1="8" y2="14"/>
							<line x1="22" x2="16" y1="11" y2="11"/>
						</svg>
					</div>
					<span class="text-[16px] font-medium text-white">Add to Contacts</span>
				</button>

				<!-- Share my Info (only if lead capture enabled) -->
				{#if showLeadCapture && !hasAlreadySubmitted}
					<button
						type="button"
						onclick={handleShareMyInfo}
						class="flex w-full items-center gap-4 rounded-[20px] bg-[#363434] px-4 py-4 text-left font-inter transition-colors active:bg-[#404040]"
					>
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
								<polyline points="16 6 12 2 8 6"/>
								<line x1="12" x2="12" y1="2" y2="15"/>
							</svg>
						</div>
						<span class="text-[16px] font-medium text-white">Share my Info</span>
					</button>
				{/if}

				<!-- Create my free card -->
				<a
					href="https://download.swapp.fr"
					target="_blank"
					rel="noopener noreferrer"
					class="flex w-full items-center gap-4 rounded-[20px] bg-[#363434] px-4 py-4 text-left font-inter transition-colors active:bg-[#404040]"
				>
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect width="18" height="18" x="3" y="3" rx="2"/>
							<path d="M12 8v8"/>
							<path d="M8 12h8"/>
						</svg>
					</div>
					<span class="text-[16px] font-medium text-white">Create my free card</span>
				</a>
			</div>

			<!-- Footer -->
			<div class="mt-6 flex items-center justify-center gap-2 text-sm text-white/40">
				<span>Powered by</span>
				<a href="https://swapp.fr" target="_blank" rel="noopener noreferrer" class="flex items-center gap-1.5 font-medium text-white/60">
					<img src="/swapp.svg" alt="Swapp" class="h-4 w-4" />
					Swapp
				</a>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<!-- Sticky Bottom Action Bar -->
{#if shouldShowBottomBar}
<div
	class={cn(
		"fixed bottom-0 left-0 right-0 z-50 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:hidden transition-transform duration-500 ease-out",
		showBottomBar ? "translate-y-0" : "translate-y-full"
	)}
>
	<div class="flex items-center justify-center gap-3">
		<!-- Center button(s) -->
		<div class="flex gap-3">
			{#if showConnectBtn}
				<!-- Connect Button -->
				<button
					type="button"
					onclick={onConnect}
					class="flex items-center justify-center rounded-full bg-black px-6 py-3 font-inter text-[15px] font-semibold text-white shadow-lg shadow-black/20 transition-all active:scale-[0.97]"
				>
					Connect
				</button>

				<!-- Save Contact Button -->
				<button
					type="button"
					onclick={downloadVCF}
					disabled={loading}
					class="flex items-center justify-center rounded-full bg-white px-6 py-3 font-inter text-[15px] font-semibold text-black shadow-lg shadow-black/10 transition-all active:scale-[0.97] disabled:opacity-50"
				>
					{#if loading}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-[18px] w-[18px] animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 12a9 9 0 1 1-6.219-8.56" />
						</svg>
					{:else}
						Save
					{/if}
				</button>
			{:else}
				<!-- Single Save Contact Button -->
				<button
					type="button"
					onclick={downloadVCF}
					disabled={loading}
					class="flex items-center justify-center rounded-full bg-black px-8 py-3.5 font-inter text-base font-semibold text-white shadow-lg shadow-black/20 transition-all active:scale-[0.97] disabled:opacity-50"
				>
					{#if loading}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 12a9 9 0 1 1-6.219-8.56" />
						</svg>
					{:else}
						Save Contact
					{/if}
				</button>
			{/if}
		</div>
	</div>
</div>
{/if}

<!-- Spacer to prevent content from being hidden behind sticky bar -->
{#if shouldShowBottomBar}
<div class="h-20 sm:hidden"></div>
{/if}
