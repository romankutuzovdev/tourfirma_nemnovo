'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useLocale, useServices } from '@/contexts/LocaleContext'
import { AnimateOnScroll } from '@/components/AnimateOnScroll'

export default function ServicesPage() {
  const t = useTranslations()
  const locale = useLocale()
  const services = useServices()

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-20 max-w-5xl mx-auto px-6">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-8">
          ← {t('nav.home')}
        </Link>
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4">{t('servicesSection.badge')}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-black tracking-tight">{t('servicesSection.title')}</h1>
        </AnimateOnScroll>

        {services.length > 0 ? (
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <AnimateOnScroll key={s.slug} variant="fade-up" delay={i * 50}>
                <Link
                  href={`/${locale}/services/${s.slug}`}
                  className="block p-6 bg-secondary/20 rounded-xl border border-secondary/20 hover:border-primary/40 hover:shadow-lg transition-all group"
                >
                  {s.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-secondary/30">
                      <Image src={s.image} alt={s.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                  )}
                  <h2 className="font-serif text-xl font-medium text-black group-hover:text-primary">{s.title}</h2>
                  {s.excerpt && <p className="mt-2 font-sans text-sm text-black/70 line-clamp-2">{s.excerpt}</p>}
                  <div className="mt-4 flex items-center justify-between">
                    {s.price != null && s.price > 0 && (
                      <span className="font-sans text-sm font-semibold text-primary">
                        {t('servicesSection.from')} {s.price} BYN
                      </span>
                    )}
                    <span className="font-sans text-xs font-semibold text-primary group-hover:underline">{t('servicesSection.more')}</span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
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
