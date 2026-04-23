import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchPromoBySlug, getPromoImageSrc } from '@/lib/api'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const promo = await fetchPromoBySlug(slug, 'ru')
  if (!promo) return { title: 'Акция не найдена' }
  return { title: `${promo.title} — Немново`, description: promo.short_desc }
}

export default async function PromoPage({ params }: Props) {
  const { slug } = await params

  const promo = await fetchPromoBySlug(slug, 'ru')
  if (!promo) notFound()

  const t = await getTranslations()
  const imageSrc = getPromoImageSrc(promo)
  const hasImage = Boolean(imageSrc)

  return (
    <div className="pt-6 md:pt-8 pb-16 md:pb-16 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href="/promos"
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-4"
        >
          ← Все акции
        </Link>

        <article className="mt-4 bg-secondary/30 border border-secondary/10 rounded-sm overflow-hidden max-w-3xl mx-auto">
          {hasImage && (
            <div className="relative aspect-[21/9] w-full">
              <Image
                src={imageSrc}
                alt={promo.title}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="pt-4 sm:pt-6 md:pt-10 pb-4 sm:pb-6 md:pb-10 text-center">
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium text-black tracking-tight">
              {promo.title}
            </h1>
            {promo.short_desc && (
              <p className="mt-6 font-sans text-base italic text-black/80 leading-relaxed whitespace-pre-line break-words min-w-0">
                {promo.short_desc}
              </p>
            )}
            {promo.long_desc && (
              <p className="mt-4 font-sans text-base text-black/80 leading-relaxed whitespace-pre-line break-words min-w-0">
                {promo.long_desc}
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}
