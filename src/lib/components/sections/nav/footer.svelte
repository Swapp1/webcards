<script lang="ts">
	let { isColor }: { isColor: boolean } = $props();
</script>

<footer
	class="flex w-full flex-col items-center justify-center py-4 sm:pb-0 sm:pt-6"
	style:color={isColor ? 'white' : 'hsl(var(--text))'}
>
	<p class="text-[0.8125rem] font-medium leading-[1.125rem] tracking-[0.0125rem]">
		Powered by <span class="text-[#F85510]">Swapp</span>
	</p>
	<div
		class="flex w-full items-center justify-between text-[0.625rem] font-light leading-[1.125rem] tracking-[0.0125rem]"
	>
		<a href="https://www.swapp.fr/privacypolicy" target="_blank">Privacy policy</a>
		<a href="https://www.swapp.fr/terms" target="_blank">Terms & conditions</a>
	</div>
</footer>
