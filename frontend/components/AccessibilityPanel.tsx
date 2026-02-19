'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export function AccessibilityPanel() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)

  const changeFont = (delta: number) => {
    setFontSize((s) => Math.max(80, Math.min(140, s + delta)))
    document.documentElement.style.fontSize = `${Math.max(80, Math.min(140, fontSize + delta))}%`
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-secondary/80 text-black flex items-center justify-center shadow-lg hover:bg-secondary"
        aria-label={t('accessibility.panelTitle')}
      >
        <span className="text-lg" aria-hidden>♿</span>
      </button>
      {open && (
        <div className="fixed bottom-36 right-6 z-40 p-4 bg-white border border-secondary/20 rounded-lg shadow-xl flex flex-col gap-2 min-w-[180px]">
          <p className="font-sans text-sm font-semibold text-black">{t('accessibility.panelTitle')}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => changeFont(-10)} className="px-2 py-1 text-sm border rounded">A-</button>
            <span className="text-xs">{fontSize}%</span>
            <button type="button" onClick={() => changeFont(10)} className="px-2 py-1 text-sm border rounded">A+</button>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="text-xs text-black/70">Закрыть</button>
        </div>
      )}
    </>
  )
}
