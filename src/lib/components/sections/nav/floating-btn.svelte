<script lang="ts">
  let visible = true;
</script>

{#if visible}
  <div
    class="fixed bottom-2 left-1/2 transform -translate-x-1/2
           w-[96%] max-w-md bg-white text-black
           flex items-center justify-between
           px-3 py-2 rounded-full shadow z-50"
  >
    <!-- Zone cliquable entière sauf la croix -->
    <a
      href="https://download.swapp.fr"
      target="_blank"
      class="flex items-center flex-1"
    >
      <!-- Logo -->
	<img
	  src="swapp.svg"
	  alt="Swapp logo"
	  class="h-[23px] w-[23px] rounded-[0.35rem] flex-shrink-0 mr-[0.35rem]"
      />

      <!-- Texte aligné en bas + padding-bottom pour le remonter -->
      <span class="flex items-baseline space-x-3 pt-0.5">
        <span class="text-[1.1rem] font-semibold leading-none">Swapp</span>
        <span class="text-[0.87rem] font-medium leading-none">Create your free card now</span>
      </span>
    </a>

    <!-- Croix de fermeture -->
	<button
	  class=""
	  aria-label="Close"
	  on:click={() => (visible = false)}
	>
	  <svg 
		width="19" 
		height="19" 
		viewBox="0 0 24 24" 
		fill="none" 
		stroke="currentColor" 
		stroke-width="2"
		stroke-linecap="round"
	  >
		<line x1="18" y1="6" x2="6" y2="18"></line>
		<line x1="6" y1="6" x2="18" y2="18"></line>
	  </svg>
	</button>
  </div>
{/if}
