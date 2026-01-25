<script lang="ts">
	import { argbToHex } from '@/hooks/icons';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Skeleton from '@/components/ui/skeleton/skeleton.svelte';

	export let color: string | undefined;
	export let pic: string;
	export let textColor: 'black' | 'white' | null = null;
</script>

<!-- Desktop only: Create your free card button -->
<a
	href="https://swapp.fr"
	target="_blank"
	rel="noopener noreferrer"
	class="fixed bottom-4 right-4 z-50 hidden w-[200px] flex-col items-center justify-center gap-3 rounded-xl px-4 py-4 lg:flex"
	style:background={color ? argbToHex(color) : 'rgba(30, 30, 30, 0.95)'}
	style:color={color ? (textColor === 'black' ? 'black' : 'white') : 'white'}
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

	<span class="whitespace-nowrap text-sm font-semibold leading-none">Create your free card now</span>
</a>
