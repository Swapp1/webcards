<script lang="ts">
	import type { SwappsTypes } from '$lib/types/cards';
	import { cn } from '$lib/utils';
	import Button from '../../ui/button/button.svelte';

	let loading = $state(false);

	let {
		text,
		swapps,
		name,
		className,
		title,
		pic,
		org
	}: {
		text: string;
		name: string;
		swapps?: SwappsTypes[];
		className?: string;
		title: string;
		pic: string;
		org?: string;
	} = $props();

	async function optimizeImage(imageUrl: string, maxWidth = 400, maxHeight = 400) {
		try {
			// Create image element
			const img = new Image();
			img.crossOrigin = 'anonymous';

			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
				img.src = imageUrl;
			});

			// Calculate new dimensions
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

			// Create canvas and resize
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			ctx?.drawImage(img, 0, 0, width, height);

			// Convert to base64 with reduced quality
			const base64Data = canvas.toDataURL('image/jpeg', 0.7);
			return base64Data.split(',')[1];
		} catch (error) {
			console.error('Error optimizing image:', error);
			return null;
		}
	}

	async function downloadVCF() {
		loading = true;
		let vcfData = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTITLE:${title + (org ? ` at ${org}` : '')}\n`;

		const base64Image = await optimizeImage(pic);
		if (base64Image) {
			vcfData += `PHOTO;ENCODING=BASE64;TYPE=JPEG:${base64Image}\n`;
		}

		if (swapps && swapps.length > 0) {
			swapps.forEach((swapp) => {
				if (!['Empty', 'Image', 'Header', 'Title', 'Video', 'Text', 'File'].includes(swapp.title)) {
					if (swapp.title === 'Phone number') {
						vcfData += `TEL;TYPE=CELL:${swapp.extras.countryCode}${swapp.detail}\n`;
					} else if (swapp.title === 'Email') {
						vcfData += `EMAIL:${swapp.detail}\n`;
					} else if (swapp.title === 'Address') {
						vcfData += `ADR:${swapp.detail}\n`;
					} else {
						vcfData += `URL;TYPE=${swapp.title}:${swapp.link}${swapp.detail}\n`;
					}
				}
			});
		}

		vcfData += 'END:VCARD';

		const blob = new Blob([vcfData], { type: 'text/vcard' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'contact.vcf';
		a.click();
		window.URL.revokeObjectURL(url);
		loading = false;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<Button
	type="button"
	onclick={downloadVCF}
	class={cn(
		` rounded-[24px] bg-white/60 py-6 text-base font-medium text-black backdrop-blur-lg hover:bg-white dark:bg-black/20 dark:text-white hover:dark:bg-white/10 lg:bg-[#F3F3F3] lg:backdrop-blur-0`,
		className
	)}
>
	{#if loading}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="animate-spin"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	{/if}
	{text}
</Button>
