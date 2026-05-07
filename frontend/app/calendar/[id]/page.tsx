'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { PageLayout } from '@/components/PageLayout'
import { FloatDescription } from '@/components/FloatDescription'
import {
  fetchCalendarEventDetail,
  sendContactForm,
  getCalendarEventImageSrc,
  type CalendarEventDetailItem,
} from '@/lib/api'

const LOCALE_TO_INTL: Record<string, string> = {
  ru: 'ru-RU',
  be: 'be-BY',
  en: 'en-US',
  pl: 'pl-PL',
  zh: 'zh-CN',
}

export default function CalendarEventDetailPage() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const locale = useLocale()
  const t = useTranslations()
  const [event, setEvent] = useState<CalendarEventDetailItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [bookSuccess, setBookSuccess] = useState(false)
  const [bookError, setBookError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' })

  useEffect(() => {
    if (!params?.id) return
    const numId = parseInt(params.id, 10)
    if (isNaN(numId)) {
      setLoading(false)
      setEvent(null)
      return
    }
    setLoading(true)
    fetchCalendarEventDetail(numId, locale).then((data) => {
      setEvent(data)
      setLoading(false)
    })
  }, [params?.id, locale])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event) return
    setBookError(null)
    setBooking(true)
    const result = await sendContactForm('main', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: `Бронирование из календаря:\nСобытие: ${event.title}\nДата: ${formatDate(event.date, event.time_display)}\nТелефон: ${formData.phone.trim()}\n\n${formData.message.trim()}`,
    })
    setBooking(false)
    if ('ok' in result) {
      setBookSuccess(true)
    } else {
      setBookError(result.error)
    }
  }

  const formatDate = (dateStr: string, timeStr?: string | null) => {
    const d = new Date(dateStr + 'T12:00:00').toLocaleDateString(LOCALE_TO_INTL[locale] || 'ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    return timeStr ? `${d}, ${timeStr}` : d
  }

  if (loading || !params?.id) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (!event) {
    return (
      <PageLayout title={t('calendarPage.notFound')}>
        <div className="py-16 text-center">
          <p className="font-sans text-black/70 mb-6">{t('calendarPage.notFoundDesc')}</p>
          <Link
            href="/calendar"
            className="inline-flex px-6 py-3 rounded-lg bg-primary text-white font-sans font-semibold hover:bg-primary/90"
          >
            {t('calendarPage.backToCalendar')}
          </Link>
        </div>
      </PageLayout>
    )
  }

  const desc = event.long_desc
  const returnMonth = searchParams.get('ym')
  const backToCalendarHref = returnMonth ? `/calendar?ym=${encodeURIComponent(returnMonth)}` : '/calendar'

  return (
    <PageLayout
      title={event.title}
      description={formatDate(event.date, event.time_display)}
      badge={t('calendarPage.title')}
    >
      <article className="pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
          <Link
            href={backToCalendarHref}
            className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-primary mb-4"
          >
            <span aria-hidden>←</span>
            {t('calendarPage.backToCalendar')}
          </Link>
          {/* Hero */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-secondary/30 mb-8 md:mb-12">
            {getCalendarEventImageSrc(event) ? (
              <Image
                src={getCalendarEventImageSrc(event)}
                alt={event.title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-secondary/50 flex items-center justify-center">
                <span className="font-serif text-6xl md:text-8xl font-medium text-white/90">
                  {new Date(event.date).getDate()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-sans text-white/90 text-sm md:text-base">{formatDate(event.date, event.time_display)}</p>
              <div className="mt-2 flex flex-wrap gap-4 font-sans text-white/90">
                <span>
                  {t('calendarPage.priceFrom')} {event.price_display} {t('calendarPage.byr')}
                </span>
                <span>
                  {event.available_slots} {t('calendarPage.slots')}
                </span>
              </div>
            </div>
          </div>

          {/* Описание (HTML из CKEditor или plain text) */}
          {desc && (
            <div className="prose prose-lg max-w-none mb-12">
              <FloatDescription text={desc} className="text-black/85" />
            </div>
          )}

          {/* Бронирование */}
          <section id="book" className="scroll-mt-24 pt-8 border-t border-secondary/20">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-6">
              {t('calendarPage.book')}
            </h2>
            {bookSuccess ? (
              <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20">
                <p className="font-sans text-lg text-primary font-medium">{t('calendarPage.success')}</p>
                <Link
                  href={backToCalendarHref}
                  className="inline-block mt-4 px-6 py-2.5 rounded-lg bg-primary text-white font-sans font-semibold hover:bg-primary/90"
                >
                  {t('calendarPage.backToCalendar')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBook} className="max-w-xl space-y-4">
                <div>
                  <label htmlFor="book-name" className="block font-sans text-sm font-medium text-black mb-1">
                    {t('calendarPage.name')} *
                  </label>
                  <input
                    id="book-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="book-phone" className="block font-sans text-sm font-medium text-black mb-1">
                    {t('contact.phoneLabel')} *
                  </label>
                  <input
                    id="book-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="book-email" className="block font-sans text-sm font-medium text-black mb-1">
                    {t('contact.emailLabel')}
                  </label>
                  <input
                    id="book-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="book-message" className="block font-sans text-sm font-medium text-black mb-1">
                    {t('contact.messageLabel')} *
                  </label>
                  <textarea
                    id="book-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  />
                </div>
                {bookError && <p className="font-sans text-sm text-red-600">{bookError}</p>}
                <button
                  type="submit"
                  disabled={booking}
                  className="w-full py-4 rounded-lg bg-primary text-white font-sans font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {booking ? '...' : t('calendarPage.submit')}
                </button>
              </form>
            )}
          </section>

          <div className="mt-6">
            <Link
              href={backToCalendarHref}
              className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-primary transition-colors"
            >
              <span aria-hidden>←</span>
              {t('calendarPage.backToCalendar')}
            </Link>
          </div>
        </div>
      </article>
    </PageLayout>
  )
}
