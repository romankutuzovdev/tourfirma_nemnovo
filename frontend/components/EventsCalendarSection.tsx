'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export function EventsCalendarSection() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif-legacy text-3xl font-semibold text-black mb-6">
          {t('events.title') || 'Календарь событий'}
        </h2>
        <p className="font-sans text-black/80 mb-6 max-w-2xl">
          {t('events.description') || 'Актуальные экскурсии, туры и мероприятия. Выберите дату и оставьте заявку.'}
        </p>
        <Link
          href={`/${locale}/excursions`}
          className="inline-flex items-center gap-2 font-sans font-semibold text-primary hover:underline"
        >
          {t('events.cta') || 'Смотреть экскурсии'}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
