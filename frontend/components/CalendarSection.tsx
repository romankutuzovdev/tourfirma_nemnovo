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

export function CalendarSection() {
  const locale = useLocale()
  const t = useTranslations()
  const now = new Date()
  const [year, setYear] = useState(() => now.getFullYear())
  const [month, setMonth] = useState(() => now.getMonth() + 1)
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

  const monthName = new Date(year, month - 1).toLocaleDateString(LOCALE_TO_INTL[locale] || 'ru-RU', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <section id="calendar" className="scroll-mt-24 pt-12 md:pt-16 pb-6 md:pb-8 bg-[#f8bd69]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="section-title-main text-white">{t('calendarPage.title')}</h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2.5 rounded-full border-2 border-white/60 text-white hover:bg-white/20 hover:border-white transition-colors shrink-0"
            aria-label={t('calendarPage.prevMonth')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="font-sans text-xl md:text-2xl font-medium text-white capitalize">{monthName}</p>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2.5 rounded-full border-2 border-white/60 text-white hover:bg-white/20 hover:border-white transition-colors shrink-0"
            aria-label={t('calendarPage.nextMonth')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-xl bg-white/20 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="mt-8 font-sans text-lg text-white/80 py-8 text-center">
            {t('calendarPage.empty')}
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {events.slice(0, 6).map((ev) => (
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

        <div className="mt-10 text-center">
          <Link
            href={`/${locale}/calendar`}
            className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-sans text-sm font-semibold tracking-wide hover:bg-white hover:text-[#f8bd69] transition-colors rounded-lg"
          >
            {t('eventsSection.allEvents')}
          </Link>
        </div>
      </div>
    </section>
  )
}
