'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'

export function MapSection() {
  const locale = useLocale()
  const t = useTranslations()

  const lat = 53.6884
  const lon = 23.8258

  return (
    <section className="py-16 bg-secondary/10">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif-legacy text-3xl font-semibold text-black mb-6">
          {t('map.title') || 'Как нас найти'}
        </h2>
        <div className="rounded-xl overflow-hidden border border-secondary/20 bg-secondary/20 h-64 flex items-center justify-center">
          <a
            href={`https://yandex.ru/maps/?pt=${lon},${lat}&z=16&l=map`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-primary font-semibold hover:underline"
          >
            {t('map.openInYandex') || 'Открыть в Яндекс.Картах'}
          </a>
        </div>
        <Link href={`/${locale}/how-to-get`} className="inline-block mt-4 font-sans text-primary font-semibold hover:underline">
          {t('footer.howToGet')}
        </Link>
      </div>
    </section>
  )
}
