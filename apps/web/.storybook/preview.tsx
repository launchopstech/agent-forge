import type { Preview } from '@storybook/react'
import React, { useEffect } from 'react'
import { withThemeByClassName } from '@storybook/addon-themes'
import { useChannel } from '@storybook/preview-api'
import { NextIntlClientProvider } from 'next-intl'

import '../src/app/globals.css'

import { ThemeProvider } from '../src/components/theme-provider'
import { TenantProvider, getBrand, brandCssVars } from '@forge/brand'
import enMessages from '@forge/i18n/messages/en.json'
import frMessages from '@forge/i18n/messages/fr.json'
import { THEME_PRESETS } from '../../../packages/ui/src/theme-editor/presets'
import { hexToOklch } from '../../../packages/ui/src/theme-editor/color-utils'
import {
  DEFAULT_LIGHT_VARS,
  DEFAULT_DARK_VARS,
} from '../../../packages/ui/src/theme-editor/constants'

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
          { value: 'mindrithm', title: 'MindRithm (Indigo)' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    preset: {
      description: 'Theme preset',
      toolbar: {
        icon: 'photo',
        items: [
          { value: '', title: 'Default' },
          ...Object.entries(THEME_PRESETS).map(([key, p]) => ({ value: key, title: p.label })),
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    locale: 'en',
    brand: 'default',
    preset: '',
  },
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      useChannel({
        FORGE_THEME_UPDATE: ({
          vars,
          mode,
        }: {
          vars: Record<string, string>
          mode: 'light' | 'dark'
        }) => {
          const selector = mode === 'dark' ? '.dark' : ':root'
          const css = `${selector} {\n${Object.entries(vars)
            .map(([k, v]) => `  ${k}: ${v};`)
            .join('\n')}\n}`
          let el = document.getElementById('storybook-theme-override')
          if (!el) {
            el = document.createElement('style')
            el.id = 'storybook-theme-override'
            document.head.appendChild(el)
          }
          el.textContent = css
        },
      })
      return <Story />
    },
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
      const presetKey = (context.globals['preset'] as string | undefined) ?? ''
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

      useEffect(() => {
        const el = document.getElementById('storybook-preset-vars')
        if (!presetKey) {
          if (el) el.textContent = ''
          return
        }
        const preset = THEME_PRESETS[presetKey]
        if (!preset) return

        const toOklch = (raw: Record<string, string>) =>
          Object.fromEntries(
            Object.entries(raw).map(([k, v]) => [
              `--${k}`,
              k === 'radius' ? v : v.startsWith('#') ? hexToOklch(v) : v,
            ])
          )

        const lightVars = { ...DEFAULT_LIGHT_VARS, ...toOklch(preset.light) }
        const darkVars = { ...DEFAULT_DARK_VARS, ...toOklch(preset.dark) }
        // Use !important so preset vars win over brandCssVars() which also uses !important.
        // Because storybook-preset-vars is appended after storybook-brand-vars in the DOM,
        // it wins when specificity and !important are equal.
        const toRule = (vars: Record<string, string>) =>
          Object.entries(vars)
            .map(([k, v]) => `  ${k}: ${v} !important;`)
            .join('\n')
        const css = [`:root {\n${toRule(lightVars)}\n}`, `.dark {\n${toRule(darkVars)}\n}`].join(
          '\n\n'
        )

        // Clear panel override so preset is the clean baseline
        const panelEl = document.getElementById('storybook-theme-override')
        if (panelEl) panelEl.textContent = ''

        let styleEl = document.getElementById('storybook-preset-vars')
        if (!styleEl) {
          styleEl = document.createElement('style')
          styleEl.id = 'storybook-preset-vars'
          document.head.appendChild(styleEl)
        }
        styleEl.textContent = css
      }, [presetKey])

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
