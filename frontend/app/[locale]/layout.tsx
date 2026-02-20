import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { HotOfferPopup } from '@/components/HotOfferPopup'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { isValidLocale, type Locale } from '@/lib/i18n'
import { LocaleSetter } from '@/components/LocaleSetter'
import { fetchServices, fetchNews, fetchPromos, fetchPortfolio } from '@/lib/api'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'be' }, { locale: 'en' }, { locale: 'pl' }, { locale: 'zh' }]
}

export const metadata: Metadata = {
  title: 'Немново — Близкая. Незнакомая. Беларусь.',
  description: 'Турфирма. Мы сделаем активный отдых незабываемым! Услуги, фотоотчёты, экскурсии.',
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  const loc = locale as Locale
  setRequestLocale(loc)

  let initialServices: Awaited<ReturnType<typeof fetchServices>> = []
  let initialNews: Awaited<ReturnType<typeof fetchNews>> = []
  let initialPromos: Awaited<ReturnType<typeof fetchPromos>> = []
  let initialPortfolio: Awaited<ReturnType<typeof fetchPortfolio>> = []
  try {
    const [services, news, promos, portfolio] = await Promise.all([
      fetchServices(loc),
      fetchNews(loc),
      fetchPromos(loc),
      fetchPortfolio(loc),
    ])
    initialServices = services
    initialNews = news
    initialPromos = promos
    initialPortfolio = portfolio
  } catch {
    // leave empty
  }

  const messages = (await import(`@/locales/${loc}/common.json`)).default

  return (
    <NextIntlClientProvider key={loc} locale={loc} messages={messages}>
      <LocaleProvider
        locale={loc}
        initialServices={initialServices}
        initialNews={initialNews}
        initialPromos={initialPromos}
        initialPortfolio={initialPortfolio}
      >
        <AuthProvider>
        <LocaleSetter locale={locale} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <HotOfferPopup />
        </AuthProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
  )
}
