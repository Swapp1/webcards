<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';

	let {
		src,
		alt
	}: {
		src: string;
		alt: string;
	} = $props();

	let imgLoading = $state(true);
</script>

<img
	{src}
	{alt}
	class="animate-touch aspect-video w-full rounded-[24px] object-cover"
	width="628"
	height="360"
	style:display={imgLoading ? 'none' : 'block'}
	onload={() => {
		imgLoading = false;
	}}
/>
{#if imgLoading}
	<Skeleton class="aspect-video w-full bg-black/30 dark:bg-white/30 " />
{/if}
