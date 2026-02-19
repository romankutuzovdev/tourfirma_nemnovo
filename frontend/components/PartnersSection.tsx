'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

type Partner = { name?: string; logo?: string; url?: string }

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export function PartnersSection() {
  const t = useTranslations()
  const [partners, setPartners] = useState<Partner[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/partners/`)
      .then((r) => r.ok ? r.json() : [])
      .then(setPartners)
      .catch(() => setPartners([]))
  }, [])

  if (partners.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif-legacy text-3xl font-semibold text-black mb-6">
          {t('partners.title') || 'С кем мы сотрудничаем'}
        </h2>
        <div className="flex flex-wrap gap-8 items-center justify-center">
          {partners.map((p, i) => (
            <a
              key={i}
              href={p.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              {p.logo ? (
                <img src={p.logo} alt={p.name || ''} className="h-12 object-contain" />
              ) : (
                <span className="font-sans font-semibold text-black/80">{p.name}</span>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
