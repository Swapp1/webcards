<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		text,
		isColor
	}: {
		text: string;
		isColor: boolean;
	} = $props();
</script>

<p
	class={cn(
		'animate-touch flex items-center gap-4 rounded-[24px]  px-4 py-5  text-sm md:px-[1.375rem] md:py-6 md:text-base',
		isColor ? 'bg-white/20 text-white' : 'bg-white dark:bg-[#1B1B1B]'
	)}
>
	{text}
</p>
