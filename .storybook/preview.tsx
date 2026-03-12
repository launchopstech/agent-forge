import type { Preview } from '@storybook/react'
import React from 'react'
import { withThemeByClassName } from '@storybook/addon-themes'
import { NextIntlClientProvider } from 'next-intl'

import '../src/app/globals.css'

import { ThemeProvider } from '../src/components/theme-provider'
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
  },
  initialGlobals: {
    locale: 'en',
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
      const noWrapper = context.parameters['noLayoutWrapper'] as boolean | undefined
      return (
        <NextIntlClientProvider locale={locale} messages={messages[locale] ?? enMessages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {noWrapper ? (
              <Story />
            ) : (
              <div className="min-h-screen bg-background text-foreground p-6">
                <Story />
              </div>
            )}
          </ThemeProvider>
        </NextIntlClientProvider>
      )
    },
  ],
}

export default preview
