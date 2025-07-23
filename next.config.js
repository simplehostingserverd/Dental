/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// Skip env validation for now to avoid TypeScript import issues
// require("./src/env.ts");

const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import("next").NextConfig} */
const config = {
	output: "standalone",
	compress: true,
	poweredByHeader: false,
	reactStrictMode: true,
	experimental: {
		optimizePackageImports: ["@tanstack/react-query", "superjson", "lucide-react"],
		optimizeCss: true,
	},
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === "production",
	},
	images: {
		formats: ['image/webp', 'image/avif'],
		minimumCacheTTL: 60,
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	// Force dynamic rendering for dashboard routes that use authentication
	async headers() {
		return [
			{
				source: '/dashboard/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'no-cache, no-store, must-revalidate',
					},
				],
			},
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
				],
			},
		];
	},
};

module.exports = withNextIntl(config);
