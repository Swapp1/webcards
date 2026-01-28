<script lang="ts">
	import { getStyleConfig, type CardStyleType } from '$lib/config/card-styles';

	let {
		src = '',
		alt = '',
		thumbnail = '',
		cardStyleType = 'original'
	}: {
		src?: string;
		alt?: string;
		thumbnail?: string;
		cardStyleType?: CardStyleType;
	} = $props();

	const styleConfig = $derived(getStyleConfig(cardStyleType));
</script>

<video
	{src}
	poster={thumbnail}
	title={alt}
	aria-label={alt}
	controls
	preload="none"
	playsinline
	class="aspect-video w-full object-cover tile-radius"
	style="--tile-radius: {styleConfig.tileBorderRadius}px; --tile-radius-desktop: {styleConfig.tileBorderRadiusDesktop}px;"
	width="628"
	height="360"
>
	<track kind="captions" />
</video>
