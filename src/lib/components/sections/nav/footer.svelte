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

<!-- Mobile footer -->
<footer
	class={cn(
		'flex flex-col items-center justify-center pb-4 pt-6 font-inter sm:hidden',
		isColor && textColor === 'black' && 'text-black',
		isColor && textColor === 'white' && 'text-white',
		!isColor && 'text-black dark:text-white'
	)}
>
	<!-- Privacy Policy (left) and Terms (right) -->
	<div
		class={cn(
			'flex w-full items-center justify-between px-6 text-xs font-light',
			isColor && textColor === 'black' && 'text-black/50',
			isColor && textColor === 'white' && 'text-white/50',
			!isColor && 'text-black/50 dark:text-white/50'
		)}
	>
		<a
			href="https://www.swapp.fr/privacy_policy"
			target="_blank"
			class="transition-opacity hover:opacity-80"
		>
			Privacy policy
		</a>
		<a
			href="https://www.swapp.fr/terms"
			target="_blank"
			class="transition-opacity hover:opacity-80"
		>
			Terms
		</a>
	</div>

	<!-- Powered by Swapp (centered, below, on one line) -->
	<a href="https://download.swapp.fr" target="_blank" class="mt-4 flex items-center gap-1.5">
		<span
			class={cn(
				'text-sm font-light',
				isColor && textColor === 'black' && 'text-black/60',
				isColor && textColor === 'white' && 'text-white/60',
				!isColor && 'text-black/60 dark:text-white/60'
			)}
		>
			Powered by
		</span>
		<span class="text-sm font-semibold">Swapp</span>
	</a>
</footer>

<!-- Desktop footer -->
<footer
	class={cn(
		'hidden w-full items-center justify-between pb-0 pt-12 font-inter sm:flex',
		isColor && textColor === 'black' && 'text-black',
		isColor && textColor === 'white' && 'text-white',
		!isColor && 'text-black dark:text-white'
	)}
>
	<a
		href="https://www.swapp.fr/privacy_policy"
		target="_blank"
		class={cn(
			'text-xs font-light transition-opacity hover:opacity-80',
			isColor && textColor === 'black' && 'text-black/50',
			isColor && textColor === 'white' && 'text-white/50',
			!isColor && 'text-black/50 dark:text-white/50'
		)}
	>
		Privacy policy
	</a>

	<a href="https://download.swapp.fr" target="_blank" class="flex items-center gap-2">
		<span
			class={cn(
				'text-sm font-light',
				isColor && textColor === 'black' && 'text-black/60',
				isColor && textColor === 'white' && 'text-white/60',
				!isColor && 'text-black/60 dark:text-white/60'
			)}
		>
			Powered by
		</span>
		<span class="text-base font-semibold">Swapp</span>
	</a>

	<a
		href="https://www.swapp.fr/terms"
		target="_blank"
		class={cn(
			'text-xs font-light transition-opacity hover:opacity-80',
			isColor && textColor === 'black' && 'text-black/50',
			isColor && textColor === 'white' && 'text-white/50',
			!isColor && 'text-black/50 dark:text-white/50'
		)}
	>
		Terms
	</a>
</footer>
