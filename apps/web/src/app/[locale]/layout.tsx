import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@forge/i18n/routing'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

/**
 * i18n layout wrapper — validates locale and provides generateStaticParams.
 * NextIntlClientProvider is in the root layout; no double-wrap here.
 *
 * To add a new locale:
 *   1. Create packages/i18n/messages/<locale>.json
 *   2. Add the locale to routing.locales in packages/i18n/src/routing.ts
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return <>{children}</>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
