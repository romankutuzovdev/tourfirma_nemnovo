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
  images?: string[]
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
    return Array.isArray(data) ? data.map((s: { short_desc?: string; image_url?: string }) => ({
      slug: s.slug,
      title: s.title,
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
    return Array.isArray(data) ? data.map((e: { short_desc?: string }) => ({
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
