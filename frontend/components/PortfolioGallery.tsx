'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { getPortfolioDownloadUrl } from '@/lib/api'

type Props = {
  images: string[]
  title: string
  slug: string
  photosLabel: string
  buttonLabel: string
  backLabel: string
}

export function PortfolioGallery({ images, title, slug, photosLabel, buttonLabel, backLabel }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') setLightboxIndex((i) => Math.max(0, i - 1))
      else if (e.key === 'ArrowRight') setLightboxIndex((i) => Math.min(images.length - 1, i + 1))
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, images.length, close])

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openLightbox(i)}
            className="relative block aspect-square w-full rounded-lg overflow-hidden bg-secondary/30 border border-secondary/10 hover:border-primary/40 transition-colors group text-left"
          >
            <Image
              src={url}
              alt={`${title} — ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white font-sans text-xs rounded">
              {i + 1} / {images.length}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Link
          href={getPortfolioDownloadUrl(slug)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-sans text-sm font-medium hover:bg-primary/90 transition-colors rounded"
          download
        >
          {buttonLabel}
        </Link>
        <span className="font-sans text-sm text-black/60">
          {images.length} {photosLabel}
        </span>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Закрыть"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={images[lightboxIndex]}
              alt={`${title} — ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => Math.max(0, i - 1)) }}
                disabled={lightboxIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
                aria-label="Предыдущее"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => Math.min(images.length - 1, i + 1)) }}
                disabled={lightboxIndex === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none text-white transition-colors"
                aria-label="Следующее"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white font-sans text-sm rounded">
                {lightboxIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}
    </>
  )
}
