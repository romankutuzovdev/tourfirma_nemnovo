'use client'

import { useCallback } from 'react'
import ruCommon from '@/locales/ru/common.json'

function getByPath(source: unknown, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, source)
  return typeof value === 'string' ? value : undefined
}

export function useTranslations(namespace?: string) {
  return useCallback(
    (key: string) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      return getByPath(ruCommon, fullKey) ?? fullKey
    },
    [namespace]
  )
}

