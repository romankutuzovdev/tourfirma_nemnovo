import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'ru'
  const messages = (await import(`@/locales/${locale}/common.json`)).default
  return { locale, messages }
})
