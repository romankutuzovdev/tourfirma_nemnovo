'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

const POPUP_KEY = 'nemnovo_hotoffer_dismissed'

export function HotOfferPopup() {
  const locale = useLocale()
  const t = useTranslations()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const dismissed = sessionStorage.getItem(POPUP_KEY)
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    if (typeof window !== 'undefined') sessionStorage.setItem(POPUP_KEY, '1')
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm p-4 bg-white border border-secondary/20 rounded-xl shadow-xl">
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-2 right-2 text-black/50 hover:text-black text-lg"
        aria-label="Закрыть"
      >
        ×
      </button>
      <p className="font-sans font-semibold text-black mb-2">{t('promos.badge') || 'Горящее предложение'}</p>
      <p className="font-sans text-sm text-black/80 mb-3">{t('promos.popupText') || 'Специальные условия на экскурсии!'}</p>
      <Link
        href={`/${locale}/promos`}
        onClick={dismiss}
        className="inline-block px-4 py-2 rounded-lg bg-primary text-black font-sans font-semibold text-sm hover:bg-primary/90"
      >
        {t('promos.cta') || 'Смотреть'}
      </Link>
    </div>
  )
}
