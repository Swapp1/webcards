<script lang="ts">
	let {
		src,
		alt,
		thumbnail
	}: {
		src: string;
		alt: string;
		thumbnail: string;
	} = $props();
</script>

<video
	{src}
	poster={thumbnail}
	title={alt}
	aria-label={alt}
	controls
	class="aspect-video w-full rounded-lg object-cover"
	width="628"
	height="360"
>
	<track kind="captions" />
</video>
