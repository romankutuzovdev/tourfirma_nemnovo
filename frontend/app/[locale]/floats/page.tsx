'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchFloatTrips, fetchFloatTripBySlug, type FloatTripItem, type FloatTripDetail } from '@/lib/api'

export default function FloatsPage() {
  const locale = useLocale()
  const t = useTranslations()
  const [trips, setTrips] = useState<FloatTripItem[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [selectedTrip, setSelectedTrip] = useState<FloatTripDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFloatTrips(locale).then((data) => {
      setTrips(data)
      setLoading(false)
      if (data.length > 0 && !selectedSlug) setSelectedSlug(data[0].slug)
    })
  }, [locale])

  useEffect(() => {
    if (!selectedSlug) {
      setSelectedTrip(null)
      return
    }
    fetchFloatTripBySlug(selectedSlug, locale).then(setSelectedTrip)
  }, [selectedSlug, locale])

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 via-white to-primary/20">
      <header className="pt-44 md:pt-32 pb-6 md:pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="lg:hidden inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black transition-colors mb-6"
        >
          ← {t('nav.home')}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary tracking-tight max-w-2xl">
          {t('floatsSection.title')}
        </h1>
        <p className="mt-4 font-sans text-black/80 max-w-xl">
          {t('floatsSection.description')}
        </p>
      </header>

      <section className="pt-6 md:pt-10 pb-16 md:pb-24 max-w-6xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="space-y-6">
            <div className="h-12 w-64 bg-secondary/20 rounded animate-pulse" />
            <div className="h-96 rounded-xl bg-secondary/20 animate-pulse" />
          </div>
        ) : trips.length === 0 ? (
          <p className="font-sans text-lg text-black/70 py-12">
            {t('floatsSection.empty')}
          </p>
        ) : (
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label htmlFor="float-select" className="font-sans font-medium text-black shrink-0">
                {t('floatsSection.selectTrip')}:
              </label>
              <select
                id="float-select"
                value={selectedSlug ?? ''}
                onChange={(e) => setSelectedSlug(e.target.value || null)}
                className="font-sans px-4 py-2.5 rounded-lg border-2 border-secondary/30 bg-white text-black focus:border-primary focus:outline-none min-w-[200px]"
              >
                {trips.map((trip) => (
                  <option key={trip.slug} value={trip.slug}>
                    {trip.title} — {trip.distance_km} км
                  </option>
                ))}
              </select>
            </div>

            {selectedTrip && (
              <>
                <div className="p-6 rounded-xl border border-secondary/20 bg-white shadow-sm">
                  <h2 className="font-serif text-xl md:text-2xl font-medium text-primary">
                    {selectedTrip.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-4 font-sans text-sm text-black/70">
                    <span>{selectedTrip.distance_km} {t('floatsSection.km')}</span>
                    <span>
                      {t('floatsSection.priceFrom')} {selectedTrip.price_per_person} {t('floatsSection.byr')} / {t('floatsSection.perPerson')}
                    </span>
                  </div>
                  {selectedTrip.description && (
                    <p className="mt-4 font-sans text-black/80 leading-relaxed whitespace-pre-line">
                      {selectedTrip.description}
                    </p>
                  )}
                  <Link
                    href={`/${locale}/floats/${selectedTrip.slug}`}
                    className="mt-4 inline-block font-sans text-sm font-semibold text-primary hover:underline"
                  >
                    {t('floatsSection.more')} →
                  </Link>
                </div>

                {selectedTrip.map_embed_url && (
                  <div className="rounded-xl overflow-hidden border border-secondary/20 bg-secondary/10" style={{ height: 400 }}>
                    <iframe
                      src={selectedTrip.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={selectedTrip.title}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
