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

<img
	{src}
	{alt}
	class="animate-touch aspect-video w-full object-cover"
	style="border-radius: {styleConfig.tileBorderRadius}px;"
	width="628"
	height="360"
	loading="lazy"
	decoding="async"
	style:display={imgLoading ? 'none' : 'block'}
	onload={() => {
		imgLoading = false;
	}}
/>
{#if imgLoading}
	<Skeleton
		class="aspect-video w-full bg-black/30 dark:bg-white/30"
		style="border-radius: {styleConfig.tileBorderRadius}px;"
	/>
{/if}
