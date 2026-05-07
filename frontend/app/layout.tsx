import React from 'react'
import type { Metadata } from 'next'
import { PT_Serif } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const ptSerif = PT_Serif({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-pt-serif',
  display: 'swap',
})

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import { HotOfferPopup } from '@/components/HotOfferPopup'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { LocaleSetter } from '@/components/LocaleSetter'
import type { Locale } from '@/lib/i18n'
import { fetchServicesTree, flattenServiceTree, fetchNews, fetchPromos, fetchPortfolio } from '@/lib/api'

type Props = { children: React.ReactNode }

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Немново — Близкая. Незнакомая. Беларусь.',
    template: '%s | Немново Тур',
  },
  description: 'Турфирма. Мы сделаем активный отдых незабываемым! Услуги, фотоотчёты, экскурсии.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({ children }: Props) {
  const locale: Locale = 'ru'

  let initialServices: Awaited<ReturnType<typeof flattenServiceTree>> = []
  let initialServicesTree: Awaited<ReturnType<typeof fetchServicesTree>> = []
  let initialNews: Awaited<ReturnType<typeof fetchNews>> = []
  let initialPromos: Awaited<ReturnType<typeof fetchPromos>> = []
  let initialPortfolio: Awaited<ReturnType<typeof fetchPortfolio>> = []
  try {
    const [servicesTree, news, promos, portfolio] = await Promise.all([
      fetchServicesTree(locale),
      fetchNews(locale),
      fetchPromos(locale),
      fetchPortfolio(locale),
    ])
    initialServicesTree = servicesTree
    initialServices = flattenServiceTree(servicesTree)
    initialNews = news
    initialPromos = promos
    initialPortfolio = portfolio
  } catch {
    // leave empty
  }

  return (
    <html lang={locale} className={ptSerif.variable}>
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B900C9278C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B900C9278C');
          `}
        </Script>
        <LocaleProvider
          locale={locale}
          initialServices={initialServices}
          initialServicesTree={initialServicesTree ?? []}
          initialNews={initialNews}
          initialPromos={initialPromos}
          initialPortfolio={initialPortfolio}
        >
          <AuthProvider>
            <CartProvider>
              <LocaleSetter locale={locale} />
              <Header />
              <div className="shrink-0 header-spacer h-[6.25rem] sm:h-[6.75rem] md:h-[7rem] lg:h-[7.75rem]" aria-hidden />
              <main className="flex-1">{children}</main>
              <Footer />
              <CookieBanner />
              <HotOfferPopup />
            </CartProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
