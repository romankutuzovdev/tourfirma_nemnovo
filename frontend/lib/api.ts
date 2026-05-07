/**
 * API бэкенда: контент (услуги, новости). UI-переводы — в frontend/locales (next-intl).
 */

import type { Locale } from './i18n'
import { authFetch } from './auth'

const LOCALES: Locale[] = ['ru']

/**
 * База URL для запросов к Django API (турфирма).
 * - SSR: абсолютный BACKEND_URL (Node не умеет fetch с относительным URL без базы).
 * - Браузер: пустая строка → те же /api и /media, что проксирует Next (same-origin).
 * - Явный NEXT_PUBLIC_API_URL — для dev с отдельным origin или туннеля.
 */
export function getApiUrl(): string {
  if (typeof window === 'undefined') {
    const internal = (process.env.BACKEND_URL || 'http://127.0.0.1:8100').trim().replace(/\/$/, '')
    return internal
  }
  const raw = process.env.NEXT_PUBLIC_API_URL
  if (raw === '' || (typeof raw === 'string' && raw.trim() === '')) return ''
  // Safety: in production browser must never call localhost/127.0.0.1
  // (this breaks API calls for real users and hides data like float trips).
  if (typeof raw === 'string') {
    const val = raw.trim()
    const host = window.location.hostname
    const isLocalHost = host === 'localhost' || host === '127.0.0.1'
    const pointsToLocal =
      val.startsWith('http://127.0.0.1') ||
      val.startsWith('https://127.0.0.1') ||
      val.startsWith('http://localhost') ||
      val.startsWith('https://localhost')
    if (!isLocalHost && pointsToLocal) return ''
  }
  if (raw === undefined && process.env.NODE_ENV === 'development') {
    return 'http://127.0.0.1:8100'.replace(/\/$/, '')
  }
  if (raw === undefined) return ''
  return String(raw).trim().replace(/\/$/, '')
}

/** Элемент из /api/services/?locale= */
export type ServiceItem = {
  slug: string
  image: string | null
  image_url: string
  order: number
  price: string | null
  has_variants?: boolean
  title: string
  short_desc: string
}

/** Иерархический элемент из /api/services/?locale=ru&tree=1 */
export type ServiceTreeNode = ServiceItem & {
  children: ServiceTreeNode[]
}

/** Ответ /api/services/<slug>/?locale= — children есть у разделов (категорий) */
export type ServiceDetail = ServiceItem & {
  long_desc: string
  seo_title?: string
  seo_description?: string
  variants?: ServiceVariant[]
  has_variants?: boolean
  children?: ServiceItem[]
}

export type ServiceVariant = {
  name: string
  description: string
  price: string | null
}

export type CartCheckoutItem = {
  service_slug?: string
  float_slug?: string
  variant_name?: string
  quantity: number
}

export type ServiceOrder = {
  id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  comment: string
  status: string
  total_amount: string
  created_at: string
  items: Array<{
    service_slug?: string
    float_slug?: string
    service_title: string
    variant_name: string
    quantity: number
    unit_price: string
    line_total: string
  }>
}

/** Нормализует URL картинки: полный URL или относительный /media/... (если API на том же origin) */
function toAbsoluteImageUrl(value: string): string {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    // Бэкенд может отдавать абсолютные URL на 127.0.0.1/localhost (внутренний хост).
    // Это ломает и SSR (в HTML попадает localhost), и браузер, поэтому всегда приводим к относительному пути.
    try {
      const u = new URL(value)
      if (u.hostname === '127.0.0.1' || u.hostname === 'localhost') {
        const path = u.pathname.startsWith('/') ? u.pathname : `/${u.pathname}`
        return path.startsWith('/media') ? path : `/media/${path.replace(/^\//, '')}`
      }
    } catch {
      // ignore
    }
    return value
  }
  const path = value.startsWith('/') ? value : `/${value}`
  const mediaPath = path.startsWith('/media') ? path : `/media/${path.replace(/^\//, '')}`
  // Важно: изображения должны грузиться same-origin через /media (Next.js rewrite),
  // иначе SSR может вставить внутренний BACKEND_URL (127.0.0.1), что ломает прод для пользователей.
  return mediaPath
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
  return item.image_url ? toAbsoluteImageUrl(item.image_url) : ''
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
export type NewsDetail = NewsItem & {
  long_desc: string
  seo_title?: string
  seo_description?: string
}

/** URL картинки новости: приоритет у загруженного image, иначе image_url */
export function getNewsImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image) return toAbsoluteImageUrl(item.image)
  return item.image_url ? toAbsoluteImageUrl(item.image_url) : ''
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
export type PromoDetail = PromoItem & {
  long_desc: string
  seo_title?: string
  seo_description?: string
}

/** URL картинки акции: приоритет у загруженного image, иначе image_url */
export function getPromoImageSrc(item: { image: string | null; image_url: string }): string {
  if (item.image) return toAbsoluteImageUrl(item.image)
  return item.image_url ? toAbsoluteImageUrl(item.image_url) : ''
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
  return item.image_url ? toAbsoluteImageUrl(item.image_url) : ''
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

export async function fetchServices(locale: Locale, options?: { tree?: boolean }): Promise<ServiceItem[] | ServiceTreeNode[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const tree = options?.tree ? '&tree=1' : ''
  const res = await apiFetch(`${getApiUrl()}/api/services/?locale=${loc}${tree}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

/** Получить иерархический список услуг (разделы с подразделами) */
export async function fetchServicesTree(locale: Locale): Promise<ServiceTreeNode[]> {
  const data = await fetchServices(locale, { tree: true })
  return Array.isArray(data) ? data as ServiceTreeNode[] : []
}

/** Развернуть дерево услуг в плоский список (для обратной совместимости) */
export function flattenServiceTree(nodes: ServiceTreeNode[]): ServiceItem[] {
  const result: ServiceItem[] = []
  function walk(items: ServiceTreeNode[]) {
    for (const item of items) {
      const { children, ...rest } = item
      result.push(rest)
      if (children?.length) walk(children)
    }
  }
  walk(nodes)
  return result
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
  bank_account: string
  bank_institution: string
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
  time: string | null
  time_display: string | null
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
  return toAbsoluteImageUrl(raw)
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
  seo_title?: string
  seo_description?: string
  video_url: string  // YouTube, Vimeo или прямой URL видео
  map_embed_url: string  // URL для iframe (Яндекс.Карты)
}

/** URL картинки сплава: приоритет у загруженного image, иначе image_url */
export function getFloatImageSrc(item: { image: string | null; image_url: string }): string {
  const raw = item.image || item.image_url || ''
  if (!raw) return ''

  // В проде бэкенд иногда отдаёт абсолютные URL на 127.0.0.1 (внутренний host).
  // Для фронта безопаснее использовать относительный путь, чтобы /media проксировался same-origin.
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const path = new URL(raw).pathname
      return path.startsWith('/') ? path : `/${path}`
    } catch {
      return raw
    }
  }

  return toAbsoluteImageUrl(raw)
}

export async function fetchFloatTrips(locale: Locale): Promise<FloatTripItem[]> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  // Важно: не используем "/?locale=" (даёт 308 на некоторых прокси/конфигах).
  const res = await apiFetch(`${getApiUrl()}/api/float-trips?locale=${loc}`)
  if (!res?.ok) return []
  return res.json().catch(() => [])
}

export async function fetchFloatTripBySlug(
  slug: string,
  locale: Locale
): Promise<FloatTripDetail | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  // Аналогично списку: избегаем редиректа из-за "/?locale=".
  const res = await apiFetch(`${getApiUrl()}/api/float-trips/${encodeURIComponent(slug)}?locale=${loc}`)
  if (!res || res.status === 404 || !res.ok) return null
  return res.json().catch(() => null)
}

/** Юридическая страница из /api/legal/<page_key>/?locale= */
export type LegalPageContent = {
  page_key: string
  title: string
  content: string
  seo_title?: string
  seo_description?: string
}

export async function fetchLegalPage(pageKey: string, locale: Locale): Promise<LegalPageContent | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/legal/${encodeURIComponent(pageKey)}/?locale=${loc}`)
  if (!res?.ok) return null
  return res.json().catch(() => null)
}

/** Блок «О нас» на главной из /api/about-content/?locale= */
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

/** Блок страницы «О нас» из /api/about-page-content/?locale= (отдельно от главной) */
export type AboutPageContent = {
  title: string
  paragraphs: string[]
  images: string[]
  video_url: string
  presentation: string | null
  presentation_url: string
}

export async function fetchAboutPageContent(locale: Locale): Promise<AboutPageContent | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/about-page-content/?locale=${loc}`)
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

/** Подарочный сертификат (GET /api/certificate/?locale=) */
export type CertificateContent = {
  image: string | null
  image_url: string
  title: string
  content: string
}

export async function fetchCertificateContent(locale: Locale): Promise<CertificateContent | null> {
  const loc = LOCALES.includes(locale) ? locale : 'ru'
  const res = await apiFetch(`${getApiUrl()}/api/certificate/?locale=${loc}`)
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

export async function createServiceOrder(payload: {
  name: string
  email?: string
  phone?: string
  comment?: string
  items: CartCheckoutItem[]
}): Promise<{ ok: true; order: ServiceOrder } | { error: string; unauthorized?: boolean }> {
  const res = await authFetch(`${getApiUrl()}/api/orders/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) return { error: 'Требуется авторизация', unauthorized: true }
  if (!res.ok) {
    const d = data as { error?: string; details?: unknown }
    const detailsText = d.details ? ` (${JSON.stringify(d.details)})` : ''
    return { error: (d.error || `Ошибка ${res.status}`) + detailsText }
  }
  if ((data as { ok?: boolean }).ok && (data as { order?: ServiceOrder }).order) {
    return { ok: true, order: (data as { order: ServiceOrder }).order }
  }
  return { error: 'Не удалось оформить заказ' }
}

export async function fetchServiceOrders(): Promise<ServiceOrder[]> {
  const res = await authFetch(`${getApiUrl()}/api/orders/`)
  if (res.status === 401) {
    throw new Error('UNAUTHORIZED')
  }
  if (!res.ok) return []
  return res.json().catch(() => [])
}
