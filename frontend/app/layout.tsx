import React from 'react'
import type { Metadata } from 'next'
import { PT_Serif } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import './globals.css'

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-pt-serif',
  display: 'swap',
})
import { setRequestLocale } from 'next-intl/server'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { HotOfferPopup } from '@/components/HotOfferPopup'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import type { Locale } from '@/lib/i18n'
import { LocaleSetter } from '@/components/LocaleSetter'
import { fetchServices, fetchNews, fetchPromos, fetchPortfolio } from '@/lib/api'

type Props = { children: React.ReactNode }

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Немново — Близкая. Незнакомая. Беларусь.',
  description: 'Турфирма. Мы сделаем активный отдых незабываемым! Услуги, фотоотчёты, экскурсии.',
}

export default async function RootLayout({ children }: Props) {
  const loc: Locale = 'ru'
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
    <html lang="ru" className={ptSerif.variable}>
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">
    <NextIntlClientProvider key={loc} locale={loc} messages={messages}>
      <LocaleProvider
        locale={loc}
        initialServices={initialServices}
        initialNews={initialNews}
        initialPromos={initialPromos}
        initialPortfolio={initialPortfolio}
      >
        <AuthProvider>
        <LocaleSetter locale={loc} />
        <Header />
        {/* Spacer под фиксированный хедер */}
        <div className="shrink-0 header-spacer h-[6.25rem] sm:h-[6.75rem] md:h-[7rem] lg:h-[7.75rem]" aria-hidden />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <HotOfferPopup />
        </AuthProvider>
      </LocaleProvider>
    </NextIntlClientProvider>
      </body>
    </html>
  )
}
