'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { fetchFloatTrips, getFloatImageSrc, type FloatTripItem } from '@/lib/api'

export function FloatsSection() {
  const locale = 'ru'
  const t = useTranslations()
  const [trips, setTrips] = useState<FloatTripItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFloatTrips(locale).then((data) => {
      setTrips(data)
      setLoading(false)
    })
  }, [locale])

  return (
    <section id="floats" className="scroll-mt-24 pt-12 md:pt-16 pb-12 md:pb-16 bg-white border-t border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="section-title-main text-primary">{t('floatsSection.title')}</h2>

        {loading ? (
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary/20 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <p className="mt-8 font-sans text-lg text-black/70 py-8">
            {t('floatsSection.empty')}
          </p>
        ) : (
          <>
            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {trips.map((trip) => (
                <div key={trip.slug} className="min-w-0">
                  <Link
                    href={`/floats/${trip.slug}`}
                    className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    {getFloatImageSrc(trip) ? (
                      <Image
                        src={getFloatImageSrc(trip)!}
                        alt={trip.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary" aria-hidden />
                    )}
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-2">
                        {trip.title}
                      </h3>
                      <p className="mt-1.5 font-sans text-sm text-white/90 leading-snug">
                        {trip.distance_km} {t('floatsSection.km')} · {t('floatsSection.priceFrom')} {trip.price_per_person} {t('floatsSection.byr')} / {t('floatsSection.perPerson')}
                      </p>
                      <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                        {t('floatsSection.more')}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/floats"
                className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-sans text-sm font-semibold tracking-wide hover:bg-primary hover:text-white transition-colors rounded-lg"
              >
                {t('floatsSection.allTrips')}
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
