'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { AnimateOnScroll } from './AnimateOnScroll'

type Props = { images: string[] }

/** Галерея фото на странице «О нас». */
export function AboutPhotosSection({ images }: Props) {
  const t = useTranslations('aboutPage')

  if (!images?.length) return null

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimateOnScroll variant="fade-up">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-primary tracking-tight">
            {t('photosTitle')}
          </h2>
        </AnimateOnScroll>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {images.map((src, i) => (
            <AnimateOnScroll key={i} variant="scale" delay={i * 40}>
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-secondary/20 bg-secondary/10">
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
