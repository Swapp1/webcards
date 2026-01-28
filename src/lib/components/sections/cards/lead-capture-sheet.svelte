<script lang="ts">
	import { Drawer } from 'vaul-svelte';
	import { cn } from '$lib/utils';
	import { submitLead, type LeadData } from '$lib/firebase/cards';
	import { trackLeadCapture } from '$lib/firebase/analytics';
	import { getLeadCaptureTexts } from '$lib/utils/locale';
	import { browser } from '$app/environment';

	let {
		open = $bindable(false),
		ownerName,
		ownerPhoto,
		ownerId,
		cardId,
		cardType = '',
		onSubmitSuccess
	}: {
		open: boolean;
		ownerName: string;
		ownerPhoto: string;
		ownerId: string;
		cardId: string;
		cardType?: string;
		onSubmitSuccess?: () => void;
	} = $props();

	const t = getLeadCaptureTexts();

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let job = $state('');
	let isSubmitting = $state(false);
	let errorMsg = $state('');

	// Check if user already submitted for this card
	const getSubmittedKey = () => `swapp_lead_submitted_${cardId}`;

	const hasAlreadySubmitted = $derived.by(() => {
		if (!browser) return false;
		return localStorage.getItem(getSubmittedKey()) === 'true';
	});

	// Auto-close if already submitted
	$effect(() => {
		if (open && hasAlreadySubmitted) {
			open = false;
		}
	});

	const isFormValid = $derived(name.trim() !== '' && email.trim() !== '' && email.includes('@'));

	const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 font-inter text-base text-white placeholder:text-white/30 focus:border-white/20 focus:outline-none focus:ring-0';

	async function handleSubmit() {
		if (!isFormValid || isSubmitting) return;

		isSubmitting = true;
		errorMsg = '';

		try {
			const leadData: LeadData = {
				name: name.trim(),
				email: email.trim(),
				...(phone.trim() && { phone: phone.trim() }),
				...(job.trim() && { job: job.trim() })
			};

			await submitLead(ownerId, cardId, leadData);

			// Track lead capture in stats
			await trackLeadCapture(cardId, ownerId, cardType, ownerName);

			// Cache submission in localStorage
			if (browser) {
				localStorage.setItem(getSubmittedKey(), 'true');
			}

			// Notify parent that submission was successful
			onSubmitSuccess?.();

			open = false;
			// Reset form
			name = '';
			email = '';
			phone = '';
			job = '';
		} catch (e) {
			errorMsg = t.error;
			console.error('Lead submission error:', e);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Drawer.Root bind:open shouldScaleBackground>
	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 z-40 bg-black/40" />
		<Drawer.Content
			class={cn(
				'fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[1.5rem] bg-[#2a2a2a] px-6 pb-8 pt-6 focus-visible:outline-none',
				'animate-in slide-in-from-bottom duration-300'
			)}
		>
			<!-- Close button (top right) -->
			<button
				type="button"
				onclick={() => open = false}
				class="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#363434]"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<line x1="18" y1="6" x2="6" y2="18"/>
					<line x1="6" y1="6" x2="18" y2="18"/>
				</svg>
			</button>

			<!-- Header -->
			<div class="mb-6">
				<h2
					class="font-inter text-white"
					style="font-size: 28px; font-weight: 700; letter-spacing: -1px;"
				>
					{t.title}
				</h2>
				<div class="mt-2 flex items-center gap-2">
					<img
						src={ownerPhoto}
						alt={ownerName}
						class="h-6 w-6 rounded-full object-cover"
					/>
					<p
						class="font-inter text-white/40"
						style="font-size: 17px; font-weight: 500;"
					>
						{t.subtitle} {ownerName}
					</p>
				</div>
			</div>

			<!-- Form -->
			<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col gap-3" autocomplete="on">
				<input
					type="text"
					name="name"
					autocomplete="name"
					placeholder={t.namePlaceholder}
					bind:value={name}
					class={inputClass}
				/>
				<input
					type="email"
					name="email"
					autocomplete="email"
					placeholder={t.emailPlaceholder}
					bind:value={email}
					class={inputClass}
				/>
				<input
					type="tel"
					name="phone"
					autocomplete="tel"
					placeholder={t.phonePlaceholder}
					bind:value={phone}
					class={inputClass}
				/>
				<input
					type="text"
					name="job"
					autocomplete="organization-title"
					placeholder={t.jobPlaceholder}
					bind:value={job}
					class={inputClass}
				/>

				{#if errorMsg}
					<p class="text-sm text-red-400">{errorMsg}</p>
				{/if}

				<button
					type="submit"
					disabled={!isFormValid || isSubmitting}
					class={cn(
						'mt-3 w-full rounded-xl py-4 font-inter text-base font-semibold transition-all',
						isFormValid && !isSubmitting
							? 'bg-white text-black'
							: 'bg-white/10 text-white/40 cursor-not-allowed'
					)}
				>
					{isSubmitting ? t.submitting : t.submitButton}
				</button>
			</form>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
