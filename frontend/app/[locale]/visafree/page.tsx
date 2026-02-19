'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { AnimateOnScroll } from '@/components/AnimateOnScroll'

export default function VisaFreePage() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-6">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-8">
          ← {t('nav.home')}
        </Link>
        <AnimateOnScroll variant="fade-up">
          <p className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-4">{t('visafree.badge')}</p>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-black tracking-tight">{t('visafree.title')}</h1>
          <p className="mt-8 font-sans text-lg text-black/85 leading-relaxed">{t('visafree.p1')}</p>
          <p className="mt-4 font-sans text-lg text-black/85 leading-relaxed">{t('visafree.p2')}</p>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={100}>
          <div className="mt-12 p-6 md:p-8 bg-secondary/30 rounded-xl border border-secondary/20">
            <h2 className="font-serif text-xl font-medium text-black mb-4">{t('visafree.mapTitle')}</h2>
            <iframe
              src="https://yandex.by/maps?um=constructor%3A8837e4e9d68c6d264d050d1011fe0b37bab0f3e095f43d57da5af2b851807750&source=constructor"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              className="rounded-lg"
              title={t('visafree.mapTitle')}
            />
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={150}>
          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="https://nemnovotour.by/brest-grodno-visa-free/zajavka-na-vjezd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-black font-sans font-semibold hover:bg-primary/90 rounded transition-colors"
            >
              {t('visafree.applyButton')}
            </a>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center px-8 py-4 border border-secondary/40 text-black font-sans font-semibold hover:border-primary/50 rounded transition-colors"
            >
              {t('visafree.contactButton')}
            </Link>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="fade-up" delay={200}>
          <div className="mt-16 grid sm:grid-cols-2 gap-6">
            <Link href="https://grodnovisafree.by/dokumenty/pravila/item/7465-spisok-stran.html" target="_blank" rel="noopener noreferrer" className="block p-4 border border-secondary/20 rounded-lg hover:border-primary/40 transition-colors">
              <h3 className="font-serif font-medium text-black">{t('visafree.linksList')}</h3>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
