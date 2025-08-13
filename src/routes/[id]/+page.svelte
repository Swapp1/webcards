<script lang="ts">
	import Logo from '$lib/components/sections/nav/logo.svelte';
	import type { PageData } from './$types';

	import Swapps from '$lib/components/sections/cards/swapps.svelte';
	import { cn } from '$lib/utils';

	import { Drawer } from 'vaul-svelte';

	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';

	import Loader from '$lib/assets/loading.lottie';
	import CardInfo from '$lib/components/sections/cards/card-info.svelte';
	import FloatingBtn from '$lib/components/sections/nav/floating-btn.svelte';
	import Footer from '$lib/components/sections/nav/footer.svelte';

	import DrawerIcon from '$lib/assets/add-contact.svg';
	import ActionBtn from '$lib/components/sections/cards/action-btn.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { argbToHex, hexToRgba } from '$lib/hooks/icons';
	import { tick } from 'svelte';

	let { data }: { data: PageData } = $props();

	const { card, params } = data;

	const isCardPersonal = $state(card.type === 'personal');
	const coloredBg = $state(
		card.cardColor ? (card.cardColor === '#FFFFFFFF' ? false : card.cardColor) : false
	);

	let imgLoading = $state(true);

	let cardScrollElement: HTMLDivElement | undefined = $state();
	let isCardScrollable = $state(false);

	let imgHeight = $state(0);
	let imgEl: HTMLImageElement | undefined = $state();

	let windowWidth = $state(0);
	let topH = $state(0);

	// 2. Effect to keep windowWidth in sync
	$effect(() => {
		const updateWidth = () => {
			windowWidth = window.innerWidth;
		};

		// set initial
		updateWidth();

		window.addEventListener('resize', updateWidth);
		return () => {
			window.removeEventListener('resize', updateWidth);
		};
	});

	$effect(() => {
		document.body.style.background = coloredBg
			? `${argbToHex(coloredBg)}`
			: 'hsl(var(--background))';

		document.body.style.setProperty(
			'--action-drawer',
			`${coloredBg ? `${argbToHex(coloredBg)}` : 'white'}`
		);
	});

	$effect(() => {
		let browserFontSize = 16; // Default font size
		if (typeof window !== 'undefined') {
			const computedStyle = window.getComputedStyle(document.documentElement);
			browserFontSize = Number(computedStyle.fontSize.replace('px', ''));
		}

		topH = (windowWidth >= 768 ? imgHeight - 30 : imgHeight - 24) + 4 * browserFontSize;
		const checkScroll = async () => {
			// Wait for the next tick to ensure DOM updates are applied
			await tick();
			if (cardScrollElement) {
				isCardScrollable =
					Math.round(topH + cardScrollElement.scrollHeight) > Math.round(window.innerHeight);
			}
		};

		// Initial check
		checkScroll();

		// Add resize listener
		window.addEventListener('resize', checkScroll);

		// Cleanup listener
		return () => {
			window.removeEventListener('resize', checkScroll);
		};
	});

	$effect(() => {
		const updateHeight = () => {
			if (imgEl) {
				imgHeight = imgEl.getBoundingClientRect().height;
			}
		};

		window.addEventListener('resize', updateHeight);
		return () => {
			window.removeEventListener('resize', updateHeight);
		};
	});
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
</svelte:head>

{#if imgLoading}
	<div class="fixed z-[60] h-screen w-full bg-background">
		<div class="h-screen w-full bg-zinc-800">
			<div class={cn('relative  flex w-full justify-center sm:h-screen sm:overflow-hidden')}>
				<div class="flex w-full flex-col items-center scroll-smooth sm:h-screen sm:overflow-auto">
					<hr class="hidden h-16 w-full border-0 sm:flex" />
					<main
						class="relative flex h-screen w-full flex-col rounded-t-[1.25rem] bg-black sm:max-w-[42.8125rem] md:rounded-t-[1.875rem]"
					>
						<div class="flex h-full items-center justify-center">
							<div class="flex h-full items-center justify-center space-x-2">
								<span class="sr-only">Loading...</span>
								<div
									class="bg-gray-400 h-4 w-4 animate-bounce rounded-full [animation-delay:-0.3s]"
								></div>
								<div
									class="bg-gray-400 h-4 w-4 animate-bounce rounded-full [animation-delay:-0.15s]"
								></div>
								<div
									class="bg-gray-400 h-4 w-4 animate-bounce rounded-full"
								></div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class={cn('relative flex w-full justify-center sm:h-screen sm:overflow-hidden')}>
	<img
		src={card.profilePicture}
		alt={card.displayName}
		class="pointer-events-none absolute hidden h-screen w-full scale-105 object-cover opacity-70 filter sm:flex"
	/>
	<div
		class={cn('pointer-events-none absolute hidden h-screen w-full backdrop-blur-[200px] sm:flex')}
	></div>

	<Logo className="hidden sm:flex  absolute  top-6 right-6" iconClass="lg:w-12 lg:h-12" />

	<div class="flex w-full flex-col items-center scroll-smooth sm:h-screen sm:overflow-auto">
		<hr class="hidden h-16 w-full border-0 sm:flex" />

		<main class="relative flex h-auto w-full flex-col sm:max-w-[42.8125rem]">
			<FloatingBtn color={coloredBg} pic={card.profilePicture} />

			<section class="relative">
				<img
					bind:this={imgEl}
					src={card.profilePicture}
					alt={card.displayName}
					class={cn(
						'w-full object-cover sm:rounded-t-[1.25rem]',
						isCardPersonal ? 'h-[60vh]' : 'h-[50vh]'
					)}
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
									'transition-all duration-300 ease-out animate-in slide-in-from-bottom'
								)}
							>
								<ActionBtn
									pic={card.profilePicture}
									text="Add to phone contacts"
									className={cn(
										' w-3/4 text-[0.9375rem] leading-[0.9375rem]',
										coloredBg ? '!bg-white !text-black' : '!bg-black  !text-white'
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
							class="flex gap-[7px] rounded-lg bg-black/30 px-4 py-3 text-xs leading-3 backdrop-blur-[20px] dark:text-white  md:text-sm"
							>Looking for work <span class="h-2 w-2 rounded-full bg-white"></span></Badge
						>
					{/if}

					<Logo className="sm:hidden" />
				</div>

				{#if isCardPersonal && card.cardDesignType === 'centered'}
					<div
						class="absolute bottom-0 flex h-fit min-h-[150px] w-full flex-col items-center justify-center gap-2 px-6 pb-11 pt-[100vh] text-white md:px-9 md:pb-12"
						style:background={`linear-gradient(180deg, ${hexToRgba(argbToHex(coloredBg), 0)} 75%, ${hexToRgba(argbToHex(coloredBg), 0.9)} 90%, ${hexToRgba(argbToHex(coloredBg), 1)} 95%);`}
					>
						<span
							class="font-sf-pro-display text-[2.5rem] font-black italic leading-[100%] tracking-[1px]"
							>{card.displayName}</span
						>
						<p class="text-sm font-medium">{card.heading}</p>
					</div>
				{:else}
					<CardInfo
						title={card.displayName}
						{isCardPersonal}
						heading={isCardPersonal
							? card.heading
							: card.professionalCardType === 'student'
								? `${card.schoolMajor} at ${card.schoolName}`
								: card.professionalCardType === 'staff'
									? `${card.jobTitle} at ${card.company}`
									: card.heading}
						companyLink={card.companyLink}
						companyName={card.company}
						companyLogo={card.companyLogo}
						skills={card.keySkills}
						bio={card.bio}
					/>
				{/if}
			</section>

			<div
				class={cn('absolute flex w-full flex-col justify-between gap-2  rounded-t-[1.25rem]')}
				style:top={windowWidth >= 768 ? `${imgHeight - 30}px` : `${imgHeight - 24}px`}
				style:height={windowWidth >= 640
					? isCardScrollable
						? `auto`
						: `calc(100vh - ${topH}px)`
					: isCardPersonal
						? `calc(40vh + 24px)`
						: `calc(50vh + 24px)`}
				style:min-height={windowWidth >= 640 && isCardScrollable ? `calc(100vh - ${topH}px)` : ''}
			>
				<div
					bind:this={cardScrollElement}
					class={cn(
						'flex h-full w-full flex-col justify-between gap-2 px-5 py-6 sm:min-h-full md:gap-[0.625rem] md:px-9 md:pb-5 md:pt-[1.875rem]',
						isCardScrollable ? 'sm:rounded-b-[1.25rem]' : 'sm:rounded-b-0',
						card.cardDesignType === 'centered'
							? 'rounded-t-none'
							: 'rounded-t-[1.25rem] md:rounded-t-[1.875rem]'
					)}
					style:background={coloredBg ? `${argbToHex(coloredBg)}` : 'hsl(var(--background))'}
				>
					<Swapps swapps={card.swapps} isColor={coloredBg} />
					<Footer isColor={coloredBg} />
				</div>

				{#if isCardScrollable}
					<hr class="hidden h-16 w-full border-0 sm:flex" />
				{/if}
			</div>
		</main>
	</div>
</div>
