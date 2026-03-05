'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { fetchFloatTrips, getFloatImageSrc, type FloatTripItem } from '@/lib/api'

export default function FloatsPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-primary/20">
      <header className="pt-48 md:pt-44 pb-6 md:pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={'/'}
          className="lg:hidden inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black transition-colors mb-6"
        >
          ← {t('nav.home')}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-primary tracking-tight max-w-2xl">
          {t('floatsSection.title')}
        </h1>
      </header>

      <section className="pt-6 md:pt-10 pb-16 md:pb-24 max-w-6xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-lg bg-secondary/20 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <p className="font-sans text-lg text-black/70 py-12">
            {t('floatsSection.empty')}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-white tracking-tight line-clamp-2">
                      {trip.title}
                    </h2>
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
        )}
      </section>
    </div>
  )
}
