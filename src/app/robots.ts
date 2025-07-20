import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/api/',
        '/auth/',
        '/_next/',
      ],
    },
    sitemap: 'https://dentalcloud.com/sitemap.xml',
  }
}
