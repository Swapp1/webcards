<script lang="ts">
	import Logo from '$lib/components/sections/nav/logo.svelte';
	import type { PageData } from './$types';

	import Swapps from '$lib/components/sections/cards/swapps.svelte';
	import { cn } from '$lib/utils';

	import { getTextColor } from '$lib/utils/color';

	import CardInfo from '$lib/components/sections/cards/card-info.svelte';
	import FloatingBtn from '$lib/components/sections/nav/floating-btn.svelte';
	import Footer from '$lib/components/sections/nav/footer.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { argbToHex, hexToRgba } from '$lib/hooks/icons';
	import { tick, onMount } from 'svelte';
	import { parseCardStyleType, getStyleConfig, type CardStyleType } from '$lib/config/card-styles';
	import LeadCaptureSheet from '$lib/components/sections/cards/lead-capture-sheet.svelte';
	import StickyActionBar from '$lib/components/sections/cards/sticky-action-bar.svelte';
	import { trackCardView, trackContentClick, trackContactSave } from '$lib/firebase/analytics';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	const { card, params } = data;

	const isCardPersonal = $state(card.type === 'personal');

	// Lead capture state
	let showLeadCapture = $state(false);

	// Check if user already submitted lead form
	const getSubmittedKey = () => `swapp_lead_submitted_${card.personalizedLink}`;
	let hasAlreadySubmittedLead = $state(false);

	// Initialize on mount
	$effect(() => {
		if (browser) {
			hasAlreadySubmittedLead = localStorage.getItem(getSubmittedKey()) === 'true';
		}
	});

	// Callback when lead is submitted
	const handleLeadSubmitted = () => {
		hasAlreadySubmittedLead = true;
	};

	// Track card view and open lead capture on mount
	onMount(() => {
		// Track the card view
		trackCardView(
			card.personalizedLink,
			card.ownerId,
			card.type,
			card.displayName
		);

		// Open lead capture sheet if enabled
		if (card.leadCapture && card.ownerId) {
			setTimeout(() => {
				showLeadCapture = true;
			}, 500);
		}
	});

	// Function to track content clicks (passed to child components)
	const handleContentClick = (contentType: string) => {
		trackContentClick(
			card.personalizedLink,
			card.ownerId,
			contentType,
			card.type,
			card.displayName
		);
	};

	// Function to track contact saves
	const handleContactSave = () => {
		trackContactSave(
			card.personalizedLink,
			card.ownerId,
			card.type,
			card.displayName
		);
	};

	// Reference to StickyActionBar to open menu
	let stickyActionBar: StickyActionBar;

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

	// Get background color for the card content
	const getBackgroundColor = () => {
		if (coloredBg) return argbToHex(coloredBg);
		if (cardStyleType === 'minimal') return '#F5F5F5';
		return 'hsl(var(--background))';
	};

	// Get contrasted background for desktop (darker if light, lighter if dark)
	const getDesktopBgColor = () => {
		if (!coloredBg) {
			// Default: slightly darker gray for minimal
			return cardStyleType === 'minimal' ? '#E0E0E0' : '#D0D0D0';
		}

		const hex = argbToHex(coloredBg);
		// Parse hex to RGB
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		// If light color (textColor is black), make it darker
		// If dark color (textColor is white), make it lighter
		const factor = textColor === 'black' ? 0.85 : 1.2;

		const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
		const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
		const newB = Math.min(255, Math.max(0, Math.round(b * factor)));

		return `rgb(${newR}, ${newG}, ${newB})`;
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
			// Background color gradient for Cover style - smooth transition
			const bgHex = coloredBg ? argbToHex(coloredBg) : '#ffffff';

			return `linear-gradient(to bottom,
				transparent 0%,
				${hexToRgba(bgHex, 0.8)} 50%,
				${bgHex} 80%)`;
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

	// Calculate cover height based on style (desktop)
	const getCoverHeight = () => {
		if (showCircularProfile) {
			return cardStyleType === 'minimal' ? '0' : `${styleConfig.coverHeightVh}vh`;
		}
		return `${styleConfig.coverHeightVh}vh`;
	};

	// Calculate cover height for mobile (slightly smaller for original)
	const getCoverHeightMobile = () => {
		if (showCircularProfile) {
			return cardStyleType === 'minimal' ? '0' : `${styleConfig.coverHeightVh}vh`;
		}
		// Reduce height on mobile for original style
		if (cardStyleType === 'original') {
			return `${styleConfig.coverHeightVh - 10}vh`;
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
	<link rel="preload" as="image" href={card.profilePicture} fetchpriority="high" />

	<!-- DNS prefetch for external resources -->
	<link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
	<link rel="preconnect" href="https://firebasestorage.googleapis.com" crossorigin="anonymous" />
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
	<!-- Desktop background -->
	{#if showCircularProfile}
		<!-- Solid color background for pro/minimal styles (contrasted) -->
		<div
			class="pointer-events-none absolute hidden h-screen w-full sm:flex"
			style:background={getDesktopBgColor()}
		></div>
	{:else}
		<!-- Blurred image background for original/cover/classic styles -->
		<img
			src={card.profilePicture}
			alt={card.displayName}
			class="pointer-events-none absolute hidden h-screen w-full scale-105 object-cover opacity-70 filter sm:flex"
		/>
		<div
			class={cn('pointer-events-none absolute hidden h-screen w-full backdrop-blur-[200px] sm:flex')}
		></div>
	{/if}

	<Logo className="absolute right-6 top-6 hidden sm:flex" iconClass="w-8 h-8" />

	<div class="flex w-full flex-col items-center scroll-smooth sm:h-screen sm:overflow-auto sm:pt-10">

		<main class={cn(
			"relative flex h-auto w-full flex-col sm:max-w-[48rem] sm:rounded-xl sm:mb-10",
			"sm:shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)]"
		)}>
			<!-- Desktop only: Create your card button -->
			<FloatingBtn color={coloredBg ?? undefined} pic={card.profilePicture} {textColor} />

			<!-- PRO & MINIMAL STYLES: Circular Profile Photo Layout -->
			{#if showCircularProfile}
				<section
					class="relative flex flex-col items-center pt-12 pb-6 sm:rounded-t-xl"
					style:background={coloredBg ? argbToHex(coloredBg) : (cardStyleType === 'minimal' ? '#F5F5F5' : 'hsl(var(--background))')}
				>
					<!-- Mobile header -->
					<div class="absolute top-5 flex w-full items-center justify-between px-4 sm:justify-center">
						<!-- Logo (left) -->
						<Logo className="sm:hidden" />
						<!-- Menu Button (right) -->
						<button
							type="button"
							onclick={() => stickyActionBar?.openMenu()}
							class="flex h-11 w-11 items-center justify-center rounded-full bg-black/20 shadow-lg backdrop-blur-[15px] sm:hidden"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="1"/>
								<circle cx="12" cy="5" r="1"/>
								<circle cx="12" cy="19" r="1"/>
							</svg>
						</button>
					</div>

					<!-- Circular Profile Photo -->
					<div class="relative mt-8">
						<!-- Desktop photo -->
						<img
							bind:this={imgEl}
							src={card.profilePicture}
							alt={card.displayName}
							class="profile-photo-circle shadow-lg hidden sm:block"
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
						<!-- Mobile photo (smaller for minimal) -->
						<img
							src={card.profilePicture}
							alt={card.displayName}
							class="profile-photo-circle shadow-lg sm:hidden"
							style="width: {cardStyleType === 'minimal' ? Math.round(styleConfig.circularProfilePhotoSize * 0.82) : styleConfig.circularProfilePhotoSize}px; height: {cardStyleType === 'minimal' ? Math.round(styleConfig.circularProfilePhotoSize * 0.82) : styleConfig.circularProfilePhotoSize}px;"
							fetchpriority="high"
							loading="eager"
							onload={async () => {
								imgLoading = false;
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

					<!-- Owner Info Card (Pro style) -->
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
					{:else if cardStyleType === 'minimal'}
						<!-- Minimal style: text directly without card background -->
						<div
							class="mt-6 mb-0 w-full px-6 text-center"
							style:color={coloredBg ? (textColor === 'black' ? 'black' : 'white') : 'black'}
						>
							<!-- Desktop name -->
							<h1
								class="font-inter hidden sm:block"
								style="font-size: {styleConfig.nameFontSize}px; font-weight: {styleConfig.nameFontWeight}; letter-spacing: {styleConfig.nameLetterSpacing}px;"
							>
								{card.displayName}
							</h1>
							<!-- Mobile name (-1px) -->
							<h1
								class="font-inter sm:hidden"
								style="font-size: {styleConfig.nameFontSize - 1}px; font-weight: {styleConfig.nameFontWeight}; letter-spacing: {styleConfig.nameLetterSpacing}px;"
							>
								{card.displayName}
							</h1>
							<!-- Desktop heading -->
							<p
								class="mt-2 opacity-70 hidden sm:block"
								style="font-size: {styleConfig.descFontSize}px; font-weight: {styleConfig.descFontWeight}; letter-spacing: {styleConfig.descLetterSpacing}px;"
							>
								{getHeadingText()}
							</p>
							<!-- Mobile heading (-1px) -->
							<p
								class="mt-2 opacity-70 sm:hidden"
								style="font-size: {styleConfig.descFontSize - 1}px; font-weight: {styleConfig.descFontWeight}; letter-spacing: {styleConfig.descLetterSpacing}px;"
							>
								{getHeadingText()}
							</p>

							{#if card.bio}
								<!-- Desktop bio (70%) -->
								<p
									class="mx-auto mt-4 max-w-[70%] opacity-60 hidden sm:block"
									style="font-size: {styleConfig.bioFontSize}px; font-weight: {styleConfig.bioFontWeight};"
								>
									{card.bio}
								</p>
								<!-- Mobile bio (85%, -1px) -->
								<p
									class="mx-auto mt-4 max-w-[85%] opacity-60 sm:hidden"
									style="font-size: {styleConfig.bioFontSize - 1}px; font-weight: {styleConfig.bioFontWeight};"
								>
									{card.bio}
								</p>
							{/if}
						</div>
					{/if}
				</section>

			<!-- ORIGINAL, COVER, CLASSIC STYLES: Full Cover Image Layout -->
			{:else}
				<section class="relative">
					<!-- Desktop image -->
					<img
						bind:this={imgEl}
						src={card.profilePicture}
						alt={card.displayName}
						class={cn(
							'w-full object-cover sm:rounded-t-[1.25rem]',
							imgLoading ? 'hidden' : 'hidden sm:block'
						)}
						style:height={getCoverHeight()}
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
					<!-- Mobile image (smaller height for original) -->
					<img
						src={card.profilePicture}
						alt={card.displayName}
						class={cn(
							'w-full object-cover',
							imgLoading ? 'hidden' : 'sm:hidden block'
						)}
						style:height={getCoverHeightMobile()}
						fetchpriority="high"
						loading="eager"
						onload={async () => {
							imgLoading = false;
						}}
					/>

					<div class="absolute top-5 flex w-full items-center justify-between px-4 sm:justify-center">
						<!-- Logo (left) on mobile -->
						<div class="flex items-center gap-3 sm:hidden">
							<Logo />
							{#if !isCardPersonal && card.professionalCardType === 'jobSeeker'}
								<Badge
									class="flex gap-[7px] rounded-lg bg-black/30 px-4 py-3 text-xs leading-3 backdrop-blur-[20px] dark:text-white md:text-sm"
									>Looking for work <span class="h-2 w-2 rounded-full bg-white"></span></Badge
								>
							{/if}
						</div>
						<!-- Desktop: jobSeeker badge only -->
						{#if !isCardPersonal && card.professionalCardType === 'jobSeeker'}
							<Badge
								class="hidden gap-[7px] rounded-lg bg-black/30 px-4 py-3 text-xs leading-3 backdrop-blur-[20px] dark:text-white sm:flex md:text-sm"
								>Looking for work <span class="h-2 w-2 rounded-full bg-white"></span></Badge
							>
						{/if}

						<!-- Menu Button (right) on mobile -->
						<button
							type="button"
							onclick={() => stickyActionBar?.openMenu()}
							class="flex h-11 w-11 items-center justify-center rounded-full bg-black/20 shadow-lg backdrop-blur-[15px] sm:hidden"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="1"/>
								<circle cx="12" cy="5" r="1"/>
								<circle cx="12" cy="19" r="1"/>
							</svg>
						</button>
					</div>

					<!-- COVER STYLE: Centered name with gradient -->
					{#if cardStyleType === 'cover' || (isCardPersonal && card.cardDesignType === 'centered')}
						<div
							class={cn(
								'absolute bottom-0 flex h-[40%] w-full flex-col items-center justify-end px-6 pb-6 md:px-9 md:pb-8',
								coloredBg && textColor === 'black' && 'text-black',
								coloredBg && textColor === 'white' && 'text-white',
								!coloredBg && 'text-black dark:text-white'
							)}
							style:background={getGradientStyle()}
						>
							<h1
								class="font-inter text-center"
								style="font-size: {styleConfig.nameFontSize}px; font-weight: {styleConfig.nameFontWeight}; letter-spacing: {styleConfig.nameLetterSpacing}px; line-height: 1.1; text-shadow: 0 1px 3px rgba(0,0,0,0.1);"
							>
								{card.displayName}
							</h1>
							<p
								class="mt-2 text-center"
								style="font-size: {styleConfig.descFontSize}px; font-weight: {styleConfig.descFontWeight}; opacity: {styleConfig.descOpacity};"
							>
								{getHeadingText()}
							</p>
							{#if card.bio}
								<p
									class="mt-4 max-w-md text-center opacity-70"
									style="font-size: {styleConfig.bioFontSize}px; font-weight: {styleConfig.bioFontWeight}; line-height: 1.5;"
								>
									{card.bio}
								</p>
							{/if}
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
					'relative flex w-full flex-col justify-between',
					cardStyleType === 'original' && '-mt-10 md:-mt-12'
				)}
			>
				<!-- Classic Style: Owner Info Card -->
				{#if cardStyleType === 'classic' && !showCircularProfile}
					<div
						class="w-full px-5 py-6 sm:px-16 sm:py-10 bg-white dark:bg-[#1a1a1a]"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<h1
									class="font-inter text-black dark:text-white"
									style="font-size: {styleConfig.nameFontSize}px; font-weight: {styleConfig.nameFontWeight}; letter-spacing: {styleConfig.nameLetterSpacing}px; line-height: 1.2;"
								>
									{card.displayName}
								</h1>
								<p
									class="mt-2 text-black/70 dark:text-white/70"
									style="font-size: {styleConfig.descFontSize}px; font-weight: {styleConfig.descFontWeight}; letter-spacing: {styleConfig.descLetterSpacing}px;"
								>
									{getHeadingText()}
								</p>
							</div>

							{#if !isCardPersonal && card.companyLogo}
								{#if card.companyLink}
									<a href={`//${card.companyLink}`} target="_blank" class="flex-shrink-0 self-start">
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
										class="flex-shrink-0 self-start rounded-full object-cover"
										style="width: {styleConfig.companyLogoSize}px; height: {styleConfig.companyLogoSize}px;"
									/>
								{/if}
							{/if}
						</div>

						{#if card.bio}
							<p
								class="mt-5 max-w-[70%] text-black/60 dark:text-white/60"
								style="font-size: {styleConfig.bioFontSize}px; font-weight: {styleConfig.bioFontWeight}; line-height: 1.5;"
							>
								{card.bio}
							</p>
						{/if}

						{#if !isCardPersonal && card.keySkills && card.keySkills.length > 0}
							<div class="mt-5 flex flex-wrap gap-2">
								{#each card.keySkills as skill}
									<Badge class="rounded-[1.25rem] bg-gray-100 px-3 py-1.5 text-xs text-gray-800 dark:bg-white/10 dark:text-white">
										{skill}
									</Badge>
								{/each}
							</div>
						{/if}

						<!-- Save Contact Button for Classic Style -->
						<button
							type="button"
							onclick={() => stickyActionBar?.downloadVCF()}
							class="mt-6 flex items-center justify-center gap-2 self-start rounded-xl bg-black px-6 py-3 font-inter text-[15px] font-semibold text-white transition-all active:scale-[0.97] dark:bg-white dark:text-black sm:hidden"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
								<circle cx="9" cy="7" r="4"/>
								<line x1="19" x2="19" y1="8" y2="14"/>
								<line x1="22" x2="16" y1="11" y2="11"/>
							</svg>
							Save Contact
						</button>
					</div>
				{/if}

				<div
					bind:this={cardScrollElement}
					class={cn(
						'flex h-full w-full flex-col justify-between px-5 py-6 sm:px-16 sm:py-10',
						cardStyleType === 'original' && 'rounded-t-[1.25rem] md:rounded-t-[1.875rem]',
						(cardStyleType === 'original' || cardStyleType === 'cover') && 'sm:rounded-b-xl'
					)}
					style:background={getBackgroundColor()}
					style:gap="{styleConfig.tileSpacing}px"
				>
					<Swapps
						swapps={card.swapps}
						isColor={!!coloredBg}
						{textColor}
						{cardStyleType}
						onContentClick={handleContentClick}
					/>
					<Footer isColor={!!coloredBg} {textColor} />
				</div>

			</div>
		</main>

		<!-- Spacer for scrollable content (outside main to avoid shadow issues) -->
		{#if isCardScrollable}
			<hr class="hidden h-16 w-full border-0 sm:flex" />
		{/if}
	</div>
</div>

<!-- Sticky Action Bar (Mobile only) -->
<StickyActionBar
	bind:this={stickyActionBar}
	showLeadCapture={!!card.leadCapture && !!card.ownerId}
	hasAlreadySubmitted={hasAlreadySubmittedLead}
	name={card.displayName}
	title={card.heading}
	pic={card.profilePicture}
	swapps={card.swapps}
	onConnect={() => showLeadCapture = true}
	onSaveContact={handleContactSave}
	{cardStyleType}
/>

<!-- Lead Capture Sheet -->
{#if card.leadCapture && card.ownerId}
	<LeadCaptureSheet
		bind:open={showLeadCapture}
		ownerName={card.displayName}
		ownerPhoto={card.profilePicture}
		ownerId={card.ownerId}
		cardId={card.personalizedLink}
		cardType={cardStyleType}
		onSubmitSuccess={handleLeadSubmitted}
	/>
{/if}
