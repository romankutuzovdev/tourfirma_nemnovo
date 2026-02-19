'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale, useServices } from '@/contexts/LocaleContext'
import { AnimateOnScroll } from './AnimateOnScroll'

export function OffersSection() {
  const t = useTranslations()
  const locale = useLocale()
  const services = useServices()

  if (services.length === 0) return null

  return (
    <section id="offers" className="py-20 md:py-28 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-black/70 mb-4">{t('servicesSection.badge')}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">{t('servicesSection.title')}</h2>
        </AnimateOnScroll>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {services.map((s, i) => (
            <AnimateOnScroll key={s.slug} variant="fade-up" delay={i * 50}>
              <Link
                href={`/${locale}/services/${s.slug}`}
                className="block p-6 bg-white rounded-lg border border-secondary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group overflow-hidden"
              >
                {s.image && (
                  <div className="relative aspect-video -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg bg-secondary/20">
                    <Image src={s.image} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <h3 className="font-serif text-lg font-medium text-black group-hover:text-primary transition-colors">{s.title}</h3>
                {(s.excerpt ?? '').trim() && (
                  <p className="mt-2 font-sans text-sm text-black/70 line-clamp-2">{s.excerpt}</p>
                )}
                {s.price != null && s.price > 0 && (
                  <p className="mt-2 font-sans text-sm font-semibold text-primary">
                    {t('servicesSection.from')} {s.price} {s.currency ?? 'BYN'}
                  </p>
                )}
                <span className="mt-3 inline-block font-sans text-xs font-semibold text-primary group-hover:underline">
                  {t('servicesSection.more')}
                </span>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
