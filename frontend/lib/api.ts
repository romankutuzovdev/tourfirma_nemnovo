/**
 * API бэкенда: контент (услуги, новости). UI-переводы — в frontend/locales (next-intl).
 */

import type { Locale } from './i18n'

const LOCALES: Locale[] = ['ru']

export function getApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL
  if (raw === undefined || raw === null) return ''
  if (raw === '' || (typeof raw === 'string' && raw.trim() === '')) return ''
  const url = String(raw).trim().replace(/\/$/, '')
  if (!url) return ''
  // Если задан NEXT_PUBLIC_API_URL — используем его (для статического экспорта и продакшена)
  // Иначе в браузере '' → same origin → Next.js rewrite (при запущенном сервере)
  return url
}

/** Элемент из /api/services/?locale= */
export type ServiceItem = {
  slug: string
  image: string | null
  image_url: string
  order: number
  title: string
  short_desc: string
}

/** Ответ /api/services/<slug>/?locale= */
export type ServiceDetail = ServiceItem & { long_desc: string }

/** Нормализует URL картинки: полный URL или относительный /media/... (если API на том же origin) */
function toAbsoluteImageUrl(value: string): string {
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  const path = value.startsWith('/') ? value : `/${value}`
  const mediaPath = path.startsWith('/media') ? path : `/media/${path.replace(/^\//, '')}`
  const base = getApiUrl()
  if (base === '') return mediaPath
  return `${base}${mediaPath}`
}

/** Преобразует относительный /media/ URL в абсолютный для запросов к бэкенду */
export function toAbsoluteMediaUrl(value: string): string {
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  const path = value.startsWith('/') ? value : `/${value}`
  const base = getApiUrl()
  if (base === '') return path
  return `${base}${path}`
}

/** URL картинки услуги: приоритет у загруженного image, иначе image_url */
export function getServiceImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image) return toAbsoluteImageUrl(item.image)
  return item.image_url || ''
}

/** Элемент из /api/news/?locale= */
export type NewsItem = {
  slug: string
  image: string | null
  image_url: string
  order: number
  title: string
  short_desc: string
  created_at: string
}

/** Ответ /api/news/<slug>/?locale= */
export type NewsDetail = NewsItem & { long_desc: string }

/** URL картинки новости: приоритет у загруженного image, иначе image_url */
export function getNewsImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image) return toAbsoluteImageUrl(item.image)
  return item.image_url || ''
}

/** Элемент из /api/promos/?locale= */
export type PromoItem = {
  slug: string
  image: string | null
  image_url: string
  order: number
  title: string
  short_desc: string
}

/** Ответ /api/promos/<slug>/?locale= */
export type PromoDetail = PromoItem & { long_desc: string }

/** URL картинки акции: приоритет у загруженного image, иначе image_url */
export function getPromoImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image) return toAbsoluteImageUrl(item.image)
  return item.image_url || ''
}

/** Элемент из /api/hot-offers/?locale= (горячее предложение для попапа) */
export type HotOfferItem = {
  slug: string
  image: string | null
  order: number
  delay_seconds: number
  valid_until: string | null
  title: string
  short_desc: string
  button_text: string
}

/** URL картинки горячего предложения. Всегда отдаём относительный /media/... чтобы запрос шёл через rewrite Next.js на бэкенд (картинка грузится с того же origin). */
export function getHotOfferImageSrc(item: { image: string | null }): string {
  const raw = item.image || ''
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const path = new URL(raw).pathname
      return path.startsWith('/') ? path : `/${path}`
    } catch {
      return raw
    }
  }
  const path = raw.startsWith('/') ? raw : `/${raw}`
  return path.startsWith('/media') ? path : `/media/${path.replace(/^\//, '')}`
}

/** Элемент из /api/portfolio/?locale= */
export type PortfolioItem = {
  slug: string
  image: string | null
  image_url: string
  image_urls: string[]
  event_date: string | null
  order: number
  is_pinned: boolean
  title: string
  description: string
}

/** Деталь мероприятия из /api/portfolio/<slug>/?locale= — с массивом всех фото */
export type PortfolioItemDetail = Omit<PortfolioItem, 'image_urls'> & { images: string[] }

/** URL главной картинки портфолио: приоритет у загруженного image, иначе image_url */
export function getPortfolioImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image) return toAbsoluteImageUrl(item.image)
  return item.image_url || ''
}

const API_TIMEOUT = 15000 // 15 сек

async function apiFetch(url: string): Promise<Response | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT)
  try {
    const res = await fetch(url, { cache: 'no-store' as RequestCache, signal: controller.signal })
    return res
  } catch {
    return null // таймаут, сеть, и т.д.
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchServices(locale: Locale): Promise<ServiceItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/services/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchServiceBySlug(slug: string, locale: Locale): Promise<ServiceDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/services/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res) return null
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json().catch(() => null)
}

export async function fetchNews(locale: Locale): Promise<NewsItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/news/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchNewsBySlug(slug: string, locale: Locale): Promise<NewsDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/news/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res) return null
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json().catch(() => null)
}

export async function fetchPromos(locale: Locale): Promise<PromoItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/promos/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchPromoBySlug(slug: string, locale: Locale): Promise<PromoDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/promos/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res) return null
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json().catch(() => null)
}

export async function fetchHotOffers(locale: Locale): Promise<HotOfferItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/hot-offers/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchPortfolio(locale: Locale): Promise<PortfolioItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/portfolio/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchPortfolioItem(slug: string, locale: Locale): Promise<PortfolioItemDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/portfolio/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res) return null
  if (res.status === 404) return null
  if (!res.ok) return null
  return res.json().catch(() => null)
}

/** Ссылка для скачивания всех фото мероприятия (ZIP) */
export function getPortfolioDownloadUrl(slug: string): string {
  return `${getApiUrl()}/api/portfolio/${encodeURIComponent(slug)}/download/`
}

/** Элемент из /api/partners/ */
export type PartnerItem = {
  id: number
  name: string
  logo_display: string | null
  link: string
  order: number
}

export async function fetchPartners(): Promise<PartnerItem[]> {
  const res = await apiFetch(`${getApiUrl()}/api/partners/`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

/** Отзыв из /api/reviews/ (для главной, с оценкой 1–5) */
export type ReviewItem = {
  id: number
  author: string
  text: string
  rating: number
  order: number
}

export async function fetchReviews(): Promise<ReviewItem[]> {
  const res = await apiFetch(`${getApiUrl()}/api/reviews/`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

/** Реквизиты компании для футера (GET /api/company-info/) */
export type CompanyInfo = {
  company_name: string
  legal_address: string
  office_address: string
  unp: string
  okpo: string
  state_registration?: string
  trade_register: string
  services_register: string
  contact_email: string
}

export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
  const res = await apiFetch(`${getApiUrl()}/api/company-info/`)
  if (!res?.ok) return null
  return res.json().catch(() => null)
}

/** Событие календаря из /api/calendar-events/?year=&month=&locale= */
export type CalendarEventItem = {
  id: number
  date: string
  title: string
  image: string | null
  price: string
  price_display: string
  max_slots: number
  available_slots: number
  is_active: boolean
}

/** Детальная информация (страница «подробнее») — включает long_desc */
export type CalendarEventDetailItem = CalendarEventItem & { long_desc: string }

export async function fetchCalendarEvents(
  locale: Locale,
  year: number,
  month: number
): Promise<CalendarEventItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(
    `${getApiUrl()}/api/calendar-events/?year=${year}&month=${month}&locale=${loc}`
  )
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchCalendarEventDetail(
  id: number,
  locale: Locale
): Promise<CalendarEventDetailItem | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/calendar-events/${id}/?locale=${loc}`)
  if (!res || res.status === 404 || !res.ok) return null
  return res.json().catch(() => null)
}

export async function bookCalendarEvent(
  id: number,
  payload: { name: string; email: string; phone?: string; participants_count?: number }
): Promise<{ ok: true; id?: number } | { error: string }> {
  const res = await fetch(`${getApiUrl()}/api/calendar-events/${id}/book/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: (data as { error?: string }).error || `Ошибка ${res.status}` }
  if ((data as { ok?: boolean }).ok) return { ok: true, id: (data as { id?: number }).id }
  return { error: (data as { error?: string }).error || 'Неизвестная ошибка' }
}

/** URL картинки события календаря */
export function getCalendarEventImageSrc(item: { image: string | null }): string {
  const raw = item.image || ''
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  const path = raw.startsWith('/') ? raw : `/${raw}`
  const mediaPath = path.startsWith('/media') ? path : `/media/${path.replace(/^\//, '')}`
  const base = getApiUrl()
  return base ? `${base}${mediaPath}` : mediaPath
}

/** Отправка формы контакта (заявка, претензия или обратная связь из горячего предложения). */
export type ContactFormType = 'main' | 'complaint' | 'hot_offer'

/** Элемент сплава из /api/float-trips/?locale= */
export type FloatTripItem = {
  slug: string
  title: string
  image: string | null
  image_url: string
  distance_km: string
  price_per_person: string
  order: number
}

/** Детали сплава из /api/float-trips/<slug>/?locale= — с описанием, видео и картой */
export type FloatTripDetail = FloatTripItem & {
  description: string
  video_url: string  // YouTube, Vimeo или прямой URL видео
  map_embed_url: string  // URL для iframe (Яндекс.Карты)
}

/** URL картинки сплава: приоритет у загруженного image, иначе image_url */
export function getFloatImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image) return toAbsoluteImageUrl(item.image)
  return item.image_url || ''
}

export async function fetchFloatTrips(locale: Locale): Promise<FloatTripItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/float-trips/?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchFloatTripBySlug(
  slug: string,
  locale: Locale
): Promise<FloatTripDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/float-trips/${encodeURIComponent(slug)}/?locale=${loc}`)
  if (!res || res.status === 404 || !res.ok) return null
  return res.json().catch(() => null)
}

/** Юридическая страница из /api/legal/<page_key>/?locale= */
export type LegalPageContent = {
  page_key: string
  title: string
  content: string
}

export async function fetchLegalPage(pageKey: string, locale: Locale): Promise<LegalPageContent | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/legal/${encodeURIComponent(pageKey)}/?locale=${loc}`)
  if (!res?.ok) return null
  return res.json().catch(() => null)
}

/** Блок «О нас» из /api/about-content/?locale= */
export type AboutContent = {
  title: string
  paragraphs: string[]
}

export async function fetchAboutContent(locale: Locale): Promise<AboutContent | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/about-content/?locale=${loc}`)
  if (!res?.ok) return null
  return res.json().catch(() => null)
}

/** Контент главного блока (GET /api/hero/?locale=) */
export type HeroContent = {
  image: string | null
  image_url: string
  badge: string
  title1: string
  title2: string
  subtitle: string
}

export async function fetchHeroContent(locale: Locale): Promise<HeroContent | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/hero/?locale=${loc}`)
  if (!res?.ok) return null
  return res.json().catch(() => null)
}

export async function sendContactForm(
  type: ContactFormType,
  payload: { name: string; email: string; message: string }
): Promise<{ ok: true } | { error: string }> {
  const res = await fetch(`${getApiUrl()}/api/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, ...payload }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return { error: (data as { error?: string }).error || `Ошибка ${res.status}` }
  if ((data as { ok?: boolean }).ok) return { ok: true }
  return { error: (data as { error?: string }).error || 'Неизвестная ошибка' }
}
