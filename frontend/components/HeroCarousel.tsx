'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

const SLIDES = [
  { titleKey: 'hero.slide1Title', subtitleKey: 'hero.slide1Subtitle' },
  { titleKey: 'hero.slide2Title', subtitleKey: 'hero.slide2Subtitle' },
  { titleKey: 'hero.slide3Title', subtitleKey: 'hero.slide3Subtitle' },
]

export function HeroCarousel() {
  const t = useTranslations()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/60 via-white to-secondary/40 pt-24 pb-20">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'linear-gradient(120deg, var(--primary) 0%, transparent 50%, var(--secondary) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <p className="font-sans text-base md:text-lg tracking-[0.2em] uppercase text-black/80 mb-6">
          {t('hero.badge')}
        </p>
        <div className="min-h-[4.5rem] md:min-h-[5.5rem] relative">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-x-0 transition-opacity duration-700 ${
                i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={i !== active}
            >
              <h1 className="font-serif-legacy text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-black leading-[1.2] tracking-tight">
                {t(slide.titleKey)}
                <br />
                <span className="text-black/90">{t(slide.subtitleKey)}</span>
              </h1>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === active ? 'bg-primary' : 'bg-black/20 hover:bg-black/40'
              }`}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
