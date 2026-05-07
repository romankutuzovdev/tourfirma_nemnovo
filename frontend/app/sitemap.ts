import type { MetadataRoute } from 'next'

type Locale = 'ru'

function getSiteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  return env || 'https://nemnovotour.by'
}

function getBackendUrl() {
  return (process.env.BACKEND_URL || 'http://127.0.0.1:8100').trim().replace(/\/$/, '')
}

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const backend = getBackendUrl()
  const locale: Locale = 'ru'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/promos`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/news`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/floats`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/calendar`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/reviews`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    // legal
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/public-offer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/service-contract`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/payment`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/agencies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/certificate`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const [services, promos, news, portfolio, floats, calendar] = await Promise.all([
    safeJson<Array<{ slug: string }>>(`${backend}/api/services/?locale=${locale}`),
    safeJson<Array<{ slug: string }>>(`${backend}/api/promos/?locale=${locale}`),
    safeJson<Array<{ slug: string }>>(`${backend}/api/news/?locale=${locale}`),
    safeJson<Array<{ slug: string }>>(`${backend}/api/portfolio/?locale=${locale}`),
    safeJson<Array<{ slug: string }>>(`${backend}/api/float-trips?locale=${locale}`),
    safeJson<Array<{ id: number }>>(`${backend}/api/calendar-events/?year=${now.getFullYear()}&month=${now.getMonth() + 1}&locale=${locale}`),
  ])

  const dynamicRoutes: MetadataRoute.Sitemap = []
  for (const s of services || []) dynamicRoutes.push({ url: `${siteUrl}/services/${encodeURIComponent(s.slug)}`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 })
  for (const p of promos || []) dynamicRoutes.push({ url: `${siteUrl}/promos/${encodeURIComponent(p.slug)}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 })
  for (const n of news || []) dynamicRoutes.push({ url: `${siteUrl}/news/${encodeURIComponent(n.slug)}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 })
  for (const i of portfolio || []) dynamicRoutes.push({ url: `${siteUrl}/portfolio/${encodeURIComponent(i.slug)}`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 })
  for (const f of floats || []) dynamicRoutes.push({ url: `${siteUrl}/floats/${encodeURIComponent(f.slug)}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 })
  for (const ev of calendar || []) dynamicRoutes.push({ url: `${siteUrl}/calendar/${ev.id}`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 })

  return [...staticRoutes, ...dynamicRoutes]
}

