import type { Preview } from '@storybook/react'
import React, { useEffect } from 'react'
import { withThemeByClassName } from '@storybook/addon-themes'
import { NextIntlClientProvider } from 'next-intl'

import '../src/app/globals.css'

import { ThemeProvider } from '../src/components/theme-provider'
import { TenantProvider } from '../src/lib/tenant-context'
import { getBrand } from '../src/config/brands'
import { brandCssVars } from '../src/lib/brand-utils'
import enMessages from '../src/messages/en.json'
import frMessages from '../src/messages/fr.json'

const messages: Record<string, typeof enMessages> = {
  en: enMessages,
  fr: frMessages,
}

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Internationalisation locale',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'fr', title: 'Français' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    brand: {
      description: 'Brand / white-label',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default (Purple)' },
          { value: 'client-a', title: 'Client A (Blue)' },
          { value: 'client-b', title: 'Client B (Green)' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: 'en',
    brand: 'default',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story, context) => {
      const locale = (context.globals['locale'] as string | undefined) ?? 'en'
      const brandKey = (context.globals['brand'] as string | undefined) ?? 'default'
      const brand = getBrand(brandKey)
      const noWrapper = context.parameters['noLayoutWrapper'] as boolean | undefined

      useEffect(() => {
        const css = brandCssVars(brand)
        let el = document.getElementById('storybook-brand-vars')
        if (!el) {
          el = document.createElement('style')
          el.id = 'storybook-brand-vars'
          document.head.appendChild(el)
        }
        el.textContent = css
      }, [brand])

      return (
        <NextIntlClientProvider locale={locale} messages={messages[locale] ?? enMessages}>
          <TenantProvider brand={brand}>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {noWrapper ? (
                <Story />
              ) : (
                <div className="min-h-screen bg-background text-foreground p-6">
                  <Story />
                </div>
              )}
            </ThemeProvider>
          </TenantProvider>
        </NextIntlClientProvider>
      )
    },
  ],
}

export default preview
