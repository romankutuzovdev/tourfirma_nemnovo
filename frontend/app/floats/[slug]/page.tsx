'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { fetchFloatTripBySlug, fetchFloatTrips, getFloatImageSrc } from '@/lib/api'
import { FloatDescription } from '@/components/FloatDescription'
import type { FloatTripDetail, FloatTripItem } from '@/lib/api'

export default function FloatDetailPage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const locale = 'ru'
  const t = useTranslations()
  const [trip, setTrip] = useState<FloatTripDetail | null>(null)
  const [trips, setTrips] = useState<FloatTripItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    Promise.all([
      fetchFloatTripBySlug(slug, locale),
      fetchFloatTrips(locale),
    ]).then(([tripData, tripsData]) => {
      setTrip(tripData)
      setTrips(tripsData || [])
      setNotFound(!tripData)
      setLoading(false)
    })
  }, [slug, locale])

  if (loading) {
    return (
      <div className="pt-40 md:pt-44 pb-16 min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="h-8 w-48 bg-secondary/20 rounded animate-pulse" />
          <div className="mt-8 aspect-[16/10] rounded-xl bg-secondary/20 animate-pulse" />
        </div>
      </div>
    )
  }

  if (notFound || !trip) {
    return (
      <div className="min-h-screen pt-52 md:pt-40 pb-16 flex flex-col items-center justify-center">
        <p className="font-sans text-lg text-black/70">{t('floatsSection.notFound')}</p>
        <Link href="/floats" className="mt-4 font-sans text-primary hover:underline">
          {t('floatsSection.backToList')}
        </Link>
      </div>
    )
  }

  const hasMap = !!trip.map_embed_url?.trim()
  const imageSrc = getFloatImageSrc(trip)

  return (
    <div className="pt-40 md:pt-44 pb-16 md:pb-16 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/floats"
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-10"
        >
          ← {t('floatsSection.backToList')}
        </Link>

        <article className="pt-16">
          <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={trip.title}
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-primary" aria-hidden />
            )}
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                {trip.title}
              </h1>
              <div className="mt-2 flex flex-wrap gap-4 font-sans text-base text-white/90">
                <span>
                  {trip.distance_km} {t('floatsSection.km')}
                </span>
                <span>
                  {t('floatsSection.priceFrom')} {trip.price_per_person} {t('floatsSection.byr')} / {t('floatsSection.perPerson')}
                </span>
              </div>
            </div>
          </div>

          {trip.description && (
            <div className="mt-8">
              <FloatDescription text={trip.description} />
            </div>
          )}

          {hasMap && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-medium text-black mb-4">
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

        <div className="mt-20 pt-16 border-t border-secondary/20">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-8">
            {t('common.otherFloats')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {trips.filter((item) => item.slug !== slug).map((item) => (
              <div key={item.slug} className="min-w-0">
                <Link
                  href={`/floats/${item.slug}`}
                  className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/20 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:border-secondary/40"
                >
                  {getFloatImageSrc(item) ? (
                    <Image
                      src={getFloatImageSrc(item)!}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary" aria-hidden />
                  )}
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                    <h3 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-white/90 leading-snug">
                      {item.distance_km} {t('floatsSection.km')} · {t('floatsSection.priceFrom')} {item.price_per_person} {t('floatsSection.byr')} / {t('floatsSection.perPerson')}
                    </p>
                    <span className="mt-2 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                      {t('floatsSection.more')}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/floats"
              className="inline-flex font-sans text-sm text-black/80 hover:text-black"
            >
              {t('common.toFloatsPage')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
