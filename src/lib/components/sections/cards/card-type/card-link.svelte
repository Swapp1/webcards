<script lang="ts">
	import { getIcons } from '$lib/hooks/icons';
	import { cn } from '$lib/utils';

	let {
		src,
		detail,
		link,
		isColor
	}: {
		src: string;
		detail: string;
		link: string;
		isColor: boolean;
	} = $props();

	const validLink = $derived.by(() => {
		if (src === 'Link') return `//${detail}`;
		if (src === 'Email' || src === 'Gmail') return `mailto:${detail}`;
		if (src === 'Phone' || src === 'Phone number') return `tel:${detail}`;
		if (link) return `${link}${detail}`;
		if (link === '') return '';
	});

	const haveAt = $derived.by(() => {
		if (src === 'Whatsapp number') return '';
		if (link) return '@';
	});

	const [light, dark] = getIcons(src);
</script>

<a
	href={validLink || undefined}
	target={validLink ? "_blank" : undefined}
	class={cn(
		'animate-touch flex items-center gap-[1rem] rounded-lg px-4 py-3 md:px-[1.375rem] md:py-[1.125rem]',
		isColor ? 'bg-white/20' : 'bg-white dark:bg-[#1B1B1B]'
	)}
>
	<img
		src={light}
		class={cn(
			'h-[48px] w-[48px] md:h-[56px] md:w-[56px]',
			!isColor && 'dark:hidden'
		)}
		alt={src}
		width="48"
		height="48"
	/>
	{#if !isColor}
		<img
			src={dark}
			class="hidden h-[48px] w-[48px] dark:block md:h-[56px] md:w-[56px]"
			alt={src}
			width="48"
			height="48"
		/>
	{/if}
	<div
		class={cn(
			'flex flex-col gap-[0.375rem]',
			isColor ? 'text-white' : 'text-black dark:text-white'
		)}
	>
		<h2 class="text-[1.06rem] leading-4 md:text-xl md:leading-5">{src}</h2>
		<h3
			class={cn(
				'text-[0.75rem] font-light leading-[0.75rem] md:text-sm md:leading-[0.875rem]',
				isColor ? 'text-white/70' : 'text-black/70 dark:text-white/70'
			)}
		>
			{haveAt}{detail}
		</h3>
	</div>
</a>
