import rootConfig from '../../eslint.config.mjs'
import nextConfig from 'eslint-config-next'

// eslint-config-next registers react, react-hooks, jsx-a11y — drop those
// entries from rootConfig to avoid "Cannot redefine plugin" errors.
const NEXT_PLUGINS = new Set(['react', 'react-hooks', 'jsx-a11y'])
const rootWithoutDuplicatePlugins = rootConfig.map((cfg) => {
  if (!cfg.plugins) return cfg
  const filtered = Object.fromEntries(
    Object.entries(cfg.plugins).filter(([k]) => !NEXT_PLUGINS.has(k))
  )
  return { ...cfg, plugins: filtered }
})

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: ['.next/**', 'coverage/**', 'storybook-static/**', 'node_modules/**'] },
  ...nextConfig,
  ...rootWithoutDuplicatePlugins,
  {
    files: ['src/**/*.tsx'],
    ignores: [
      'src/config/**',
      'src/messages/**',
      'src/**/*.stories.tsx',
      'src/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/i18n/**',
    ],
  },
]

export default config
