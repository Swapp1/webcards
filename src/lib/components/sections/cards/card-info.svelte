<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { cn } from '$lib/utils';
	import type { CardStyleConfig } from '$lib/config/card-styles';

	let {
		title,
		heading,
		isCardPersonal,
		companyLink,
		companyLogo,
		companyName,
		skills,
		bio,
		styleConfig
	}: {
		title: string;
		heading: string;
		isCardPersonal: boolean;
		companyLink?: string;
		companyLogo?: string;
		companyName?: string;
		skills?: string[];
		bio?: string;
		styleConfig?: CardStyleConfig;
	} = $props();

	let imgLoading = $state(true);

	// Default style values if no config provided
	const getNameFontSize = () => styleConfig?.nameFontSize ?? 28;
	const getNameFontWeight = () => styleConfig?.nameFontWeight ?? 700;
	const getNameLetterSpacing = () => styleConfig?.nameLetterSpacing ?? -1;
	const getDescFontSize = () => styleConfig?.descFontSize ?? 14;
	const getDescFontWeight = () => styleConfig?.descFontWeight ?? 500;
	const getBioFontSize = () => styleConfig?.bioFontSize ?? 12;
	const getBioFontWeight = () => styleConfig?.bioFontWeight ?? 400;
	const getCompanyLogoSize = () => styleConfig?.companyLogoSize ?? 50;
</script>

<div
	class="absolute bottom-0 flex h-fit w-full flex-col px-6 pb-11 pt-20 text-white md:px-9 md:pb-12"
	style:background="linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.5) 100%)"
>
	<div class={cn('flex items-center justify-center gap-4', companyLogo && 'items-end')}>
		<div class="flex w-full flex-col justify-center gap-[0.5625rem]">
			<h1
				class="font-inter"
				style="font-size: {getNameFontSize()}px; font-weight: {getNameFontWeight()}; letter-spacing: {getNameLetterSpacing()}px; line-height: 1.1;"
			>
				{title}
			</h1>
			<span
				class="font-inter"
				style="font-size: {getDescFontSize()}px; font-weight: {getDescFontWeight()}; line-height: 1.3;"
			>
				{heading}
			</span>
		</div>

		{#if !isCardPersonal && companyLogo}
			{#if companyLink}
				<a
					href={`//${companyLink}`}
					target="_blank"
					class="rounded-full"
					style="width: {getCompanyLogoSize()}px; height: {getCompanyLogoSize()}px;"
				>
					<img
						src={companyLogo}
						alt={companyName}
						class="rounded-full object-cover"
						style="width: {getCompanyLogoSize()}px; height: {getCompanyLogoSize()}px;"
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
					class="rounded-full object-cover"
					style="width: {getCompanyLogoSize()}px; height: {getCompanyLogoSize()}px;"
					style:display={imgLoading ? 'none' : 'block'}
					onload={() => {
						imgLoading = false;
					}}
				/>
			{/if}
			{#if imgLoading}
				<Skeleton
					class="rounded-full bg-black/30 dark:bg-white/30"
					style="width: {getCompanyLogoSize()}px; height: {getCompanyLogoSize()}px;"
				/>
			{/if}
		{/if}
	</div>

	{#if isCardPersonal && bio}
		<p
			class="pt-4 font-inter"
			style="font-size: {getBioFontSize()}px; font-weight: {getBioFontWeight()}; line-height: 1.4;"
		>
			{bio}
		</p>
	{/if}

	{#if !isCardPersonal && skills && skills.length !== 0}
		<div class="flex flex-wrap gap-2 pt-4">
			{#each skills as skill}
				<Badge
					class="rounded-[1.25rem] bg-white/25 px-3 py-1.5 text-xs leading-3 text-white backdrop-blur-[2px]"
				>
					{skill}
				</Badge>
			{/each}
		</div>
	{/if}
</div>
