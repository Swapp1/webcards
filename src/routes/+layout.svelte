<script lang="ts">
	import '../app.css';
	let { children } = $props();

	$effect(() => {
		const applyDarkMode = () => {
			const isDarkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const theme = localStorage.getItem('theme');

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

<svelte:head>
	<!-- Preconnect to Google Fonts for faster loading -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<!-- Load Inter font with variable weight support -->
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;420;500;600;700;740;800;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
