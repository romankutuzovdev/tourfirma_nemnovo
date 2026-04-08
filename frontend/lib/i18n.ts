// Внутренние (кодовые) локали проекта больше не используем:
// переключение языков делается только через Google Translate widget.
export const locales = ['ru'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
}

export function isValidLocale(locale: string): locale is Locale {
  return locale === 'ru'
}
