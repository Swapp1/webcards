<script lang="ts">
	import type { SwappsTypes } from '$lib/types/cards';
	import { cn } from '$lib/utils';
	import CardImage from './card-type/card-image.svelte';
	import CardLink from './card-type/card-link.svelte';
	import CardText from './card-type/card-text.svelte';
	import CardVideo from './card-type/card-video.svelte';

	let {
		swapps,
		isColor
	}: {
		swapps: SwappsTypes[];
		isColor: boolean;
	} = $props();
</script>

{#each swapps as swapp}
	{#if swapp.title === 'Empty'}
		<hr class="border-0 py-4" />
	{:else if swapp.title === 'Image'}
		<CardImage src={swapp.extras?.attachmentFilePath} alt={swapp.title} />
	{:else if ['Header', 'Title'].includes(swapp.title)}
		<h3
			class={cn(
				' pb-1 pt-6 text-[1.375rem] font-semibold leading-[1.375rem] md:text-3xl md:font-medium md:leading-[1.875rem]',
				isColor && 'text-white'
			)}
		>
			{swapp.detail}
		</h3>
	{:else if swapp.title === 'Video'}
		<CardVideo
			src={swapp.extras?.attachmentFilePath}
			alt={swapp.title}
			thumbnail={swapp.extras?.attachmentThumbnail}
		/>
	{:else if swapp.title === 'Text'}
		<CardText {isColor} text={swapp.detail} />
	{:else if swapp.title === 'File'}
		<CardLink
			{isColor}
			src={swapp.title}
			detail={swapp.detail}
			link={swapp.extras.attachmentFilePath}
		/>
	{:else if swapp.type === 'phoneNumber'}
    	<CardLink
      		{isColor}
      		src={swapp.title}
      		detail={`${swapp.extras?.countryCode ?? ''}${swapp.detail}`}
      		link={swapp.link}
    	/>
	{:else if swapp.title === 'Link'}
		<CardLink
			{isColor}
			src={swapp.extras.linkName}
			detail={swapp.detail}
			link={swapp.link}
		/>
	{:else}
		<CardLink {isColor} src={swapp.title} detail={swapp.detail} link={swapp.link} />
	{/if}
{/each}
