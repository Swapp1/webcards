<script lang="ts">
	import Logo from '$lib/components/sections/nav/logo.svelte';
	import type { PageData } from './$types';

	import Swapps from '$lib/components/sections/cards/swapps.svelte';
	import { cn } from '$lib/utils';

	import { Drawer } from 'vaul-svelte';
	import { getTextColor } from '$lib/utils/color';

	import CardInfo from '$lib/components/sections/cards/card-info.svelte';
	import FloatingBtn from '$lib/components/sections/nav/floating-btn.svelte';
	import Footer from '$lib/components/sections/nav/footer.svelte';

	import DrawerIcon from '$lib/assets/add-contact.svg';
	import ActionBtn from '$lib/components/sections/cards/action-btn.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { argbToHex, hexToRgba } from '$lib/hooks/icons';
	import { tick } from 'svelte';
	import { parseCardStyleType, getStyleConfig } from '$lib/config/card-styles';

	let { data }: { data: PageData } = $props();

	const { card, params } = data;

	const isCardPersonal = $state(card.type === 'personal');

	// Parse card style type (with backward compatibility)
	const cardStyleType = $derived(parseCardStyleType(card.cardStyleType));
	const styleConfig = $derived(getStyleConfig(cardStyleType));

	// Normalise et valide la couleur
	const normalizeColor = (color: string | undefined | null): string | null => {
		if (!color) return null;
		if (color === '#FFFFFFFF' || color === '#FFFFFF') return null;

		// Si RGB (#RRGGBB), convertir en ARGB (#FFRRGGBB)
		if (color.length === 7) {
			return `#FF${color.substring(1)}`;
		}

		return color;
	};

	const coloredBg = $state(normalizeColor(card.cardColor));
	const textColor = $derived(coloredBg ? getTextColor(coloredBg) : null);

	// Get background color for non-cover styles
	const getBackgroundColor = () => {
		if (coloredBg) return argbToHex(coloredBg);
		if (cardStyleType === 'minimal') return '#F5F5F5';
		return 'hsl(var(--background))';
	};

	let imgLoading = $state(true);
	let cardScrollElement: HTMLDivElement | undefined = $state();
	let isCardScrollable = $state(false);
	let imgHeight = $state(0);
	let imgEl: HTMLImageElement | undefined = $state();
	let windowWidth = $state(0);
	let topH = $state(0);

	// Sync window width
	$effect(() => {
		const updateWidth = () => {
			windowWidth = window.innerWidth;
		};

		updateWidth();
		window.addEventListener('resize', updateWidth);

		return () => window.removeEventListener('resize', updateWidth);
	});

	// Apply background colors
	$effect(() => {
		const bgColor = getBackgroundColor();

		document.body.style.background = bgColor;
		document.body.style.setProperty('--action-drawer', bgColor);
	});

	// Check scroll & calculate heights
	$effect(() => {
		let browserFontSize = 16;

		if (typeof window !== 'undefined') {
			const computedStyle = window.getComputedStyle(document.documentElement);
			browserFontSize = Number(computedStyle.fontSize.replace('px', ''));
		}

		topH = (windowWidth >= 768 ? imgHeight - 30 : imgHeight - 24) + 4 * browserFontSize;

		const checkScroll = async () => {
			await tick();

			if (cardScrollElement) {
				isCardScrollable =
					Math.round(topH + cardScrollElement.scrollHeight) > Math.round(window.innerHeight);
			}
		};

		checkScroll();
		window.addEventListener('resize', checkScroll);

		return () => window.removeEventListener('resize', checkScroll);
	});

	// Update image height on resize
	$effect(() => {
		const updateHeight = () => {
			if (imgEl) {
				imgHeight = imgEl.getBoundingClientRect().height;
			}
		};

		window.addEventListener('resize', updateHeight);

		return () => window.removeEventListener('resize', updateHeight);
	});

	// Generate gradient based on style
	const getGradientStyle = () => {
		if (!styleConfig.hasGradientOverlay) return '';

		if (styleConfig.gradientType === 'dark') {
			// Dark gradient for Original style
			return `linear-gradient(180deg,
				rgba(0, 0, 0, 0) 0%,
				rgba(0, 0, 0, 0.6) 8%,
				rgba(0, 0, 0, 0.8) 18%,
				rgba(0, 0, 0, 0.4) 35%,
				rgba(0, 0, 0, 0) 50%)`;
		} else if (styleConfig.gradientType === 'background') {
			// Background color gradient for Cover style
			const bgHex = coloredBg ? argbToHex(coloredBg) : 'hsl(var(--background))';
			const isPersonal = card.type === 'personal';

			if (isPersonal) {
				return `linear-gradient(180deg,
					${hexToRgba(bgHex, 0)} 75%,
					${hexToRgba(bgHex, 0.9)} 90%,
					${hexToRgba(bgHex, 1)} 95%)`;
			} else {
				return `linear-gradient(180deg,
					${hexToRgba(bgHex, 0)} 70%,
					${hexToRgba(bgHex, 0.9)} 88%,
					${hexToRgba(bgHex, 1)} 95%)`;
			}
		}

		return '';
	};

	// Get heading text based on card type
	const getHeadingText = () => {
		if (isCardPersonal) return card.heading;

		switch (card.professionalCardType) {
			case 'student':
				return `${card.schoolMajor} at ${card.schoolName}`;
			case 'staff':
				return `${card.jobTitle} at ${card.company}`;
			default:
				return card.heading;
		}
	};

	// Determine if we should show circular profile
	const showCircularProfile = $derived(styleConfig.hasCircularProfilePhoto);

	// Determine if we should show owner info card
	const showOwnerInfoCard = $derived(styleConfig.hasOwnerInfoCard);

	// Calculate cover height based on style
	const getCoverHeight = () => {
		if (showCircularProfile) {
			return cardStyleType === 'minimal' ? '0' : `${styleConfig.coverHeightVh}vh`;
		}
		return `${styleConfig.coverHeightVh}vh`;
	};
</script>

<svelte:head>
	<title>{card.displayName} - Swapp</title>
	<meta name="description" content="Swapp - Digital cards" />

	<!-- Facebook Meta Tags -->
	<meta property="og:url" content={`https://cards.swapp.fr/${params}`} />
	<meta property="og:type" content="website" />
	<meta
		property="og:title"
		content={!isCardPersonal && card.professionalCardType === 'staff'
			? `${card.displayName} - ${card.jobTitle} at ${card.company}`
			: `${card.displayName}`}
	/>
	<meta property="og:image:width" content="221" />
	<meta property="og:image:height" content="290" />
	<meta property="og:description" content="Swapp - Digital cards" />
	<meta property="og:image" content={card.profilePicture} />

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="cards.swapp.fr" />
	<meta property="twitter:url" content={`https://cards.swapp.fr/${params}`} />
	<meta
		name="twitter:title"
		content={!isCardPersonal && card.professionalCardType === 'staff'
			? `${card.displayName} - ${card.jobTitle} at ${card.company}`
			: `${card.displayName}`}
	/>
	<meta name="twitter:description" content="Swapp - Digital cards" />
	<meta name="twitter:image" content={card.profilePicture} />

	<!-- Preload profile image for faster LCP -->
	<link rel="preload" as="image" href={card.profilePicture} />
</svelte:head>

{#if imgLoading && !showCircularProfile}
	<div class="fixed z-[60] h-screen w-full bg-background">
		<div class="h-screen w-full bg-zinc-800">
			<div class={cn('relative flex w-full justify-center sm:h-screen sm:overflow-hidden')}>
				<div class="flex w-full flex-col items-center scroll-smooth sm:h-screen sm:overflow-auto">
					<hr class="hidden h-16 w-full border-0 sm:flex" />
					<main
						class="relative flex h-screen w-full flex-col rounded-t-[1.25rem] bg-black sm:max-w-[42.8125rem] md:rounded-t-[1.875rem]"
					>
						<div class="flex h-full items-center justify-center">
							<div class="flex h-full items-center justify-center space-x-2">
								<span class="sr-only">Loading...</span>
								<div
									class="h-4 w-4 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]"
								></div>
								<div
									class="h-4 w-4 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]"
								></div>
								<div class="h-4 w-4 animate-bounce rounded-full bg-gray-400"></div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class={cn(
	'relative flex w-full justify-center sm:h-screen sm:overflow-hidden',
	`card-style-${cardStyleType}`
)}>
	<!-- Desktop background blur (only for styles with cover image) -->
	{#if !showCircularProfile}
		<img
			src={card.profilePicture}
			alt={card.displayName}
			class="pointer-events-none absolute hidden h-screen w-full scale-105 object-cover opacity-70 filter sm:flex"
		/>
		<div
			class={cn('pointer-events-none absolute hidden h-screen w-full backdrop-blur-[200px] sm:flex')}
		></div>
	{/if}

	<Logo className="absolute right-6 top-6 hidden sm:flex" iconClass="lg:w-12 lg:h-12" />

	<div class="flex w-full flex-col items-center scroll-smooth sm:h-screen sm:overflow-auto">
		<hr class="hidden h-16 w-full border-0 sm:flex" />

		<main class="relative flex h-auto w-full flex-col sm:max-w-[42.8125rem]">
			<FloatingBtn color={coloredBg ?? undefined} pic={card.profilePicture} />

			<!-- PRO & MINIMAL STYLES: Circular Profile Photo Layout -->
			{#if showCircularProfile}
				<section
					class="relative flex flex-col items-center pt-12 pb-6 sm:rounded-t-[1.25rem]"
					style:background={coloredBg ? argbToHex(coloredBg) : (cardStyleType === 'minimal' ? '#F5F5F5' : 'hsl(var(--background))')}
				>
					<!-- Mobile header -->
					<div class="absolute top-5 flex w-full items-center justify-between px-4 sm:justify-center">
						<Drawer.Root shouldScaleBackground>
							<Drawer.Trigger class="sm:hidden">
								<img src={DrawerIcon} alt="Icon" width={25} height={25} class="h-[25px] w-[25px]" />
							</Drawer.Trigger>
							<Drawer.Portal>
								<Drawer.Overlay class="fixed inset-0 bg-black/40" />
								<Drawer.Content
									class={cn(
										'fixed bottom-0 z-20 flex h-1/5 w-full items-start justify-center rounded-t-[1.25rem] !bg-[var(--action-drawer)] pt-6 focus-visible:outline-none',
										'animate-in slide-in-from-bottom transition-all duration-300 ease-out'
									)}
								>
									<ActionBtn
										pic={card.profilePicture}
										text="Add to phone contacts"
										className={cn(
											'w-3/4 text-[0.9375rem] leading-[0.9375rem]',
											coloredBg && textColor === 'black' && '!bg-white !text-black',
											coloredBg && textColor === 'white' && '!bg-black !text-white',
											!coloredBg && '!bg-black !text-white'
										)}
										swapps={card.swapps}
										name={card.displayName}
										title={card.heading}
									/>
								</Drawer.Content>
							</Drawer.Portal>
						</Drawer.Root>

						<Logo className="sm:hidden" />
					</div>

					<!-- Circular Profile Photo -->
					<div class="relative mt-8">
						<img
							bind:this={imgEl}
							src={card.profilePicture}
							alt={card.displayName}
							class="profile-photo-circle shadow-lg"
							style="width: {styleConfig.circularProfilePhotoSize}px; height: {styleConfig.circularProfilePhotoSize}px;"
							fetchpriority="high"
							loading="eager"
							onload={async () => {
								imgLoading = false;
								await tick();
								if (imgEl) {
									imgHeight = imgEl.getBoundingClientRect().height;
								}
							}}
						/>

						<!-- Company Logo on Profile (Pro/Minimal) -->
						{#if !isCardPersonal && card.companyLogo && styleConfig.companyLogoPosition === 'coverBottomRight'}
							<div class="absolute -bottom-2 -right-2">
								{#if card.companyLink}
									<a href={`//${card.companyLink}`} target="_blank">
										<img
											src={card.companyLogo}
											alt={card.company}
											class="company-logo-cover shadow-md"
											style="width: {styleConfig.companyLogoSize}px; height: {styleConfig.companyLogoSize}px; border-width: {styleConfig.companyLogoBorderWidth}px;"
										/>
									</a>
								{:else}
									<img
										src={card.companyLogo}
										alt={card.company}
										class="company-logo-cover shadow-md"
										style="width: {styleConfig.companyLogoSize}px; height: {styleConfig.companyLogoSize}px; border-width: {styleConfig.companyLogoBorderWidth}px;"
									/>
								{/if}
							</div>
						{/if}
					</div>

					<!-- Owner Info Card -->
					{#if showOwnerInfoCard}
						<div
							class={cn(
								'owner-info-card mt-6 w-[calc(100%-2rem)] max-w-md',
								styleConfig.layoutAlignment === 'center' ? 'text-center' : 'text-left'
							)}
							style:background={coloredBg ? (textColor === 'black' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.85)') : 'white'}
							style:color={coloredBg ? (textColor === 'black' ? 'black' : 'white') : 'black'}
						>
							<h1
								class="font-inter"
								style="font-size: {styleConfig.nameFontSize}px; font-weight: {styleConfig.nameFontWeight}; letter-spacing: {styleConfig.nameLetterSpacing}px;"
							>
								{card.displayName}
							</h1>
							<p
								class="mt-1"
								style="font-size: {styleConfig.descFontSize}px; font-weight: {styleConfig.descFontWeight}; letter-spacing: {styleConfig.descLetterSpacing}px; opacity: {styleConfig.descOpacity};"
							>
								{getHeadingText()}
							</p>

							{#if card.bio}
								<p
									class="mt-3 opacity-70"
									style="font-size: {styleConfig.bioFontSize}px; font-weight: {styleConfig.bioFontWeight};"
								>
									{card.bio}
								</p>
							{/if}

							{#if !isCardPersonal && card.keySkills && card.keySkills.length > 0}
								<div class="mt-4 flex flex-wrap justify-center gap-2">
									{#each card.keySkills as skill}
										<Badge
											class={cn(
												'rounded-[1.25rem] px-3 py-1.5 text-xs',
												coloredBg && textColor === 'black' ? 'bg-black/10 text-black' :
												coloredBg && textColor === 'white' ? 'bg-white/20 text-white' :
												'bg-gray-100 text-gray-800'
											)}
										>
											{skill}
										</Badge>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</section>

			<!-- ORIGINAL, COVER, CLASSIC STYLES: Full Cover Image Layout -->
			{:else}
				<section class="relative">
					<img
						bind:this={imgEl}
						src={card.profilePicture}
						alt={card.displayName}
						class={cn(
							'w-full object-cover sm:rounded-t-[1.25rem]',
						)}
						style:height={getCoverHeight()}
						fetchpriority="high"
						loading="eager"
						style:display={imgLoading ? 'none' : 'block'}
						onload={async () => {
							imgLoading = false;
							await tick();

							if (imgEl) {
								imgHeight = imgEl.getBoundingClientRect().height;
							}
						}}
					/>

					<div class="absolute top-5 flex w-full items-center justify-between px-4 sm:justify-center">
						<Drawer.Root shouldScaleBackground>
							<Drawer.Trigger class="sm:hidden">
								<img src={DrawerIcon} alt="Icon" width={25} height={25} class="h-[25px] w-[25px]" />
							</Drawer.Trigger>
							<Drawer.Portal>
								<Drawer.Overlay class="fixed inset-0 bg-black/40" />
								<Drawer.Content
									class={cn(
										'fixed bottom-0 z-20 flex h-1/5 w-full items-start justify-center rounded-t-[1.25rem] !bg-[var(--action-drawer)] pt-6 focus-visible:outline-none',
										'animate-in slide-in-from-bottom transition-all duration-300 ease-out'
									)}
								>
									<ActionBtn
										pic={card.profilePicture}
										text="Add to phone contacts"
										className={cn(
											'w-3/4 text-[0.9375rem] leading-[0.9375rem]',
											coloredBg && textColor === 'black' && '!bg-white !text-black',
											coloredBg && textColor === 'white' && '!bg-black !text-white',
											!coloredBg && '!bg-black !text-white'
										)}
										swapps={card.swapps}
										name={card.displayName}
										title={card.heading}
									/>
								</Drawer.Content>
							</Drawer.Portal>
						</Drawer.Root>

						{#if !isCardPersonal && card.professionalCardType === 'jobSeeker'}
							<Badge
								class="flex gap-[7px] rounded-lg bg-black/30 px-4 py-3 text-xs leading-3 backdrop-blur-[20px] dark:text-white md:text-sm"
								>Looking for work <span class="h-2 w-2 rounded-full bg-white"></span></Badge
							>
						{/if}

						<Logo className="sm:hidden" />
					</div>

					<!-- COVER STYLE: Centered name with gradient -->
					{#if cardStyleType === 'cover' || (isCardPersonal && card.cardDesignType === 'centered')}
						<div
							class={cn(
								'absolute bottom-0 flex h-fit min-h-[150px] w-full flex-col items-center justify-center gap-2 px-6 pb-11 pt-[100vh] md:px-9 md:pb-12',
								coloredBg && textColor === 'black' && 'text-black',
								coloredBg && textColor === 'white' && 'text-white',
								!coloredBg && 'text-white'
							)}
							style:background={getGradientStyle()}
						>
							<h1
								class="font-inter text-center"
								style="font-size: {styleConfig.nameFontSize}px; font-weight: {styleConfig.nameFontWeight}; letter-spacing: {styleConfig.nameLetterSpacing}px; line-height: 1.1;"
							>
								{card.displayName}
							</h1>
							<p
								class="text-center"
								style="font-size: {styleConfig.descFontSize}px; font-weight: {styleConfig.descFontWeight}; opacity: {styleConfig.descOpacity};"
							>
								{getHeadingText()}
							</p>
						</div>

					<!-- CLASSIC STYLE: No overlay, info card will be below -->
					{:else if cardStyleType === 'classic'}
						<!-- No overlay on image -->

					<!-- ORIGINAL STYLE: Left-aligned with gradient -->
					{:else}
						<CardInfo
							title={card.displayName}
							{isCardPersonal}
							heading={getHeadingText()}
							companyLink={card.companyLink}
							companyName={card.company}
							companyLogo={card.companyLogo}
							skills={card.keySkills}
							bio={card.bio}
							{styleConfig}
						/>
					{/if}
				</section>
			{/if}

			<!-- Content Area -->
			<div
				class={cn(
					'flex w-full flex-col justify-between rounded-t-[1.25rem]',
					showCircularProfile ? '' : 'absolute'
				)}
				style:top={!showCircularProfile ? (windowWidth >= 768 ? `${imgHeight - 30}px` : `${imgHeight - 24}px`) : undefined}
				style:min-height={!showCircularProfile && windowWidth >= 640 && isCardScrollable ? `calc(100vh - ${topH}px)` : ''}
			>
				<!-- Classic Style: Owner Info Card -->
				{#if cardStyleType === 'classic' && !showCircularProfile}
					<div
						class="owner-info-card mx-4 -mt-6 mb-4 shadow-sm dark:bg-black dark:text-white"
						style:background="white"
					>
						<div class="flex items-center justify-between">
							<div>
								<h1
									class="font-inter text-black dark:text-white"
									style="font-size: {styleConfig.nameFontSize}px; font-weight: {styleConfig.nameFontWeight}; letter-spacing: {styleConfig.nameLetterSpacing}px;"
								>
									{card.displayName}
								</h1>
								<p
									class="mt-1 text-black dark:text-white"
									style="font-size: {styleConfig.descFontSize}px; font-weight: {styleConfig.descFontWeight}; letter-spacing: {styleConfig.descLetterSpacing}px;"
								>
									{getHeadingText()}
								</p>
							</div>

							{#if !isCardPersonal && card.companyLogo}
								{#if card.companyLink}
									<a href={`//${card.companyLink}`} target="_blank">
										<img
											src={card.companyLogo}
											alt={card.company}
											class="rounded-full object-cover"
											style="width: {styleConfig.companyLogoSize}px; height: {styleConfig.companyLogoSize}px;"
										/>
									</a>
								{:else}
									<img
										src={card.companyLogo}
										alt={card.company}
										class="rounded-full object-cover"
										style="width: {styleConfig.companyLogoSize}px; height: {styleConfig.companyLogoSize}px;"
									/>
								{/if}
							{/if}
						</div>

						{#if card.bio}
							<p
								class="mt-3 text-black/70 dark:text-white/70"
								style="font-size: {styleConfig.bioFontSize}px; font-weight: {styleConfig.bioFontWeight};"
							>
								{card.bio}
							</p>
						{/if}

						{#if !isCardPersonal && card.keySkills && card.keySkills.length > 0}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each card.keySkills as skill}
									<Badge class="rounded-[1.25rem] bg-gray-100 px-3 py-1.5 text-xs text-gray-800 dark:bg-white/10 dark:text-white">
										{skill}
									</Badge>
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				<div
					bind:this={cardScrollElement}
					class={cn(
						'flex h-full w-full flex-col justify-between px-5 py-6 sm:min-h-full md:px-9 md:pb-5 md:pt-[1.875rem]',
						isCardScrollable ? 'sm:rounded-b-[1.25rem]' : 'sm:rounded-b-0',
						!showCircularProfile && cardStyleType !== 'classic' && !styleConfig.hasGradientOverlay
							? 'rounded-t-[1.25rem] md:rounded-t-[1.875rem]'
							: showCircularProfile ? '' : 'rounded-t-none'
					)}
					style:background={getBackgroundColor()}
					style:gap="{styleConfig.tileSpacing}px"
				>
					<Swapps
						swapps={card.swapps}
						isColor={!!coloredBg}
						{textColor}
						{cardStyleType}
					/>
					<Footer isColor={!!coloredBg} {textColor} />
				</div>

				{#if isCardScrollable}
					<hr class="hidden h-16 w-full border-0 sm:flex" />
				{/if}
			</div>
		</main>
	</div>
</div>
