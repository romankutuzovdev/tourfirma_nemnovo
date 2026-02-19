import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { fetchServiceDetail } from '@/lib/api'
import { isValidLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) return {}
  const service = await fetchServiceDetail(slug, locale as Locale)
  if (!service) return {}
  return { title: `${service.title} — НемновоТур` }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isValidLocale(locale)) notFound()
  const loc = locale as Locale
  const service = await fetchServiceDetail(slug, loc)
  if (!service) notFound()

  const t = await getTranslations()

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
        <Link href={`/${loc}/services`} className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-8">
          ← {t('servicesSection.allServices')}
        </Link>

        {service.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8 bg-secondary/30">
            <Image src={service.image} alt={service.title} fill className="object-cover" priority />
          </div>
        )}

        <h1 className="font-serif text-4xl font-medium text-black tracking-tight">{service.title}</h1>
        {service.price != null && service.price > 0 && (
          <p className="mt-4 font-sans text-lg font-semibold text-primary">
            {t('servicesSection.from')} {service.price} BYN
          </p>
        )}

        {service.excerpt && <p className="mt-6 font-sans text-lg text-black/80">{service.excerpt}</p>}

        {service.long_desc && (
          <div
            className="mt-8 font-sans text-black/90 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: service.long_desc }}
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
