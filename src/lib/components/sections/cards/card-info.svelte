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

	// Pre-computed style values
	const styles = $derived({
		nameSize: styleConfig?.nameFontSize ?? 32,
		nameSizeMobile: Math.round((styleConfig?.nameFontSize ?? 32) * 0.82),
		nameWeight: styleConfig?.nameFontWeight ?? 700,
		nameSpacing: styleConfig?.nameLetterSpacing ?? -1,
		descSize: styleConfig?.descFontSize ?? 18,
		descSizeMobile: Math.round((styleConfig?.descFontSize ?? 18) * 0.85),
		descWeight: styleConfig?.descFontWeight ?? 500,
		bioSize: styleConfig?.bioFontSize ?? 15,
		bioSizeMobile: Math.round((styleConfig?.bioFontSize ?? 15) * 0.9),
		bioWeight: styleConfig?.bioFontWeight ?? 400,
		logoSize: styleConfig?.companyLogoSize ?? 56,
		logoSizeMobile: Math.round((styleConfig?.companyLogoSize ?? 56) * 0.75),
	});
</script>

<div
	class="card-info absolute bottom-0 flex h-fit w-full flex-col px-6 pb-16 pt-20 text-white md:px-9 md:pb-20"
	style:background="linear-gradient(180deg, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 0.5) 100%)"
	style:--name-size="{styles.nameSize}px"
	style:--name-size-mobile="{styles.nameSizeMobile}px"
	style:--name-weight={styles.nameWeight}
	style:--name-spacing="{styles.nameSpacing}px"
	style:--desc-size="{styles.descSize}px"
	style:--desc-size-mobile="{styles.descSizeMobile}px"
	style:--desc-weight={styles.descWeight}
	style:--bio-size="{styles.bioSize}px"
	style:--bio-size-mobile="{styles.bioSizeMobile}px"
	style:--bio-weight={styles.bioWeight}
	style:--logo-size="{styles.logoSize}px"
	style:--logo-size-mobile="{styles.logoSizeMobile}px"
>
	<div class="flex items-center gap-4 md:gap-5">
		<div class="flex flex-1 flex-col justify-center gap-1 md:gap-[0.5625rem]">
			<h1 class="card-info-name font-inter">{title}</h1>
			<span class="card-info-desc font-inter">{heading}</span>
			{#if bio}
				<p class="card-info-bio font-inter opacity-80">{bio}</p>
			{/if}
		</div>

		{#if !isCardPersonal && companyLogo}
			{@const LogoWrapper = companyLink ? 'a' : 'div'}
			<svelte:element
				this={LogoWrapper}
				href={companyLink ? `//${companyLink}` : undefined}
				target={companyLink ? '_blank' : undefined}
				class="card-info-logo flex-shrink-0 self-center rounded-full border-white"
			>
				<img
					src={companyLogo}
					alt={companyName}
					class="h-full w-full rounded-full object-cover"
					style:display={imgLoading ? 'none' : 'block'}
					loading="lazy"
					onload={() => { imgLoading = false; }}
				/>
			</svelte:element>
			{#if imgLoading}
				<Skeleton class="card-info-logo flex-shrink-0 self-center rounded-full border-white bg-black/30 dark:bg-white/30" />
			{/if}
		{/if}
	</div>

	{#if !isCardPersonal && skills && skills.length !== 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each skills as skill}
				<Badge class="rounded-[1.25rem] bg-white/25 px-3 py-1.5 text-xs leading-3 text-white backdrop-blur-[2px]">
					{skill}
				</Badge>
			{/each}
		</div>
	{/if}
</div>

<style>
	.card-info-name {
		font-size: var(--name-size-mobile);
		font-weight: var(--name-weight);
		letter-spacing: var(--name-spacing);
		line-height: 1.1;
	}

	.card-info-desc {
		font-size: var(--desc-size-mobile);
		font-weight: var(--desc-weight);
		line-height: 1.3;
	}

	.card-info-bio {
		margin-top: 0.25rem;
		font-size: var(--bio-size-mobile);
		font-weight: var(--bio-weight);
		line-height: 1.4;
	}

	.card-info-logo {
		width: var(--logo-size-mobile);
		height: var(--logo-size-mobile);
		border-width: 2px;
	}

	@media (min-width: 768px) {
		.card-info-name {
			font-size: var(--name-size);
		}

		.card-info-desc {
			font-size: var(--desc-size);
		}

		.card-info-bio {
			margin-top: 0.375rem;
			font-size: var(--bio-size);
		}

		.card-info-logo {
			width: var(--logo-size);
			height: var(--logo-size);
			border-width: 3px;
		}
	}
</style>
