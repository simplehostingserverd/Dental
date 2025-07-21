import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://dentalcloud.com";

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/auth/signin`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/auth/signup`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
	];

	// Blog posts (in a real app, this would come from your CMS/database)
	const blogPosts = [
		{
			url: `${baseUrl}/blog/1`,
			lastModified: new Date("2025-01-15"),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/blog/2`,
			lastModified: new Date("2025-01-12"),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/blog/3`,
			lastModified: new Date("2025-01-10"),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/blog/4`,
			lastModified: new Date("2025-01-08"),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/blog/5`,
			lastModified: new Date("2025-01-05"),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/blog/6`,
			lastModified: new Date("2025-01-03"),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		},
	];

	return [...staticPages, ...blogPosts];
}
