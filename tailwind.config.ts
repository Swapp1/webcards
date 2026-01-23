import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			colors: {
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				primary: {
					DEFAULT: "hsl(var(--primary) / <alpha-value>)",
					foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
					foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
					foreground: "hsl(var(--destructive-foreground) / <alpha-value>)"
				},
				muted: {
					DEFAULT: "hsl(var(--muted) / <alpha-value>)",
					foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
				},
				accent: {
					DEFAULT: "hsl(var(--accent) / <alpha-value>)",
					foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
				},
				popover: {
					DEFAULT: "hsl(var(--popover) / <alpha-value>)",
					foreground: "hsl(var(--popover-foreground) / <alpha-value>)"
				},
				card: {
					DEFAULT: "hsl(var(--card) / <alpha-value>)",
					foreground: "hsl(var(--card-foreground) / <alpha-value>)"
				},
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},

				"primary-gray": 'hsl(var(--primary-gray))',
				"primary-white": 'hsl(var(--primary-white))',

				// Card style specific colors
				"card-bg-default": "#F5F5F5",
				"card-bg-dark": "#121212",
				"tile-bg-light": "#FFFFFF",
				"tile-bg-dark": "#1E1E1E",
				"tile-icon-bg-light": "#F0F0F0",
				"tile-icon-bg-dark": "#2A2A2A",
			},
			borderRadius: {
				xl: "calc(var(--radius) + 4px)",
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
				// Card tile border radius per style
				"tile-original": "16px",
				"tile-cover": "16px",
				"tile-classic": "10px",
				"tile-pro": "10px",
				"tile-minimal": "18px",
			},
			fontFamily: {
				sans: ['Inter', ...fontFamily.sans],
				inter: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
			},
			fontSize: {
				// Card name sizes per style
				"name-original": ["28px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
				"name-cover": ["32px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" }],
				"name-classic": ["24px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "740" }],
				"name-pro": ["24px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "740" }],
				"name-minimal": ["24px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "740" }],
				// Card description sizes
				"desc-original": ["14px", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "500" }],
				"desc-cover": ["13px", { lineHeight: "1.3", fontWeight: "400" }],
				"desc-classic": ["14px", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "500" }],
				"desc-pro": ["14px", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "500" }],
				"desc-minimal": ["14px", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "500" }],
			},
			lineHeight: {
				"100": "1.875rem"
			},
			spacing: {
				// Tile spacing per style
				"tile-gap-original": "6px",
				"tile-gap-cover": "6px",
				"tile-gap-classic": "6px",
				"tile-gap-pro": "8px",
				"tile-gap-minimal": "6px",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--bits-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--bits-accordion-content-height)" },
					to: { height: "0" },
				},
				"caret-blink": {
					"0%,70%,100%": { opacity: "1" },
					"20%,50%": { opacity: "0" },
				},
				"slide-up": {
					from: { opacity: "0", transform: "translateY(20px)" },
					to: { opacity: "1", transform: "translateY(0)" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"scale-in": {
					from: { opacity: "0", transform: "scale(0.95)" },
					to: { opacity: "1", transform: "scale(1)" },
				},
				"scrollVertical": {
					'0%': { transform: 'translateY(-150px)' },
					'100%': { transform: 'translateY(-270px)' },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"caret-blink": "caret-blink 1.25s ease-out infinite",
				"slide-up": "slide-up 0.4s ease-out forwards",
				"fade-in": "fade-in 0.3s ease-out forwards",
				"scale-in": "scale-in 0.3s ease-out forwards",
				'scrollVertical': 'scrollVertical 16s linear infinite alternate',
			},
			transitionDelay: {
				'25': '25ms',
				'35': '35ms',
				'50': '50ms',
				'70': '70ms',
				'105': '105ms',
				'140': '140ms',
				'175': '175ms',
				'210': '210ms',
				'245': '245ms',
				'280': '280ms',
				'315': '315ms',
				'350': '350ms',
			}
		},
	},
	plugins: [tailwindcssAnimate],
};

export default config;
