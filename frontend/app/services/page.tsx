'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useServicesTree } from '@/contexts/LocaleContext'
import { getServiceImageSrc, type ServiceItem } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'

export default function ServicesPage() {
  const t = useTranslations()
  const servicesTree = useServicesTree()

  return (
    <div className="min-h-screen bg-primary">
      <header className="pt-6 md:pt-8 pb-6 md:pb-8 max-w-6xl mx-auto px-4 sm:px-6">
        <Link
          href={'/'}
          className="inline-flex items-center gap-2 font-sans text-sm text-white/80 hover:text-white transition-colors mb-4"
        >
          ← {t('nav.home')}
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-white tracking-tight max-w-2xl">
          {t('servicesSection.title')}
        </h1>
      </header>
      <section className="pt-6 md:pt-10 pb-16 md:pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {servicesTree.map((item) => <ServiceCard key={item.slug} item={item} moreLabel={t('servicesSection.more')} />)}
          </div>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({ item, moreLabel }: { item: ServiceItem; moreLabel: string }) {
  const [quantityInput, setQuantityInput] = useState('1')
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const price = item.price ? Number(item.price) : null
  const showServicePrice = !item.has_variants && price !== null

  function handleAdd() {
    const quantity = Math.max(1, Number(quantityInput) || 1)
    addItem({ itemType: 'service', slug: item.slug, title: item.title, price: price as number }, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <div className="min-w-0">
      <Link
        href={`/services/${item.slug}`}
        className="group relative block aspect-square w-full rounded-lg overflow-hidden border border-secondary/30 bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        <Image
          src={getServiceImageSrc(item)}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
          <h2 className="font-serif text-lg sm:text-xl font-medium text-white tracking-tight line-clamp-2">{item.title}</h2>
          <p className="mt-1.5 font-sans text-xs text-white/90 leading-snug line-clamp-2">{item.short_desc}</p>
          <span className="mt-3 font-sans text-xs sm:text-sm text-white/80 group-hover:text-white transition-colors">{moreLabel}</span>
        </div>
      </Link>
      {item.has_variants ? (
        <div className="mt-3">
          <p className="font-sans text-sm text-white/80">Цена по вариантам</p>
        </div>
      ) : showServicePrice ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-serif text-lg text-white">{price.toFixed(2)} BYN</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantityInput}
              onChange={(e) => {
                const next = e.target.value
                if (next === '' || /^\d+$/.test(next)) setQuantityInput(next)
              }}
              onBlur={() => {
                if (!quantityInput || Number(quantityInput) < 1) setQuantityInput('1')
              }}
              className="w-14 border border-secondary/30 bg-white/10 text-white px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={handleAdd}
              className={`px-3 py-1.5 text-xs transition-all duration-300 ${
                added ? 'bg-green-500 text-white scale-105 shadow-md shadow-green-600/40' : 'bg-white text-primary hover:bg-white/90'
              }`}
            >
              {added ? 'Добавлено' : 'В корзину'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
