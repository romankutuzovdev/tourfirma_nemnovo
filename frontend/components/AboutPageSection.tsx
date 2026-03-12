'use client'

import { useTranslations } from 'next-intl'
import type { AboutPageContent } from '@/lib/api'

type Props = { content?: AboutPageContent | null }

/** Блок «О нас» на странице /about. Внешне как на главной, но контент из отдельной модели в админке. */
export function AboutPageSection({ content }: Props) {
  const t = useTranslations()

  const title = content?.title || t('aboutPage.title')
  const paragraphs = content?.paragraphs?.length
    ? content.paragraphs
    : [t('aboutPage.p1'), t('aboutPage.p2')]

  return (
    <section id="about" className="pt-12 md:pt-16 pb-8 md:pb-10 bg-primary border-y border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-white tracking-tight">{title}</h2>
          </div>
          <div className="font-sans text-white leading-relaxed space-y-4">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </div>
    </section>
  )
}
