import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { routing, type Locale } from './routing'

const messageLoaders: Record<Locale, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('../messages/en.json'),
  fr: () => import('../messages/fr.json'),
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value
  const locale: Locale = routing.locales.includes(localeCookie as Locale)
    ? (localeCookie as Locale)
    : routing.defaultLocale

  const messages = (await messageLoaders[locale]()).default

  return { locale, messages }
})
