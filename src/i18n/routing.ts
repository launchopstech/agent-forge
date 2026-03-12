import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // All supported locales
  locales: ['en', 'fr'],

  // Default locale — used when no locale prefix is present in the URL
  defaultLocale: 'en',

  // Prefix strategy: 'as-needed' omits the prefix for the default locale
  // e.g. /en/dashboard → /dashboard, /fr/dashboard → /fr/dashboard
  localePrefix: 'as-needed',
})

export type Locale = (typeof routing.locales)[number]
