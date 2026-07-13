import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(ts|tsx)',
    // Include stories from internal packages (e.g. packages/ui/src/*.stories.tsx)
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
    '../../../packages/ai-ui/src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig, loadEnv } = await import('vite')
    // Dynamic import avoids CJS/ESM conflict when Storybook evaluates main.ts
    const { default: tsconfigPaths } = await import('vite-tsconfig-paths')
    const env = loadEnv('development', process.cwd(), '')
    const define = Object.fromEntries(
      Object.entries(env)
        .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
        .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
    )
    return mergeConfig(config, {
      // vite-tsconfig-paths reads apps/web/tsconfig.json which already maps all @/* and @forge/* paths
      plugins: [tsconfigPaths()],
      define,
      // Force automatic JSX runtime so component files don't need `import React from 'react'`
      esbuild: {
        jsx: 'automatic',
      },
      resolve: {
        alias: [
          {
            find: 'next/navigation',
            replacement: path.resolve(__dirname, './mocks/next-navigation.ts'),
          },
          { find: 'next/link', replacement: path.resolve(__dirname, './mocks/next-link.tsx') },
          // @forge/i18n/actions uses next/headers + next/cache (server-only) — replace with browser-safe mock
          {
            find: '@forge/i18n/actions',
            replacement: path.resolve(__dirname, './mocks/forge-i18n-actions.ts'),
          },
          // @forge/i18n/messages is not in tsconfig paths (messages dir is outside src/)
          {
            find: '@forge/i18n/messages',
            replacement: path.resolve(__dirname, '../../../packages/i18n/messages'),
          },
        ],
      },
    })
  },
}

export default config
