<script lang="ts">
	import { getIcons } from '$lib/hooks/icons';
	import { cn } from '$lib/utils';
	import { getStyleConfig, type CardStyleType } from '$lib/config/card-styles';

	let {
		src = '',
		detail = '',
		link = '',
		isColor,
		textColor = null,
		customIcon,
		customName,
		customTitle,
		cardStyleType = 'original',
		onClick
	}: {
		src?: string;
		detail?: string;
		link?: string;
		isColor: boolean;
		textColor?: 'black' | 'white' | null;
		customIcon?: string;
		customName?: string;
		customTitle?: string;
		cardStyleType?: CardStyleType;
		onClick?: () => void;
	} = $props();

	const styleConfig = $derived(getStyleConfig(cardStyleType));

	const validLink = $derived.by(() => {
		if (src === 'Link') {
			return link.match(/^[a-z][a-z0-9+.-]*:\/\//i) ? link : `https://${link}`;
		}
		if (src === 'Email' || src === 'Gmail') return `mailto:${detail}`;
		if (src === 'Phone' || src === 'Phone number') return `tel:${detail}`;
		if (link) return `${link}${detail}`;
		return '';
	});

	const haveAt = $derived(
		src !== 'Whatsapp number' && src !== 'Link' && link ? '@' : ''
	);

	const displayTitle = $derived(customTitle || customName || (src === 'Link' ? detail : src));
	const displayDetail = $derived(src === 'Link' ? link : detail);

	const [light, dark] = getIcons(src);
</script>

<a
	href={validLink || undefined}
	target={validLink ? '_blank' : undefined}
	rel={validLink ? 'noopener noreferrer' : undefined}
	class={cn(
		'animate-touch flex items-center gap-4 px-4 py-3 md:px-[1.375rem] md:py-[1.125rem] tile-radius',
		isColor && textColor === 'black' && 'bg-black/10',
		isColor && textColor === 'white' && 'bg-white/20',
		!isColor && 'bg-white dark:bg-[#1E1E1E]'
	)}
	style="--tile-radius: {styleConfig.tileBorderRadius}px; --tile-radius-desktop: {styleConfig.tileBorderRadiusDesktop}px;"
	onclick={onClick}
>
	{#if customIcon}
		<img
			src={customIcon}
			class="h-12 w-12 rounded-full object-cover md:h-14 md:w-14"
			alt={src}
			width="48"
			height="48"
			loading="lazy"
		/>
	{:else}
		<img
			src={light}
			class={cn('h-12 w-12 md:h-14 md:w-14', !isColor && 'dark:hidden')}
			alt={src}
			width="48"
			height="48"
			loading="lazy"
		/>
		{#if !isColor}
			<img
				src={dark}
				class="hidden h-12 w-12 dark:block md:h-14 md:w-14"
				alt={src}
				width="48"
				height="48"
				loading="lazy"
			/>
		{/if}
	{/if}
	<div
		class={cn(
			'flex min-w-0 flex-1 flex-col gap-1.5 font-inter',
			isColor && textColor === 'black' && 'text-black',
			isColor && textColor === 'white' && 'text-white',
			!isColor && 'text-black dark:text-white'
		)}
	>
		<h2 class="text-[1.06rem] font-semibold leading-4 md:text-lg md:leading-5">
			{displayTitle}
		</h2>
		<h3
			class={cn(
				'truncate text-xs font-normal leading-3 md:text-sm md:leading-3.5',
				isColor && textColor === 'black' && 'text-black/50',
				isColor && textColor === 'white' && 'text-white/50',
				!isColor && 'text-black/50 dark:text-white/50'
			)}
		>
			{haveAt}{displayDetail}
		</h3>
	</div>
</a>
