<script lang="ts">
	import { cn } from '$lib/utils';
	import { getStyleConfig, type CardStyleType } from '$lib/config/card-styles';

	let {
		text,
		isColor,
		textColor = null,
		cardStyleType = 'original'
	}: {
		text: string;
		isColor: boolean;
		textColor?: 'black' | 'white' | null;
		cardStyleType?: CardStyleType;
	} = $props();

	const styleConfig = $derived(getStyleConfig(cardStyleType));
</script>

<p
	class={cn(
		'animate-touch flex items-center gap-4 px-4 py-5 font-inter text-sm md:px-[1.375rem] md:py-6 md:text-base tile-radius',
		isColor && textColor === 'black' && 'bg-black/10 text-black',
		isColor && textColor === 'white' && 'bg-white/20 text-white',
		!isColor && 'bg-white text-black dark:bg-[#1E1E1E] dark:text-white'
	)}
	style="--tile-radius: {styleConfig.tileBorderRadius}px; --tile-radius-desktop: {styleConfig.tileBorderRadiusDesktop}px;"
>
	{text}
</p>
