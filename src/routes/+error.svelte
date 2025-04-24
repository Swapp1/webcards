<script lang="ts">
	import Logo from '$lib/components/sections/nav/logo.svelte';
	import SwappError from '$lib/components/sections/swapp-error.svelte';
</script>

<main
	class="relative flex h-full min-h-screen w-full items-center justify-center bg-white from-[#F85510]/30 to-[#FFB162]/30 dark:bg-black sm:items-end sm:bg-gradient-to-b dark:sm:bg-transparent"
>
	<Logo className="hidden sm:flex  absolute  top-6 right-6" iconClass="sm:w-12 sm:h-12" />

	<SwappError />
</main>
