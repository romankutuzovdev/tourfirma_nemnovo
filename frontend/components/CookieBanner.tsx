'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

const COOKIE_KEY = 'nemnovo_cookie_consent'

export function CookieBanner() {
  const locale = useLocale()
  const t = useTranslations()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const accepted = localStorage.getItem(COOKIE_KEY)
    if (!accepted) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 text-white p-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
      <p className="font-sans text-sm text-center sm:text-left">
        {t('cookie.text')}{' '}
        <Link href={`/${locale}/privacy`} className="underline hover:no-underline">{t('cookie.link')}</Link>
      </p>
      <button
        type="button"
        onClick={accept}
        className="shrink-0 px-4 py-2 rounded-lg bg-primary text-black font-sans font-semibold hover:bg-primary/90"
      >
        {t('cookie.accept')}
      </button>
    </div>
  )
}
