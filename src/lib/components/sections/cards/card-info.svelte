<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { cn } from '$lib/utils';

	let {
		title,
		heading,
		isCardPersonal,

		companyLink,
		companyLogo,
		companyName,
		skills,
		bio
	}: {
		title: string;
		heading: string;
		isCardPersonal: boolean;

		companyLink?: string;
		companyLogo?: string;
		companyName?: string;
		skills?: string[];
		bio?: string;
	} = $props();

	let imgLoading = $state(true);
</script>

<div
	class="absolute bottom-0 flex h-fit w-full flex-col px-6 pb-11 pt-20 text-white md:px-9 md:pb-12"
	style:background="linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.4) 100%)"
>
	<div class={cn('flex items-center justify-center gap-4', companyLogo && 'items-end')}>
		<div class="flex w-full flex-col justify-center gap-[0.5625rem]">
			<h1
				class=" text-3xl font-semibold leading-100 tracking-[0.033em] md:text-[2.75rem] md:leading-[2.75rem] md:tracking-[0.0625rem]"
			>
				{title}
			</h1>
			<span class="text-[0.8125rem] leading-3 md:text-base md:leading-4">{heading}</span>
		</div>

		{#if !isCardPersonal && companyLogo}
			{#if companyLink}
				<a
					href={`//${companyLink}`}
					target="_blank"
					class="h-[3.75rem] w-full max-w-[3.75rem] rounded-full md:h-[5.375rem] md:max-w-[5.375rem]"
				>
					<img
						src={companyLogo}
						alt={companyName}
						class=" h-[3.75rem] w-[3.75rem] rounded-full object-cover md:h-[5.375rem] md:w-[5.375rem]"
						width="60"
						height="60"
						style:display={imgLoading ? 'none' : 'block'}
						onload={() => {
							imgLoading = false;
						}}
					/>
				</a>
			{:else}
				<img
					src={companyLogo}
					alt={companyName}
					class=" h-[3.75rem] w-[3.75rem] rounded-full object-cover md:h-[5.375rem] md:w-[5.375rem]"
					width="60"
					height="60"
					style:display={imgLoading ? 'none' : 'block'}
					onload={() => {
						imgLoading = false;
					}}
				/>
			{/if}
			{#if imgLoading}
				<Skeleton
					class="h-[3.75rem] w-full max-w-[3.75rem] rounded-full bg-black/30 dark:bg-white/30  md:h-[5.375rem] md:max-w-[5.375rem] "
				/>
			{/if}
		{/if}
	</div>
	{#if isCardPersonal && bio}
		<p class="pt-[0.9375rem] text-[0.8125rem] leading-3 md:text-sm md:leading-[0.875rem]">{bio}</p>
	{/if}

	{#if !isCardPersonal && skills && skills.length !== 0}
		<div class="flex gap-[0.375rem] pt-4">
			{#each skills as skill}
				<Badge
					class={'rounded-[1.25rem] bg-white/25 px-[0.5625rem] py-[0.375rem] leading-3 text-white backdrop-blur-[2px] md:px-[0.875rem] md:text-sm'}
					>{skill}</Badge
				>
			{/each}
		</div>
	{/if}
</div>
