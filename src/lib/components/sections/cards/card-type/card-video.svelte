<script lang="ts">
	import { getStyleConfig, type CardStyleType } from '$lib/config/card-styles';

	let {
		src,
		alt,
		thumbnail,
		cardStyleType = 'original'
	}: {
		src: string;
		alt: string;
		thumbnail: string;
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
	preload="metadata"
	class="aspect-video w-full object-cover"
	style="border-radius: {styleConfig.tileBorderRadius}px;"
	width="628"
	height="360"
>
	<track kind="captions" />
</video>
