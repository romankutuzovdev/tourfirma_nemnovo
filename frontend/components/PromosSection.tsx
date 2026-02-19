'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale, usePromos } from '@/contexts/LocaleContext'

export function PromosSection() {
  const locale = useLocale()
  const t = useTranslations()
  const promos = usePromos()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif-legacy text-3xl font-semibold text-black mb-6">
          {t('promos.title') || 'Горящие предложения'}
        </h2>
        {promos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promos.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/promos/${p.slug}`}
                className="block p-4 rounded-xl border border-secondary/20 hover:border-primary/50 transition-colors"
              >
                <p className="font-sans font-semibold text-black">{p.title}</p>
                {p.excerpt && <p className="font-sans text-sm text-black/70 mt-1">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <p className="font-sans text-black/70">{t('promos.empty') || 'Акции скоро появятся.'}</p>
        )}
      </div>
    </section>
  )
}
