'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { AnimateOnScroll } from './AnimateOnScroll'

export function AboutSection() {
  const t = useTranslations()
  const locale = useLocale()
  const points = (t.raw('about.points') as string[]) || []

  return (
    <section id="about" className="py-20 md:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4">{t('about.badge')}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-black tracking-tight">{t('about.title')}</h2>
          <p className="mt-6 font-sans text-lg text-black/85 leading-relaxed">{t('about.p1')}</p>
          {Array.isArray(points) && points.length > 0 && (
            <ul className="mt-8 space-y-4">
              {points.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <span className="text-primary text-sm font-bold">•</span>
                  </span>
                  <span className="font-sans text-black/85">{point}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href={`/${locale}/contact`} className="inline-block mt-10 px-6 py-3 bg-primary text-black font-sans text-sm font-semibold hover:bg-primary/90 transition-colors">
            {t('about.cta')}
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
