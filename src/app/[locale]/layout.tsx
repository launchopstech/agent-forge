import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/**
 * i18n layout wrapper — wraps locale-specific routes with NextIntlClientProvider.
 *
 * To add a new locale:
 *   1. Create src/messages/<locale>.json
 *   2. Add the locale to routing.locales in src/i18n/routing.ts
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
