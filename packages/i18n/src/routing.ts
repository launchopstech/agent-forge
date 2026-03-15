import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'fr'],

  // Default locale — used when no locale prefix is present in the URL
  defaultLocale: 'en',

  // Prefix strategy: 'never' — all locales use cookie-based switching, no URL prefix
  localePrefix: 'never',
})

export type Locale = (typeof routing.locales)[number]
