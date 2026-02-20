'use client'

import React, { createContext, useContext } from 'react'
import type { Locale } from '@/lib/i18n'
import type { ServiceItem, NewsItem, PromoItem, PortfolioItem } from '@/lib/api'

type LocaleContextValue = {
  locale: Locale
  services: ServiceItem[]
  news: NewsItem[]
  promos: PromoItem[]
  portfolio: PortfolioItem[]
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  initialServices,
  initialNews,
  initialPromos,
  initialPortfolio,
  children,
}: {
  locale: Locale
  initialServices: ServiceItem[]
  initialNews: NewsItem[]
  initialPromos: PromoItem[]
  initialPortfolio: PortfolioItem[]
  children: React.ReactNode
}) {
  return (
    <LocaleContext.Provider
      value={{
        locale,
        services: initialServices,
        news: initialNews,
        promos: initialPromos,
        portfolio: initialPortfolio,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx.locale
}

export function useServices(): ServiceItem[] {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useServices must be used within LocaleProvider')
  return ctx.services
}

export function useNews(): NewsItem[] {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useNews must be used within LocaleProvider')
  return ctx.news
}

export function usePromos(): PromoItem[] {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('usePromos must be used within LocaleProvider')
  return ctx.promos
}

export function usePortfolio(): PortfolioItem[] {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('usePortfolio must be used within LocaleProvider')
  return ctx.portfolio
}
