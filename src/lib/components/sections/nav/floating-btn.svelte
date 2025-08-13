<script lang="ts">
	import { argbToHex } from '@/hooks/icons';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Skeleton from '@/components/ui/skeleton/skeleton.svelte';

	let visible = true;
	export let color: string | undefined;
	export let pic: string;
</script>

{#if visible}
	<div
		class="fixed bottom-2 left-1/2 z-50 flex
           w-[96%] max-w-md -translate-x-1/2 transform
           items-center justify-between rounded-lg
           bg-white px-3 py-2 text-black shadow lg:hidden"
	>
		<!-- Zone cliquable entière sauf la croix -->
		<a href="https://download.swapp.fr" target="_blank" class="flex flex-1 items-center">
			<!-- Logo -->
			<img
				src="swapp.svg"
				alt="Swapp logo"
				class="mr-[0.35rem] h-[23px] w-[23px] flex-shrink-0 rounded-[0.35rem]"
			/>

			<!-- Texte aligné en bas + padding-bottom pour le remonter -->
			<span class="flex items-baseline space-x-3 pt-0.5">
				<span class="text-[1.1rem] font-semibold leading-none">Swapp</span>
				<span class="text-[0.87rem] font-medium leading-none">Create your free card now</span>
			</span>
		</a>

		<!-- Croix de fermeture -->
		<button class="" aria-label="Close" on:click={() => (visible = false)}>
			<svg
				width="19"
				height="19"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>

	<div
		class="fixed bottom-6 flex-col gap-3 right-6 z-50 hidden w-[240px] items-center justify-center rounded-lg bg-white px-4 py-5 dark:bg-black lg:flex"
		style:background={color && argbToHex(color)}
	>
		<div
			class="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale"
		>
			<Avatar.Root>
				<Avatar.Image src={pic} alt="@User" />
				<Avatar.Fallback>
          <Skeleton class="h-full w-full" />
        </Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Image src="swapp.svg" alt="@swapp" />
				<Avatar.Fallback>
          <Skeleton class="h-full w-full" />
        </Avatar.Fallback>
			</Avatar.Root>
		</div>

		<span class="text-sm font-semibold leading-none">Create your free card now</span>

		<button class="absolute right-2 top-2" aria-label="Close" on:click={() => (visible = false)}>
			<svg
				width="19"
				height="19"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	</div>
{/if}
