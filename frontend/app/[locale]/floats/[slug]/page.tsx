'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchFloatTripBySlug, type FloatTripDetail } from '@/lib/api'

export default function FloatDetailPage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const locale = useLocale()
  const t = useTranslations()
  const [trip, setTrip] = useState<FloatTripDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetchFloatTripBySlug(slug, locale).then((data) => {
      setTrip(data)
      setNotFound(!data)
      setLoading(false)
    })
  }, [slug, locale])

  if (loading) {
    return (
      <div className="min-h-screen pt-52 md:pt-40 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-48 bg-secondary/20 rounded animate-pulse" />
          <div className="mt-8 h-64 bg-secondary/20 rounded-xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen pt-52 md:pt-40 pb-16 flex flex-col items-center justify-center">
        <p className="font-sans text-lg text-black/70">{t('floatsSection.notFound')}</p>
        <Link href={`/${locale}/floats`} className="mt-4 font-sans text-primary hover:underline">
          {t('floatsSection.backToList')}
        </Link>
      </div>
    )
  }

  const hasMap = !!trip.map_embed_url?.trim()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-52 md:pt-40 pb-16">
        <Link
          href={`/${locale}/floats`}
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10"
        >
          ← {t('floatsSection.backToList')}
        </Link>

        <article>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight">
            {trip.title}
          </h1>
          <div className="mt-4 flex flex-wrap gap-6 font-sans text-lg text-black/80">
            <span>
              {trip.distance_km} {t('floatsSection.km')}
            </span>
            <span>
              {t('floatsSection.priceFrom')} {trip.price_per_person} {t('floatsSection.byr')} / {t('floatsSection.perPerson')}
            </span>
          </div>

          {trip.description && (
            <div className="mt-8 font-sans text-black/90 leading-relaxed whitespace-pre-line">
              {trip.description}
            </div>
          )}

          {hasMap && (
            <div className="mt-10">
              <h2 className="font-serif text-xl font-medium text-black mb-4">
                {t('floatsSection.mapTitle')}
              </h2>
              <div className="rounded-xl overflow-hidden border border-secondary/20 bg-secondary/10" style={{ height: 400 }}>
                <iframe
                  src={trip.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={trip.title}
                />
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
