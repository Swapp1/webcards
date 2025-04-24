<script lang="ts">
	import '../app.css';
	let { children } = $props();

	$effect(() => {
		const applyDarkMode = () => {
			const isDarkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
			// You might also check localStorage for a user-specific override
			const theme = localStorage.getItem('theme'); // Example: 'light' or 'dark'

			if (theme === 'dark' || (!theme && isDarkModePreferred)) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		};

		applyDarkMode();
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyDarkMode);
	});
</script>

{@render children()}
