import { defaultTheme } from '@forge/config/src/themes/default'
import { darkTheme } from '@forge/config/src/themes/dark'
import type { BrandConfig } from './types'

export const defaultBrand: BrandConfig = {
  key: 'default',
  site: {
    name: 'AgentForge',
    description: 'Agency-first AI agent platform.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    ogImage: '/og.png',
  },
  colors: {
    light: defaultTheme,
    dark: darkTheme,
  },
  assets: {
    logoPath: '/brands/default/logo.svg',
    faviconPath: '/brands/default/favicon.ico',
  },
}
