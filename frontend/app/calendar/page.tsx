'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { ContactFormModal } from '@/components/ContactFormModal'
import {
  fetchCalendarEvents,
  getCalendarEventImageSrc,
  type CalendarEventItem,
} from '@/lib/api'

const LOCALE_TO_INTL: Record<string, string> = {
  ru: 'ru-RU',
  be: 'be-BY',
  en: 'en-US',
  pl: 'pl-PL',
  zh: 'zh-CN',
}

export default function CalendarPage() {
  const locale = useLocale()
  const t = useTranslations()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [events, setEvents] = useState<CalendarEventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState<string>('')

  useEffect(() => {
    setLoading(true)
    fetchCalendarEvents(locale, year, month).then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [locale, year, month])

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  const monthName = new Date(year, month - 1).toLocaleDateString(
    LOCALE_TO_INTL[locale] || 'ru-RU',
    { month: 'long', year: 'numeric' }
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-primary/20">
      <header className="pt-6 md:pt-8 pb-6 md:pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black transition-colors mb-4"
        >
          ← {t('nav.home')}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary tracking-tight max-w-2xl">
          {t('calendarPage.title')}
        </h1>
      </header>

      <section className="pb-16 md:pb-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label="Предыдущий месяц"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-primary capitalize">
            {monthName}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            aria-label="Следующий месяц"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-secondary/20 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="font-sans text-lg text-black/70 py-12 text-center">
            {t('calendarPage.empty')}
          </p>
        ) : (
          <div className="rounded-xl border border-secondary/20 bg-white shadow-sm overflow-hidden">
            <ul className="divide-y divide-secondary/10">
              {events.map((ev) => {
                const dateStr = new Date(ev.date + 'T12:00:00').toLocaleDateString(
                  LOCALE_TO_INTL[locale] || 'ru-RU',
                  { day: 'numeric', month: 'short', year: 'numeric' }
                )
                const imgSrc = getCalendarEventImageSrc(ev)
                return (
                  <li key={ev.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 hover:bg-primary/5 transition-colors">
                      <Link href={`/calendar/${ev.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="shrink-0 w-16 h-16 rounded-lg bg-secondary/20 overflow-hidden flex items-center justify-center">
                          {imgSrc ? (
                            <Image
                              src={imgSrc}
                              alt=""
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-serif text-xl font-medium text-primary/70">
                              {new Date(ev.date).getDate()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-sm text-black/60">
                            {dateStr}
                            {ev.time_display && (
                              <span className="ml-1.5 font-medium text-primary">
                                {ev.time_display}
                              </span>
                            )}
                          </p>
                          <h3 className="font-serif text-lg font-medium text-black mt-0.5 group-hover:text-primary transition-colors truncate">
                            {ev.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 font-sans text-sm text-black/70">
                            <span>
                              {t('calendarPage.priceFrom')} {ev.price_display} {t('calendarPage.byr')}
                            </span>
                            <span>{ev.available_slots} {t('calendarPage.slots')}</span>
                          </div>
                        </div>
                      </Link>
                      <div className="flex shrink-0 gap-2 sm:ml-4">
                        <Link
                          href={`/calendar/${ev.id}`}
                          className="inline-flex px-4 py-2 rounded-lg bg-primary text-white font-sans text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          {t('calendarPage.more')}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            const when = `${dateStr}${ev.time_display ? ` ${ev.time_display}` : ''}`
                            setModalMessage(`Хочу забронировать: ${ev.title}\nДата: ${when}`)
                            setModalOpen(true)
                          }}
                          className="inline-flex px-4 py-2 rounded-lg border-2 border-primary text-primary font-sans text-sm font-semibold hover:bg-primary/10 transition-colors"
                        >
                          {t('calendarPage.book')}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>
      <ContactFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialMessage={modalMessage} />
    </div>
  )
}
