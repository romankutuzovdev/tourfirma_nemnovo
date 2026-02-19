'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'

export function ChatBotPlaceholder() {
  const locale = useLocale()
  const t = useTranslations()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-lg hover:bg-primary/90"
        aria-label={t('chat.label') || 'Чат'}
      >
        <span className="text-2xl" aria-hidden>💬</span>
      </button>
      {open && (
        <div className="fixed bottom-24 left-6 z-40 w-72 p-4 bg-white border border-secondary/20 rounded-xl shadow-xl">
          <p className="font-sans text-sm text-black/80 mb-3">{t('chat.placeholder') || 'Чат в разработке. Напишите нам через форму контактов.'}</p>
          <Link
            href={`/${locale}/contact`}
            onClick={() => setOpen(false)}
            className="inline-block px-4 py-2 rounded-lg bg-primary text-black font-sans font-semibold text-sm hover:bg-primary/90"
          >
            {t('nav.contact')}
          </Link>
        </div>
      )}
    </>
  )
}
