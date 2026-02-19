'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { AnimateOnScroll } from './AnimateOnScroll'

export function VisaFreeSection() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <section id="visafree" className="py-20 md:py-28 bg-primary/10">
      <div className="max-w-6xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4">{t('visafree.badge')}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">{t('visafree.title')}</h2>
          <p className="mt-6 font-sans text-lg text-black/80 max-w-2xl">{t('visafree.p1')}</p>
          <p className="mt-4 font-sans text-lg text-black/80 max-w-2xl">{t('visafree.p2')}</p>
          <Link
            href={`/${locale}/visafree`}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary text-black font-sans font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('visafree.applyButton')}
            <span aria-hidden>→</span>
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
