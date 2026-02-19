import type { Locale } from './i18n'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export type CompanyInfo = {
  company_name: string
  legal_address?: string
  office_address?: string
  unp?: string
  okpo?: string
  trade_register?: string
  services_register?: string
  contact_email: string
  tour_base_url?: string
}

export type ServiceItem = {
  slug: string
  title: string
  excerpt?: string
  image?: string
  price?: number
  currency?: string
}

export type PromoItem = {
  slug: string
  title: string
  excerpt?: string
  image?: string
  date_start?: string
  date_end?: string
}

export type PortfolioItem = {
  slug: string
  title: string
  excerpt?: string
  description?: string
  images?: string[]
  image?: string
  image_url?: string
  image_urls?: string[]
  event_date?: string
  is_pinned?: boolean
}

export type ExcursionItem = {
  slug: string
  title: string
  short_desc?: string
  image?: string
  order?: number
  category_slug?: string
  category_name?: string
}

export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/company-info/`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function fetchServices(locale: Locale): Promise<ServiceItem[]> {
  try {
    const res = await fetch(`${API_BASE}/services/?locale=${locale}`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.map((s: { slug?: string; title?: string; short_desc?: string; excerpt?: string; image_url?: string; image?: string; price?: number; currency?: string }) => ({
      slug: s.slug ?? '',
      title: s.title ?? '',
      excerpt: s.short_desc ?? s.excerpt,
      image: s.image_url ?? s.image,
      price: s.price,
      currency: s.currency ?? 'BYN',
    })) : []
  } catch {
    return []
  }
}

export async function fetchPromos(locale: Locale): Promise<PromoItem[]> {
  try {
    const res = await fetch(`${API_BASE}/promos/?locale=${locale}`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export type PromoDetail = PromoItem & { short_desc?: string; long_desc?: string; image_url?: string }

export async function fetchPromoBySlug(slug: string, locale: Locale): Promise<PromoDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/promos/${slug}/?locale=${locale}`)
    if (!res.ok) return null
    const p = await res.json()
    return { ...p, image: p.image ?? p.image_url }
  } catch {
    return null
  }
}

export function getPromoImageSrc(promo: { image?: string | null; image_url?: string | null }): string {
  return promo?.image ?? promo?.image_url ?? ''
}

export function getServiceImageSrc(item: { image?: string; image_url?: string }): string {
  return item?.image ?? item?.image_url ?? ''
}

export type ServiceDetail = ServiceItem & { long_desc?: string }

export async function fetchServiceDetail(slug: string, locale: Locale): Promise<ServiceDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/services/${slug}/?locale=${locale}`)
    if (!res.ok) return null
    const s = await res.json()
    return {
      slug: s.slug,
      title: s.title,
      excerpt: s.short_desc ?? s.excerpt,
      image: s.image_url ?? s.image,
      price: s.price,
      currency: s.currency ?? 'BYN',
      long_desc: s.long_desc,
    }
  } catch {
    return null
  }
}

export async function fetchExcursions(locale: Locale): Promise<ExcursionItem[]> {
  try {
    const res = await fetch(`${API_BASE}/excursions/?locale=${locale}`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.map((e: ExcursionItem & { excerpt?: string; image_url?: string }) => ({
      ...e,
      short_desc: e.short_desc ?? e.excerpt,
      image: e.image ?? e.image_url,
    })) : []
  } catch {
    return []
  }
}

export type ExcursionDetail = ExcursionItem & { long_desc?: string }

export async function fetchExcursionDetail(slug: string, locale: Locale): Promise<ExcursionDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/excursions/${slug}/?locale=${locale}`)
    if (!res.ok) return null
    const e = await res.json()
    return {
      ...e,
      short_desc: e.short_desc ?? e.excerpt,
      image: e.image ?? e.image_url,
    }
  } catch {
    return null
  }
}

export async function fetchPortfolio(locale: Locale): Promise<PortfolioItem[]> {
  try {
    const res = await fetch(`${API_BASE}/portfolio/?locale=${locale}`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export function getPortfolioImageSrc(item: { image?: string; image_url?: string; image_urls?: string[]; images?: string[] }): string {
  return item?.image ?? item?.image_url ?? item?.image_urls?.[0] ?? item?.images?.[0] ?? ''
}

export type PortfolioDetail = PortfolioItem & { images?: string[] }

export async function fetchPortfolioItem(slug: string, locale: Locale): Promise<PortfolioDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/portfolio/${slug}/?locale=${locale}`)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/api\/?$/, '')

export function getPortfolioDownloadUrl(slug: string): string {
  return `${API_ORIGIN}/api/portfolio/${slug}/download/`
}

// ——— Events ———
export type EventItem = {
  slug: string
  title: string
  short_desc?: string
  image?: string
  image_url?: string
}

export type EventDetail = EventItem & { long_desc?: string }

export async function fetchEvents(locale: Locale): Promise<EventItem[]> {
  try {
    const res = await fetch(`${API_BASE}/events/?locale=${locale}`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.map((e: EventItem & { image_url?: string }) => ({ ...e, image: e.image ?? e.image_url })) : []
  } catch {
    return []
  }
}

export async function fetchEventBySlug(slug: string, locale: Locale): Promise<EventDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/events/${slug}/?locale=${locale}`)
    if (!res.ok) return null
    const e = await res.json()
    return { ...e, image: e.image ?? e.image_url }
  } catch {
    return null
  }
}

export function getEventImageSrc(item: { image?: string; image_url?: string }): string {
  return item?.image ?? item?.image_url ?? ''
}

// ——— News ———
export type NewsItem = {
  slug: string
  title: string
  short_desc?: string
  created_at: string
  image?: string
  image_url?: string
}

export type NewsDetail = NewsItem & { long_desc?: string }

export async function fetchNews(locale: Locale): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API_BASE}/news/?locale=${locale}`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.map((n: NewsItem & { image_url?: string }) => ({ ...n, image: n.image ?? n.image_url })) : []
  } catch {
    return []
  }
}

export async function fetchNewsBySlug(slug: string, locale: Locale): Promise<NewsDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/news/${slug}/?locale=${locale}`)
    if (!res.ok) return null
    const n = await res.json()
    return { ...n, image: n.image ?? n.image_url }
  } catch {
    return null
  }
}

export function getNewsImageSrc(item: { image?: string; image_url?: string }): string {
  return item?.image ?? item?.image_url ?? ''
}

// ——— Reviews ———
export type ReviewItem = {
  id: number
  author: string
  text: string
  rating: number
  order?: number
}

export async function fetchReviews(): Promise<ReviewItem[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews/`)
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

// ——— Contact ———
export type ContactFormPayload = { name: string; email: string; message: string }

export async function sendContactForm(
  type: 'main' | 'complaint' | 'hot_offer',
  payload: ContactFormPayload
): Promise<{ ok: true } | { error: string }> {
  try {
    const res = await fetch(`${API_BASE}/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...payload }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) return { error: (data as { error?: string }).error ?? `Ошибка ${res.status}` }
    return { ok: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Ошибка отправки' }
  }
}

// ——— How to get ———
export type HowToGetBlockItem = { transport_type: string; title: string; content: string }
export type HowToGetCityItem = { slug: string; name: string; order: number; blocks: HowToGetBlockItem[] }
export type HowToGetResponse = {
  cities: HowToGetCityItem[]
  address?: string
  gps_lat?: number | null
  gps_lon?: number | null
}

export async function fetchHowToGet(locale: Locale): Promise<HowToGetResponse> {
  try {
    const res = await fetch(`${API_BASE}/how-to-get/?locale=${locale}`)
    if (!res.ok) return { cities: [] }
    return res.json()
  } catch {
    return { cities: [] }
  }
}
