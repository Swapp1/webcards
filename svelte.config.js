import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Permet le support du routing côté client (SPA) sur Vercel
			fallback: 'index.html'
		}),
		alias: {
			"@/*": "src/lib/*", // Utilise @/ pour importer depuis src/lib
		}
	}
};

export default config;
