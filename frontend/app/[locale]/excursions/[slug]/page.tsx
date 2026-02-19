import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { fetchExcursionDetail } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}
  const excursion = await fetchExcursionDetail(slug, locale as Locale)
  if (!excursion) return {}
  return { title: `${excursion.title} — НемновоТур` }
}

export default async function ExcursionDetailPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  const loc = locale as Locale
  const excursion = await fetchExcursionDetail(slug, loc)
  if (!excursion) notFound()

  const t = await getTranslations()

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
        <Link href={`/${loc}/excursions`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-8">
          ← {t('excursions.badge')}
        </Link>

        {excursion.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-secondary/30">
            <Image src={excursion.image} alt={excursion.title} fill className="object-cover" priority />
          </div>
        )}

        <h1 className="font-serif text-4xl font-medium text-black tracking-tight">{excursion.title}</h1>

        {excursion.short_desc && <p className="mt-6 font-sans text-lg text-black/80">{excursion.short_desc}</p>}

        {excursion.long_desc && (
          <div
            className="mt-8 font-sans text-black/90 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: excursion.long_desc }}
          />
        )}

        <div className="mt-12 p-6 bg-primary/10 rounded-xl border border-primary/20">
          <p className="font-sans text-black/90">{t('excursions.cta')}</p>
          <Link
            href={`/${loc}/contact`}
            className="inline-block mt-4 px-6 py-3 bg-primary text-black font-sans font-semibold hover:bg-primary/90 transition-colors rounded"
          >
            {t('excursions.ctaButton')}
          </Link>
        </div>
      </div>
    </div>
  )
}
