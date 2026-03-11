'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { PageLayout } from '@/components/PageLayout'
import {
  fetchCalendarEventDetail,
  bookCalendarEvent,
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
  const locale = 'ru'
  const t = useTranslations()
  const [event, setEvent] = useState<CalendarEventDetailItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [bookSuccess, setBookSuccess] = useState(false)
  const [bookError, setBookError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', participants: 1 })

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
    const result = await bookCalendarEvent(event.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      participants_count: formData.participants,
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
      <PageLayout headerClassName="pt-52 md:pt-40">
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (!event) {
    return (
      <PageLayout title={t('calendarPage.notFound')} headerClassName="pt-52 md:pt-40">
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

  return (
    <PageLayout
      title={event.title}
      description={formatDate(event.date, event.time_display)}
      badge={t('calendarPage.title')}
      headerClassName="pt-52 md:pt-40"
    >
      <article className="pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto">
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

          {/* Описание */}
          {desc && (
            <div className="prose prose-lg max-w-none mb-12">
              <div className="font-sans text-black/85 leading-relaxed whitespace-pre-line">
                {desc}
              </div>
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
                  href="/calendar"
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
                  <label htmlFor="book-email" className="block font-sans text-sm font-medium text-black mb-1">
                    {t('calendarPage.email')} *
                  </label>
                  <input
                    id="book-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="book-phone" className="block font-sans text-sm font-medium text-black mb-1">
                    {t('calendarPage.phone')}
                  </label>
                  <input
                    id="book-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="book-participants" className="block font-sans text-sm font-medium text-black mb-1">
                    {t('calendarPage.participants')}
                  </label>
                  <input
                    id="book-participants"
                    type="number"
                    min={1}
                    max={event.available_slots}
                    value={formData.participants}
                    onChange={(e) =>
                      setFormData((d) => ({
                        ...d,
                        participants: Math.max(
                          1,
                          Math.min(event.available_slots, parseInt(e.target.value, 10) || 1)
                        ),
                      }))
                    }
                    className="w-full px-4 py-3 border border-secondary/30 rounded-lg font-sans text-black focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
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

          <div className="mt-12">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 font-sans text-black/80 hover:text-primary transition-colors"
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
