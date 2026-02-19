'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export function SiteSearch() {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!query.trim()) return
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
      setQuery('')
    },
    [locale, query, router]
  )

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder') || 'Поиск...'}
          className="w-32 sm:w-40 px-2 py-1.5 text-sm border border-secondary/30 rounded-l focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={t('search.placeholder') || 'Поиск'}
        />
        <button
          type="submit"
          className="px-2 py-1.5 bg-secondary/30 rounded-r text-black/80 hover:bg-secondary/50"
          aria-label={t('search.submit') || 'Искать'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </form>
    </div>
  )
}
