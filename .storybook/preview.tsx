import type { Preview } from '@storybook/react'
import React from 'react'
import { withThemeByClassName } from '@storybook/addon-themes'

import '../src/app/globals.css'

import { ThemeProvider } from '../src/components/theme-provider'

const preview: Preview = {
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
      const noWrapper = context.parameters['noLayoutWrapper'] as boolean | undefined
      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {noWrapper ? (
            <Story />
          ) : (
            <div className="min-h-screen bg-background text-foreground p-6">
              <Story />
            </div>
          )}
        </ThemeProvider>
      )
    },
  ],
}

export default preview
