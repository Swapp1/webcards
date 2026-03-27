<script lang="ts">
	import '../app.css';
	let { children } = $props();

	// Listen for OS dark mode changes (initial check is in app.html to prevent FOUC)
	$effect(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => {
			const theme = localStorage.getItem('theme');
			if (!theme) {
				document.documentElement.classList.toggle('dark', mq.matches);
			}
		};
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
</script>

<svelte:head>
	<!-- Preconnect to Google Fonts for faster loading -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<!-- Load Inter variable font (single file covers all weights) - non-blocking via {@html} -->
	{@html `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap" media="print" onload="this.media='all'" />`}
	<noscript>
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..800&display=swap" rel="stylesheet" />
	</noscript>
</svelte:head>

{@render children()}
