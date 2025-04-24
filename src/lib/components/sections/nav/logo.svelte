<script lang="ts">
	import Logo from '$lib/assets/icons.svg';
	import { cn } from '$lib/utils';

	let {
		className,
		iconClass
	}: {
		className?: string;
		iconClass?: string;
	} = $props();
</script>

<a href={'https://swapp.fr'} target="_blank" class={cn(className)}>
	<img src={Logo} alt="Logo" class={cn('h-[29px] w-7', iconClass)} width="28" height="29" />
</a>
