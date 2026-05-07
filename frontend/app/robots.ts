import type { MetadataRoute } from 'next'

function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  return env || 'https://nemnovotour.by'
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/cabinet/', '/login/', '/register/', '/forgot-password/', '/reset-password/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

