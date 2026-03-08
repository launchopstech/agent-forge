import type { StorybookConfig } from '@storybook/react-vite'
import path from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig, loadEnv } = await import('vite')
    const env = loadEnv('development', process.cwd(), '')
    const define = Object.fromEntries(
      Object.entries(env)
        .filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
        .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
    )
    return mergeConfig(config, {
      define,
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          '@/components': path.resolve(__dirname, '../src/components'),
          '@/features': path.resolve(__dirname, '../src/features'),
          '@/lib': path.resolve(__dirname, '../src/lib'),
          '@/hooks': path.resolve(__dirname, '../src/hooks'),
          '@/types': path.resolve(__dirname, '../src/types'),
          '@/config': path.resolve(__dirname, '../src/config'),
          'next/navigation': path.resolve(__dirname, './mocks/next-navigation.ts'),
          'next/link': path.resolve(__dirname, './mocks/next-link.tsx'),
        },
      },
    })
  },
}

export default config
