'use client'

import React, { createContext, useContext } from 'react'
import type { Locale } from '@/lib/i18n'
import type { ServiceItem, PromoItem, PortfolioItem, ExcursionItem } from '@/lib/api'

type LocaleContextValue = {
  locale: Locale
  services: ServiceItem[]
  promos: PromoItem[]
  portfolio: PortfolioItem[]
  excursions: ExcursionItem[]
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  locale,
  initialServices,
  initialPromos,
  initialPortfolio,
  initialExcursions,
  children,
}: {
  locale: Locale
  initialServices: ServiceItem[]
  initialPromos: PromoItem[]
  initialPortfolio: PortfolioItem[]
  initialExcursions: ExcursionItem[]
  children: React.ReactNode
}) {
  return (
    <LocaleContext.Provider
      value={{
        locale,
        services: initialServices,
        promos: initialPromos,
        portfolio: initialPortfolio,
        excursions: initialExcursions,
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
  if (!ctx) return []
  return ctx.services
}

export function usePromos(): PromoItem[] {
  const ctx = useContext(LocaleContext)
  if (!ctx) return []
  return ctx.promos
}

export function usePortfolio(): PortfolioItem[] {
  const ctx = useContext(LocaleContext)
  if (!ctx) return []
  return ctx.portfolio
}

export function useExcursions(): ExcursionItem[] {
  const ctx = useContext(LocaleContext)
  if (!ctx) return []
  return ctx.excursions
}
