'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
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
  const locale = 'ru'
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
            className="p-2.5 rounded-full bg-white text-primary hover:bg-white/90 transition-colors shrink-0"
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
            className="p-2.5 rounded-full bg-white text-primary hover:bg-white/90 transition-colors shrink-0"
            aria-label={t('calendarPage.nextMonth')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="mt-8 space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-white/20 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <p className="mt-8 font-sans text-lg text-white/80 py-8 text-center">
            {t('calendarPage.empty')}
          </p>
        ) : (
          <div className="mt-8 rounded-xl border border-white/30 bg-white/10 overflow-hidden">
            <ul className="divide-y divide-white/20">
              {events.slice(0, 6).map((ev) => {
                const dateStr = new Date(ev.date + 'T12:00:00').toLocaleDateString(
                  LOCALE_TO_INTL[locale] || 'ru-RU',
                  { day: 'numeric', month: 'short', year: 'numeric' }
                )
                const imgSrc = getCalendarEventImageSrc(ev)
                return (
                  <li key={ev.id} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 hover:bg-white/10 transition-colors">
                      <Link href={`/calendar/${ev.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="shrink-0 w-14 h-14 rounded-lg bg-white/20 overflow-hidden flex items-center justify-center">
                          {imgSrc ? (
                            <Image
                              src={imgSrc}
                              alt=""
                              width={56}
                              height={56}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="font-serif text-lg font-medium text-white/80">
                              {new Date(ev.date).getDate()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-sans text-sm text-white/80">
                            {dateStr}
                            {ev.time_display && (
                              <span className="ml-1.5 font-medium text-white">
                                {ev.time_display}
                              </span>
                            )}
                          </p>
                          <h3 className="font-serif text-base font-medium text-white mt-0.5 group-hover:text-white/90 transition-colors truncate">
                            {ev.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-x-4 font-sans text-sm text-white/80">
                            <span>{t('calendarPage.priceFrom')} {ev.price_display} {t('calendarPage.byr')}</span>
                            <span>{ev.available_slots} {t('calendarPage.slots')}</span>
                          </div>
                        </div>
                      </Link>
                      <div className="flex shrink-0 gap-2 sm:ml-4">
                        <Link
                          href={`/calendar/${ev.id}`}
                          className="inline-flex px-4 py-2 rounded-lg bg-white text-[#f8bd69] font-sans text-sm font-semibold hover:bg-white/90 transition-colors"
                        >
                          {t('calendarPage.more')}
                        </Link>
                        <Link
                          href={`/calendar/${ev.id}#book`}
                          className="inline-flex px-4 py-2 rounded-lg border-2 border-white text-white font-sans text-sm font-semibold hover:bg-white/20 transition-colors"
                        >
                          {t('calendarPage.book')}
                        </Link>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="mt-10 mb-4 text-center">
          <Link
            href="/calendar"
            className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-sans text-sm font-semibold tracking-wide hover:bg-white hover:text-[#f8bd69] transition-colors rounded-lg"
          >
            {t('eventsSection.allEvents')}
          </Link>
        </div>
      </div>
    </section>
  )
}
