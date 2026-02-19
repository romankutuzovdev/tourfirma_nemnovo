'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale, useExcursions } from '@/contexts/LocaleContext'
import { AnimateOnScroll } from '@/components/AnimateOnScroll'

export default function ExcursionsPage() {
  const t = useTranslations()
  const locale = useLocale()
  const excursions = useExcursions()

  const byCategory = excursions.reduce<Record<string, typeof excursions>>((acc, e) => {
    const key = e.category_slug || e.category_name || 'other'
    if (!acc[key]) acc[key] = []
    acc[key].push(e)
    return acc
  }, {})

  const categories = Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-8">
          ← {t('nav.home')}
        </Link>
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4">{t('excursions.badge')}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-black tracking-tight">{t('excursions.title')}</h1>
          <p className="mt-6 font-sans text-lg text-black/80 max-w-2xl">{t('excursions.intro')}</p>
        </AnimateOnScroll>

        {excursions.length > 0 ? (
          <>
            {categories.map(([catKey, items], ci) => (
              <AnimateOnScroll key={catKey} variant="fade-up" delay={ci * 100}>
                {items[0]?.category_name && (
                  <h2 className="mt-16 font-serif text-2xl font-medium text-black mb-6">{items[0].category_name}</h2>
                )}
                <div className="grid sm:grid-cols-2 gap-6">
                  {items.map((e) => (
                    <Link
                      key={e.slug}
                      href={`/${locale}/excursions/${e.slug}`}
                      className="block p-5 bg-secondary/30 rounded-lg border border-secondary/20 hover:border-primary/40 hover:shadow-md transition-all group"
                    >
                      {e.image && (
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-secondary/30">
                          <Image src={e.image} alt={e.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width:640px) 100vw, 50vw" />
                        </div>
                      )}
                      <h3 className="font-serif text-lg font-medium text-black group-hover:text-primary">{e.title}</h3>
                      {e.short_desc && <p className="mt-2 font-sans text-sm text-black/70 line-clamp-2">{e.short_desc}</p>}
                      <span className="mt-3 inline-block font-sans text-xs font-semibold text-primary group-hover:underline">
                        {t('servicesSection.more')}
                      </span>
                    </Link>
                  ))}
                </div>
              </AnimateOnScroll>
            ))}

            <div className="mt-16 p-8 bg-primary/10 rounded-xl border border-primary/20">
              <p className="font-sans text-black/90">{t('excursions.cta')}</p>
              <Link href={`/${locale}/contact`} className="inline-block mt-4 px-6 py-3 bg-primary text-black font-sans font-semibold hover:bg-primary/90 transition-colors rounded">
                {t('excursions.ctaButton')}
              </Link>
            </div>
          </>
        ) : (
          <div className="mt-16 p-8 bg-secondary/20 rounded-xl text-center">
            <p className="font-sans text-black/70">{t('empty.description')}</p>
            <Link href={`/${locale}`} className="inline-block mt-4 font-sans font-semibold text-primary hover:underline">
              {t('empty.backHome')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
