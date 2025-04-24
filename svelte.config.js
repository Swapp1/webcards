import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html', // permet le mode SPA
			strict: false,          // évite l'erreur de routes dynamiques
		}),
		alias: {
			"@/*": "./path/to/lib/*",
		},
		paths: {
			base: '',
		}
	}
};

export default config;
