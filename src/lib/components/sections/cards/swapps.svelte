<script lang="ts">
	import type { SwappsTypes } from '$lib/types/cards';
	import { cn } from '$lib/utils';
	import CardImage from './card-type/card-image.svelte';
	import CardLink from './card-type/card-link.svelte';
	import CardText from './card-type/card-text.svelte';
	import CardVideo from './card-type/card-video.svelte';
	import { getStyleConfig, getStaggerClass, getTileAnimationClass, type CardStyleType } from '$lib/config/card-styles';

	let {
		swapps,
		isColor,
		textColor = null,
		cardStyleType = 'original',
		onContentClick
	}: {
		swapps: SwappsTypes[];
		isColor: boolean;
		textColor?: 'black' | 'white' | null;
		cardStyleType?: CardStyleType;
		onContentClick?: (contentType: string) => void;
	} = $props();

	const styleConfig = $derived(getStyleConfig(cardStyleType));
	const animationClass = $derived(getTileAnimationClass(cardStyleType));
</script>

<div class="flex flex-col" style:gap="{styleConfig.tileSpacing}px">
	{#each swapps as swapp, index}
		{#if swapp.title === 'Empty'}
			<hr class="border-0 py-4" />
		{:else if swapp.title === 'Image'}
			<div class={cn(animationClass, getStaggerClass(index, cardStyleType))}>
				<CardImage src={swapp.extras?.attachmentFilePath} alt={swapp.title} {cardStyleType} />
			</div>
		{:else if ['Header', 'Title'].includes(swapp.title)}
			<h3
				class={cn(
					'font-inter pb-1 pt-6 text-[1.375rem] font-semibold leading-[1.375rem] md:text-2xl md:leading-[1.5rem]',
					isColor && textColor === 'black' && 'text-black',
					isColor && textColor === 'white' && 'text-white',
					animationClass,
					getStaggerClass(index, cardStyleType)
				)}
			>
				{swapp.detail}
			</h3>
		{:else if swapp.title === 'Video'}
			<div class={cn(animationClass, getStaggerClass(index, cardStyleType))}>
				<CardVideo
					src={swapp.extras?.attachmentFilePath}
					alt={swapp.title}
					thumbnail={swapp.extras?.attachmentThumbnail}
					{cardStyleType}
				/>
			</div>
		{:else if swapp.title === 'Text'}
			<div class={cn(animationClass, getStaggerClass(index, cardStyleType))}>
				<CardText {isColor} {textColor} text={swapp.detail} {cardStyleType} />
			</div>
		{:else if swapp.title === 'File'}
			<div class={cn(animationClass, getStaggerClass(index, cardStyleType))}>
				<CardLink
					{isColor}
					{textColor}
					src={swapp.title}
					detail={swapp.detail}
					link={swapp.extras.attachmentFilePath}
					{cardStyleType}
					onClick={() => onContentClick?.(swapp.title)}
				/>
			</div>
		{:else if swapp.type === 'phoneNumber'}
			<div class={cn(animationClass, getStaggerClass(index, cardStyleType))}>
				<CardLink
					{isColor}
					{textColor}
					src={swapp.title}
					detail={`${swapp.extras?.countryCode ?? ''}${swapp.detail}`}
					link={swapp.link}
					customIcon={swapp.extras?.customIcon}
					customName={swapp.extras?.customName}
					customTitle={swapp.extras?.customTitle}
					{cardStyleType}
					onClick={() => onContentClick?.(swapp.title)}
				/>
			</div>
		{:else if swapp.title === 'Link'}
			<div class={cn(animationClass, getStaggerClass(index, cardStyleType))}>
				<CardLink
					{isColor}
					{textColor}
					src={swapp.title}
					detail={swapp.extras?.linkName}
					link={swapp.detail}
					customIcon={swapp.extras?.customIcon}
					customName={swapp.extras?.customName}
					customTitle={swapp.extras?.customTitle}
					{cardStyleType}
					onClick={() => onContentClick?.(swapp.extras?.customName || 'link')}
				/>
			</div>
		{:else}
			<div class={cn(animationClass, getStaggerClass(index, cardStyleType))}>
				<CardLink
					{isColor}
					{textColor}
					src={swapp.title}
					detail={swapp.detail}
					link={swapp.link}
					customIcon={swapp.extras?.customIcon}
					customName={swapp.extras?.customName}
					customTitle={swapp.extras?.customTitle}
					{cardStyleType}
					onClick={() => onContentClick?.(swapp.title)}
				/>
			</div>
		{/if}
	{/each}
</div>
