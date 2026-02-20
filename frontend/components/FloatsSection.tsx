'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { fetchFloatTrips, fetchFloatTripBySlug, type FloatTripItem, type FloatTripDetail } from '@/lib/api'

export function FloatsSection() {
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
    <section id="floats" className="scroll-mt-24 pt-12 md:pt-16 pb-12 md:pb-16 bg-secondary/40 border-t border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="section-title-main text-primary">{t('floatsSection.title')}</h2>
        <p className="mt-2 font-sans text-black/70">{t('floatsSection.description')}</p>

        {loading ? (
          <div className="mt-8 space-y-6">
            <div className="h-12 w-64 bg-secondary/20 rounded animate-pulse" />
            <div className="h-80 rounded-xl bg-secondary/20 animate-pulse" />
          </div>
        ) : trips.length === 0 ? (
          <p className="mt-8 font-sans text-lg text-black/70 py-8">
            {t('floatsSection.empty')}
          </p>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label htmlFor="float-select-home" className="font-sans font-medium text-black shrink-0">
                {t('floatsSection.selectTrip')}:
              </label>
              <select
                id="float-select-home"
                value={selectedSlug ?? ''}
                onChange={(e) => setSelectedSlug(e.target.value || null)}
                className="font-sans px-4 py-2.5 rounded-lg border-2 border-primary/40 bg-white text-black focus:border-primary focus:outline-none min-w-[200px]"
              >
                {trips.map((trip) => (
                  <option key={trip.slug} value={trip.slug}>
                    {trip.title} — {trip.distance_km} км
                  </option>
                ))}
              </select>
            </div>

            {selectedTrip && (
              <div className="rounded-xl overflow-hidden border border-secondary/20 bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="font-serif text-xl md:text-2xl font-medium text-primary">
                    {selectedTrip.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 font-sans text-sm text-black/70">
                    <span>{selectedTrip.distance_km} {t('floatsSection.km')}</span>
                    <span>
                      {t('floatsSection.priceFrom')} {selectedTrip.price_per_person} {t('floatsSection.byr')} / {t('floatsSection.perPerson')}
                    </span>
                  </div>
                  {selectedTrip.description && (
                    <p className="mt-4 font-sans text-black/80 leading-relaxed line-clamp-3">
                      {selectedTrip.description}
                    </p>
                  )}
                </div>
                {selectedTrip.map_embed_url && (
                  <div className="h-72 sm:h-80" style={{ minHeight: 288 }}>
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
                <div className="p-6 pt-4">
                  <Link
                    href={`/${locale}/floats`}
                    className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-sans text-sm font-semibold tracking-wide hover:bg-primary hover:text-white transition-colors rounded-lg"
                  >
                    {t('floatsSection.allTrips')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
