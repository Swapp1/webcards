<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { getStyleConfig, type CardStyleType } from '$lib/config/card-styles';

	let {
		src,
		alt,
		cardStyleType = 'original'
	}: {
		src: string;
		alt: string;
		cardStyleType?: CardStyleType;
	} = $props();

	const styleConfig = $derived(getStyleConfig(cardStyleType));
	let imgLoading = $state(true);
</script>

<div class="relative aspect-video w-full">
	{#if imgLoading}
		<Skeleton
			class="absolute inset-0 bg-black/30 dark:bg-white/30"
			style="border-radius: {styleConfig.tileBorderRadius}px;"
		/>
	{/if}
	<img
		{src}
		{alt}
		class="animate-touch aspect-video w-full object-cover"
		class:opacity-0={imgLoading}
		style="border-radius: {styleConfig.tileBorderRadius}px;"
		width="628"
		height="360"
		loading="lazy"
		decoding="async"
		onload={() => {
			imgLoading = false;
		}}
	/>
</div>
