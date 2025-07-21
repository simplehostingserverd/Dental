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
	experimental: {
		optimizePackageImports: ["@tanstack/react-query", "superjson"],
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
		];
	},
};

module.exports = withNextIntl(config);
