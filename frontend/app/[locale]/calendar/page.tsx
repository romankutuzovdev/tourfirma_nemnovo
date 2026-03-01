'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
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
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-white to-primary/20">
      <header className="pt-52 md:pt-40 pb-6 md:pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary tracking-tight max-w-2xl">
          {t('calendarPage.title')}
        </h1>
      </header>

      <section className="pb-16 md:pb-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2.5 rounded-full border-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-colors"
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
            className="p-2.5 rounded-full border-2 border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-colors"
            aria-label="Следующий месяц"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl bg-secondary/20 animate-pulse"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="font-sans text-lg text-black/70 py-12 text-center">
            {t('calendarPage.empty')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {events.map((ev) => (
              <article
                key={ev.id}
                className="group relative rounded-xl overflow-hidden border border-secondary/20 bg-white shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <Link href={`/${locale}/calendar/${ev.id}`} className="block text-left">
                  <div className="relative aspect-[4/3] bg-secondary/30">
                    {getCalendarEventImageSrc(ev) ? (
                      <Image
                        src={getCalendarEventImageSrc(ev)}
                        alt={ev.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center">
                        <span className="font-serif text-4xl font-medium text-white/90">
                          {new Date(ev.date).getDate()}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="font-sans text-sm md:text-base font-semibold tracking-wider text-white/90 uppercase">
                        {new Date(ev.date + 'T12:00:00').toLocaleDateString(
                          LOCALE_TO_INTL[locale] || 'ru-RU',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </span>
                      <h3 className="font-serif text-lg md:text-xl font-medium text-white mt-1 line-clamp-2">
                        {ev.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-4 font-sans text-sm text-white/90">
                        <span>
                          {t('calendarPage.priceFrom')} {ev.price_display} {t('calendarPage.byr')}
                        </span>
                        <span>
                          {ev.available_slots} {t('calendarPage.slots')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="p-4 flex flex-wrap gap-3">
                  <Link
                    href={`/${locale}/calendar/${ev.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-sans text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t('calendarPage.more')}
                  </Link>
                  <Link
                    href={`/${locale}/calendar/${ev.id}#book`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary text-primary font-sans text-sm font-semibold hover:bg-primary/10 transition-colors"
                  >
                    {t('calendarPage.book')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
