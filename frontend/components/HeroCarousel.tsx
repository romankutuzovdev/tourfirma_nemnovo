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
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/60 via-white to-secondary/40 py-24 md:py-32">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'linear-gradient(120deg, var(--primary) 0%, transparent 50%, var(--secondary) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 15s ease infinite',
        }}
      />
      <div className="w-full max-w-[100vw] px-6 md:px-12 lg:px-16 text-center relative flex-1 flex flex-col justify-center">
        <p className="font-sans text-sm md:text-base tracking-[0.25em] uppercase text-black/70 mb-8 md:mb-12">
          {t('hero.badge')}
        </p>
        <div className="min-h-[6rem] md:min-h-[8rem] lg:min-h-[10rem] relative flex items-center justify-center">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                i === active ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={i !== active}
            >
              <h1 className="font-serif-legacy text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-black leading-[1.15] tracking-tight max-w-[90vw]">
                {t(slide.titleKey)}
                <br />
                <span className="text-black/90">{t(slide.subtitleKey)}</span>
              </h1>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
