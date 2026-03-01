'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

const FAQ_IDS = ['sup', 'firstTime', 'fall', 'children'] as const

export function FAQSection() {
  const t = useTranslations('faq')
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section id="faq" className="scroll-mt-24 pt-12 md:pt-16 pb-12 md:pb-16 bg-[#f8bd69]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="font-sans text-xl md:text-2xl font-semibold tracking-wide text-white uppercase">
          {t('title')}
        </h2>
        <div className="mt-8 divide-y divide-white/30">
          {FAQ_IDS.map((id) => {
            const isOpen = openId === id
            return (
              <div key={id} className="py-4 first:pt-0 first:pb-4">
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  className="w-full flex items-center justify-between gap-4 text-left group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${id}`}
                  id={`faq-question-${id}`}
                >
                  <span className="font-sans text-base md:text-lg font-medium text-white uppercase group-hover:text-white/80">
                    {t(`items.${id}.question`)}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 border-white/50 text-white transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                    aria-hidden
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${id}`}
                  role="region"
                  aria-labelledby={`faq-question-${id}`}
                  className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="pt-3 font-sans text-base text-white/80 leading-relaxed">
                    {t(`items.${id}.answer`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
