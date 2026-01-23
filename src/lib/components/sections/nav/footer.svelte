<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		isColor,
		textColor = null
	}: {
		isColor: boolean;
		textColor?: 'black' | 'white' | null;
	} = $props();
</script>

<footer
	class={cn(
		'flex flex-col items-center justify-center pb-20 pt-10 font-inter',
		isColor && textColor === 'black' && 'text-black',
		isColor && textColor === 'white' && 'text-white',
		!isColor && 'text-black dark:text-white'
	)}
>
	<a href="https://download.swapp.fr" target="_blank" class="flex flex-col items-center">
		<img
			src="/swapp.svg"
			alt="Swapp logo"
			class="mb-2 h-7 w-auto rounded-[0.4rem]"
			width="28"
			height="28"
		/>
		<p class="mb-4 text-base font-semibold leading-tight">Create your card</p>
	</a>

	<div
		class={cn(
			'flex items-center text-sm font-light leading-snug tracking-wide',
			isColor && textColor === 'black' && 'text-black/50',
			isColor && textColor === 'white' && 'text-white/50',
			!isColor && 'text-gray-400 dark:text-gray-500'
		)}
	>
		<a
			href="https://www.swapp.fr/terms"
			target="_blank"
			class="px-1 transition-opacity hover:opacity-80"
		>
			Terms
		</a>
		<div class="h-3 border-l border-current"></div>
		<a
			href="https://www.swapp.fr/privacy_policy"
			target="_blank"
			class="px-1 transition-opacity hover:opacity-80"
		>
			Privacy policy
		</a>
	</div>
</footer>
