'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale, useExcursions } from '@/contexts/LocaleContext'
import { AnimateOnScroll } from './AnimateOnScroll'

export function ExcursionsSection() {
  const t = useTranslations()
  const locale = useLocale()
  const excursions = useExcursions()

  if (excursions.length === 0) return null

  const byCategory = excursions.reduce<Record<string, typeof excursions>>((acc, e) => {
    const key = e.category_slug || e.category_name || 'other'
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {})

  const categories = Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))

  return (
    <section id="excursions" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4">{t('excursions.badge')}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">{t('excursions.title')}</h2>
          <p className="mt-4 font-sans text-lg text-black/80 max-w-2xl">{t('excursions.intro')}</p>
        </AnimateOnScroll>

        {categories.map(([catKey, items], ci) => (
          <AnimateOnScroll key={catKey} variant="fade-up" delay={ci * 50}>
            {items[0]?.category_name && (
              <h3 className="mt-12 font-serif text-xl font-medium text-black mb-6">{items[0].category_name}</h3>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((e, i) => (
                <Link
                  key={e.slug}
                  href={`/${locale}/excursions/${e.slug}`}
                  className="block p-5 bg-secondary/20 rounded-lg border border-secondary/20 hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  {e.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-secondary/30">
                      <Image src={e.image} alt={e.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <h4 className="font-serif text-lg font-medium text-black group-hover:text-primary">{e.title}</h4>
                  {e.short_desc && <p className="mt-2 font-sans text-sm text-black/70 line-clamp-2">{e.short_desc}</p>}
                  <span className="mt-3 inline-block font-sans text-xs font-semibold text-primary group-hover:underline">
                    {t('servicesSection.more')}
                  </span>
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
        ))}

        <AnimateOnScroll variant="fade-up">
          <Link
            href={`/${locale}/excursions`}
            className="inline-flex items-center gap-2 mt-12 font-sans font-semibold text-primary hover:underline"
          >
            {t('excursions.ctaButton')}
            <span aria-hidden>→</span>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
