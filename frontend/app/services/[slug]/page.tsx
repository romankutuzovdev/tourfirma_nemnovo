import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { fetchServiceBySlug, fetchServices, getServiceImageSrc } from '@/lib/api'
import { ServiceDescription } from '@/components/ServiceDescription'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await fetchServiceBySlug(slug, 'ru')
  if (!service) return { title: 'Услуга не найдена' }
  return { title: `${service.title} — Немново`, description: service.short_desc }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params

  const [service, servicesList] = await Promise.all([
    fetchServiceBySlug(slug, 'ru'),
    fetchServices('ru') as Promise<import('@/lib/api').ServiceItem[]>,
  ])
  if (!service) notFound()

  const t = await getTranslations()
  const hasChildren = service.children && service.children.length > 0
  const children = service.children ?? []
  const serviceTitle = service.title
  const serviceShortDesc = service.short_desc
  const imageSrc = getServiceImageSrc(service)

  if (hasChildren) {
    return (
      <div className="pt-24 md:pt-20 pb-16 md:pb-16 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="inline-flex items-center gap-2 font-sans text-sm text-black/80 mb-4" aria-label="Breadcrumb">
            <Link href="/services" className="hover:text-black">
              ← {t('common.allServices')}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-black">{serviceTitle}</span>
          </nav>

          <article className="pt-4">
            <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
              <Image
                src={imageSrc}
                alt={serviceTitle}
                fill
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                priority
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                  {serviceTitle}
                </h1>
              </div>
            </div>

            {serviceShortDesc && (
              <p className="mt-8 font-sans text-base text-black/90 leading-relaxed">
                {serviceShortDesc}
              </p>
            )}

            <div className="mt-12">
              <h2 className="font-serif text-xl font-medium text-black/90 mb-6">
                {t('servicesSection.inSection')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {children.map((item) => (
                  <div key={item.slug} className="min-w-0">
                    <Link
                      href={`/services/${item.slug}`}
                      className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/20 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:border-secondary/40"
                    >
                      <Image
                        src={getServiceImageSrc(item)}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="mt-1 font-sans text-sm text-white/90 leading-snug line-clamp-2">
                          {item.short_desc}
                        </p>
                        <span className="mt-2 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                          {t('servicesSection.more')}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 md:pt-20 pb-16 md:pb-16 min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 font-sans text-sm text-black/80 hover:text-black mb-4"
        >
          ← {t('common.allServices')}
        </Link>

        <article className="pt-4">
          <div className="relative aspect-[16/10] md:aspect-[21/9] rounded-xl overflow-hidden bg-primary">
            <Image
              src={imageSrc}
              alt={serviceTitle}
              fill
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              priority
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight">
                {serviceTitle}
              </h1>
            </div>
          </div>

          <p className="mt-8 font-sans text-sm text-black/90 leading-relaxed">
            {serviceShortDesc}
          </p>

          {service.long_desc && <ServiceDescription text={service.long_desc} />}
        </article>

        <div className="mt-20 pt-16 border-t border-secondary/20">
          <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-8">
            {t('common.otherServices')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {servicesList
              .filter((item) => item.slug !== slug)
              .map((item) => (
                <div key={item.slug} className="min-w-0">
                  <Link
                    href={`/services/${item.slug}`}
                    className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/20 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:border-secondary/40"
                  >
                    <Image
                      src={getServiceImageSrc(item)}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end">
                      <h3 className="font-serif text-base sm:text-lg font-medium text-white tracking-tight line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-sans text-xs text-white/90 leading-snug line-clamp-2">
                        {item.short_desc}
                      </p>
                      <span className="mt-2 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">
                        {t('servicesSection.more')}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
