'use client'

import { useEffect } from 'react'

type Props = { locale: string }

export function LocaleSetter({ locale }: Props) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])
  return null
}
