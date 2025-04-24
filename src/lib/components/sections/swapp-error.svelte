<script lang="ts">
	import UserLight from '$lib/assets/user-light.svg';
	import UserDark from '$lib/assets/user-dark.svg';
	import UserLG from '$lib/assets/user.svg';
	import UserLGLight from '$lib/assets/user-lg-light.svg';
	import { Button } from '$lib/components/ui/button';
	import { getAllIcons } from '$lib/hooks/icons';

	let icons = getAllIcons();
</script>


<section
	class="flex h-full w-full max-w-[42.8125rem] flex-col items-center justify-center bg-white dark:bg-black sm:rounded-t-[30px] sm:bg-[#F5F5F5] sm:dark:bg-[#3D3D3D]"
>
	<div
		class="flex w-full flex-col items-center justify-center gap-7 sm:rounded-t-[30px] sm:pb-12 sm:pt-14"
	>
		<img src={UserLight} alt="User" class="dark:hidden sm:hidden" width="135" height="135" />
		<img
			src={UserDark}
			alt="User"
			class="hidden dark:block sm:dark:hidden"
			width="135"
			height="135"
		/>
		<img src={UserLG} alt="User" class="hidden sm:block dark:sm:hidden" width="120" height="120" />
		<img src={UserLGLight} alt="User" class="hidden dark:sm:block" width="120" height="120" />
		<span
			class="text-[1.375rem] font-medium leading-[1.375rem] text-[#6D6D6D] dark:text-[#ECECEC] sm:text-4xl sm:leading-9 sm:text-black/50"
			>Card not found</span
		>
	</div>

	<div
		class="relative w-full pb-[67px] pt-[53px] sm:rounded-t-[2.1875rem] sm:bg-white sm:dark:bg-black"
	>
		<hr
			class="absolute top-[53px] z-10 h-14 w-full border-none bg-gradient-to-b from-white to-transparent dark:from-black"
		/>

		<div class="relative h-screen max-h-[332px] w-full overflow-hidden">
			<div class="animate-scrollVertical">
				<div class="absolute -right-32 origin-top-left rotate-[20deg]">
					<div class="grid auto-rows-[64px] grid-cols-8 gap-5 sm:gap-6">
						{#each icons as icon, key}
							<img
								class="flex h-16 w-16 items-center justify-center"
								src={icon}
								alt={`Icon ${key}`}
								width="80"
								height="80"
							/>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<hr
			class="absolute bottom-[67px] h-14 w-full border-none bg-gradient-to-t from-white to-transparent dark:from-black"
		/>
	</div>

	<a
		href="https://www.swapp.fr/pages/faq"
		target="_blank"
		rel="noopener noreferrer"
		class="flex w-full items-center justify-center sm:bg-white sm:pb-12 sm:dark:bg-black"
	>
		<Button
			class="h-12 w-60 bg-black text-base dark:bg-white sm:h-16 sm:w-72 sm:text-[1.375rem] sm:leading-[1.375rem]"
			>What's happening?</Button
		>
	</a>
</section>
