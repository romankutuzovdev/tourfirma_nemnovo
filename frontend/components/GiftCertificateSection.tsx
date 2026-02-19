'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export function GiftCertificateSection() {
  const locale = useLocale()
  const t = useTranslations()

  return (
    <section className="py-16 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif-legacy text-3xl font-semibold text-black mb-6">
          {t('gift.title') || 'Подарочный сертификат'}
        </h2>
        <p className="font-sans text-black/80 mb-6 max-w-2xl">
          {t('gift.description') || 'Подарите незабываемые впечатления — сертификат на экскурсию или тур.'}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex px-6 py-3 rounded-lg bg-primary text-black font-sans font-semibold hover:bg-primary/90"
        >
          {t('gift.cta') || 'Заказать сертификат'}
        </Link>
      </div>
    </section>
  )
}
