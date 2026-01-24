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
	// Mobile sizes are slightly smaller
	const getNameFontSize = () => styleConfig?.nameFontSize ?? 32;
	const getNameFontSizeMobile = () => Math.round((styleConfig?.nameFontSize ?? 32) * 0.82);
	const getNameFontWeight = () => styleConfig?.nameFontWeight ?? 700;
	const getNameLetterSpacing = () => styleConfig?.nameLetterSpacing ?? -1;
	const getDescFontSize = () => styleConfig?.descFontSize ?? 18;
	const getDescFontSizeMobile = () => Math.round((styleConfig?.descFontSize ?? 18) * 0.85);
	const getDescFontWeight = () => styleConfig?.descFontWeight ?? 500;
	const getBioFontSize = () => styleConfig?.bioFontSize ?? 15;
	const getBioFontSizeMobile = () => Math.round((styleConfig?.bioFontSize ?? 15) * 0.9);
	const getBioFontWeight = () => styleConfig?.bioFontWeight ?? 400;
	const getCompanyLogoSize = () => styleConfig?.companyLogoSize ?? 56;
	const getCompanyLogoSizeMobile = () => Math.round((styleConfig?.companyLogoSize ?? 56) * 0.75);
</script>

<div
	class="absolute bottom-0 flex h-fit w-full flex-col px-6 pb-16 pt-20 text-white md:px-9 md:pb-20"
	style:background="linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.5) 100%)"
>
	<div class="flex items-center gap-4 md:gap-5">
		<div class="flex flex-1 flex-col justify-center gap-1 md:gap-[0.5625rem]">
			<!-- Mobile: smaller text, Desktop: full size -->
			<h1
				class="font-inter hidden md:block"
				style="font-size: {getNameFontSize()}px; font-weight: {getNameFontWeight()}; letter-spacing: {getNameLetterSpacing()}px; line-height: 1.1;"
			>
				{title}
			</h1>
			<h1
				class="font-inter md:hidden"
				style="font-size: {getNameFontSizeMobile()}px; font-weight: {getNameFontWeight()}; letter-spacing: {getNameLetterSpacing()}px; line-height: 1.1;"
			>
				{title}
			</h1>
			<span
				class="font-inter hidden md:block"
				style="font-size: {getDescFontSize()}px; font-weight: {getDescFontWeight()}; line-height: 1.3;"
			>
				{heading}
			</span>
			<span
				class="font-inter md:hidden"
				style="font-size: {getDescFontSizeMobile()}px; font-weight: {getDescFontWeight()}; line-height: 1.3;"
			>
				{heading}
			</span>
			{#if bio}
				<p
					class="mt-1.5 font-inter opacity-80 hidden md:block"
					style="font-size: {getBioFontSize()}px; font-weight: {getBioFontWeight()}; line-height: 1.4;"
				>
					{bio}
				</p>
				<p
					class="mt-1 font-inter opacity-80 md:hidden"
					style="font-size: {getBioFontSizeMobile()}px; font-weight: {getBioFontWeight()}; line-height: 1.4;"
				>
					{bio}
				</p>
			{/if}
		</div>

		{#if !isCardPersonal && companyLogo}
			{#if companyLink}
				<!-- Desktop logo -->
				<a
					href={`//${companyLink}`}
					target="_blank"
					class="hidden md:flex flex-shrink-0 self-center rounded-full border-[3px] border-white"
					style="width: {getCompanyLogoSize()}px; height: {getCompanyLogoSize()}px;"
				>
					<img
						src={companyLogo}
						alt={companyName}
						class="rounded-full object-cover"
						style="width: 100%; height: 100%;"
						style:display={imgLoading ? 'none' : 'block'}
						onload={() => {
							imgLoading = false;
						}}
					/>
				</a>
				<!-- Mobile logo -->
				<a
					href={`//${companyLink}`}
					target="_blank"
					class="md:hidden flex-shrink-0 self-center rounded-full border-2 border-white"
					style="width: {getCompanyLogoSizeMobile()}px; height: {getCompanyLogoSizeMobile()}px;"
				>
					<img
						src={companyLogo}
						alt={companyName}
						class="rounded-full object-cover"
						style="width: 100%; height: 100%;"
						style:display={imgLoading ? 'none' : 'block'}
						onload={() => {
							imgLoading = false;
						}}
					/>
				</a>
			{:else}
				<!-- Desktop logo -->
				<div
					class="hidden md:flex flex-shrink-0 self-center rounded-full border-[3px] border-white"
					style="width: {getCompanyLogoSize()}px; height: {getCompanyLogoSize()}px;"
				>
					<img
						src={companyLogo}
						alt={companyName}
						class="rounded-full object-cover"
						style="width: 100%; height: 100%;"
						style:display={imgLoading ? 'none' : 'block'}
						onload={() => {
							imgLoading = false;
						}}
					/>
				</div>
				<!-- Mobile logo -->
				<div
					class="md:hidden flex-shrink-0 self-center rounded-full border-2 border-white"
					style="width: {getCompanyLogoSizeMobile()}px; height: {getCompanyLogoSizeMobile()}px;"
				>
					<img
						src={companyLogo}
						alt={companyName}
						class="rounded-full object-cover"
						style="width: 100%; height: 100%;"
						style:display={imgLoading ? 'none' : 'block'}
						onload={() => {
							imgLoading = false;
						}}
					/>
				</div>
			{/if}
			{#if imgLoading}
				<!-- Desktop skeleton -->
				<Skeleton
					class="hidden md:flex flex-shrink-0 self-center rounded-full border-[3px] border-white bg-black/30 dark:bg-white/30"
					style="width: {getCompanyLogoSize()}px; height: {getCompanyLogoSize()}px;"
				/>
				<!-- Mobile skeleton -->
				<Skeleton
					class="md:hidden flex-shrink-0 self-center rounded-full border-2 border-white bg-black/30 dark:bg-white/30"
					style="width: {getCompanyLogoSizeMobile()}px; height: {getCompanyLogoSizeMobile()}px;"
				/>
			{/if}
		{/if}
	</div>

	{#if !isCardPersonal && skills && skills.length !== 0}
		<div class="mt-4 flex flex-wrap gap-2">
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
