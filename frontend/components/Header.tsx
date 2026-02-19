'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import { useAuth } from '@/contexts/AuthContext'
import { locales, localeNames } from '@/lib/i18n'
import { SiteSearch } from '@/components/SiteSearch'

export function Header() {
  const locale = useLocale()
  const t = useTranslations()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const nav = [
    { href: `/${locale}/about`, label: t('nav.about') },
    { href: `/${locale}/excursions`, label: t('nav.excursions') },
    { href: `/${locale}/services`, label: t('nav.services') },
    { href: `/${locale}/visafree`, label: t('nav.visafree') },
    { href: `/${locale}/portfolio`, label: t('nav.portfolio') },
    { href: `/${locale}/promos`, label: t('nav.promos') },
    { href: `/${locale}/news`, label: t('nav.news') },
    { href: `/${locale}/reviews`, label: t('nav.reviews') },
    { href: `/${locale}/faq`, label: t('nav.faq') },
    { href: `/${locale}/contact`, label: t('nav.contact') },
    { href: `/${locale}/payment`, label: t('nav.payment') },
    { href: `/${locale}/agencies`, label: t('nav.agencies') },
  ]
  const authLink = isAuthenticated
    ? { href: `/${locale}/cabinet`, label: t('nav.cabinet') }
    : { href: `/${locale}/login`, label: t('nav.login') }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 sm:gap-3 font-serif-legacy text-xl sm:text-2xl lg:text-3xl font-semibold text-black tracking-tight shrink-0">
          <Image src="/logo.svg" alt={t('footer.copyright')} width={64} height={64} className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain shrink-0" unoptimized />
          {t('footer.copyright')}
        </Link>
        <div className="hidden md:flex items-center gap-4">
          <SiteSearch />
          <nav className="flex items-center gap-3 flex-wrap">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="font-sans text-sm font-semibold tracking-wide text-black/80 hover:text-black transition-colors whitespace-nowrap">
                {item.label}
              </Link>
            ))}
            <Link href={authLink.href} className="font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors whitespace-nowrap shrink-0">
              {authLink.label}
            </Link>
          </nav>
          <div className="relative">
            <button type="button" onClick={() => setLangOpen(!langOpen)} className="font-sans text-sm font-semibold tracking-wide text-black/80 hover:text-black px-2 py-1.5 border border-secondary/30 rounded" aria-expanded={langOpen}>
              {localeNames[locale]}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setLangOpen(false)} />
                <ul className="absolute right-0 top-full mt-1 py-1 bg-white border border-secondary/20 rounded shadow-lg z-20 min-w-[140px]" role="menu">
                  {locales.map((loc) => (
                    <li key={loc} role="none">
                      <Link href={`/${loc}`} role="menuitem" className={`block px-4 py-2 font-sans text-sm hover:bg-secondary/50 ${locale === loc ? 'text-black font-medium' : 'text-black/80'}`} onClick={() => setLangOpen(false)}>
                        {localeNames[loc]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <SiteSearch />
          <div className="relative">
            <button type="button" onClick={() => setLangOpen(!langOpen)} className="font-sans text-xs text-black/80 px-2 py-1 border border-secondary/30 rounded">
              {locale.toUpperCase()}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setLangOpen(false)} />
                <ul className="absolute right-0 top-full mt-1 py-1 bg-white border border-secondary/20 rounded shadow-lg z-20 min-w-[120px]">
                  {locales.map((loc) => (
                    <li key={loc}>
                      <Link href={`/${loc}`} className={`block px-3 py-2 font-sans text-sm ${locale === loc ? 'text-black font-medium' : 'text-black/80'}`} onClick={() => setLangOpen(false)}>
                        {localeNames[loc]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <button type="button" aria-label={t('nav.menuOpen')} className="p-2 text-black" onClick={() => setOpen(!open)}>
            <span className="block w-6 h-px bg-primary mb-1.5" />
            <span className="block w-6 h-px bg-primary mb-1.5" />
            <span className="block w-5 h-px bg-primary" />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-secondary/10 py-6 px-6 flex flex-col gap-4">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="font-sans font-semibold text-black/80 hover:text-black" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href={authLink.href} className="font-sans font-semibold px-4 py-2.5 rounded-lg bg-primary text-black hover:bg-primary/90 text-center" onClick={() => setOpen(false)}>
            {authLink.label}
          </Link>
          <div className="pt-2 border-t border-secondary/10 flex flex-wrap gap-2">
            {locales.map((loc) => (
              <Link key={loc} href={`/${loc}`} className={`font-sans text-sm px-3 py-1.5 rounded border ${locale === loc ? 'border-primary text-black' : 'border-secondary/30 text-black/80'}`} onClick={() => setOpen(false)}>
                {localeNames[loc]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
