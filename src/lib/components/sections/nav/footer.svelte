<script lang="ts">
  let { isColor }: { isColor: boolean } = $props();
</script>

<footer
  class="flex flex-col items-center justify-center pt-10 pb-20"
  style="color: {isColor ? 'white' : 'hsl(var(--text))'}"
>
  <!-- Logo Swapp large & rounded -->
<a href="https://download.swapp.fr" target="_blank" class="flex flex-col items-center">
	<img
		src="/swapp.svg"
		alt="Swapp logo"
		class="h-7 w-auto rounded-[0.4rem] mb-2"
	/>

	<!-- Texte d'appel plus grand -->
	<p class="text-[1rem] font-semibold leading-tight mb-4">
		Create your card
	</p>
</a>

  <!-- Liens séparés par un trait vertical, texte agrandi -->
<div class="flex items-center text-sm font-light leading-snug tracking-wide text-gray-300">
	<a
		href="https://www.swapp.fr/terms"
		target="_blank"
		class="px-1"
	>
		Terms
	</a>
	<div class="h-3 border-l border-current"></div>
	<a
		href="https://www.swapp.fr/privacy_policy"
		target="_blank"
		class="px-1"
	>
		Privacy policy
	</a>
</div>
</footer>