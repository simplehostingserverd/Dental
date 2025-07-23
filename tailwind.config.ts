import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{ts,tsx}",
		"./src/components/**/*.{ts,tsx}",
		"./src/app/**/*.{ts,tsx}",
	],
	darkMode: false, // Disable dark mode for better visibility
	theme: {
		extend: {},
	},
	plugins: [],
};

export default config;
