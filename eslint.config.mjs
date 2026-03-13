import nextConfig from 'eslint-config-next'
import tseslint from 'typescript-eslint'
import i18next from 'eslint-plugin-i18next'

const eslintConfig = [
  { ignores: ['node_modules', '.next', 'dist', 'storybook-static', 'coverage'] },
  ...nextConfig,
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
    },
  },
  // ── i18n guardrail ────────────────────────────────────────────────────────
  // Flags raw string literals rendered directly in JSX markup.
  // Use t('key') from useTranslations() / getTranslations() instead.
  {
    files: ['src/**/*.tsx'],
    // Exclude config files, stories, tests, and the messages folder itself
    ignores: [
      'src/config/**',
      'src/messages/**',
      'src/**/*.stories.tsx',
      'src/**/*.test.tsx',
      'src/**/*.test.ts',
      'src/i18n/**',
    ],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          markupOnly: true,
          // Attributes that carry non-translatable values
          ignoreAttribute: [
            'className',
            'class',
            'href',
            'src',
            'alt',
            'type',
            'id',
            'key',
            'name',
            'value',
            'style',
            'variant',
            'size',
            'side',
            'align',
            'asChild',
            'suppressHydrationWarning',
            'data-testid',
            'aria-labelledby',
            'aria-describedby',
            'tabIndex',
          ],
          // next-intl translation function names
          i18nFunctionNames: ['t', 'useTranslations', 'getTranslations'],
        },
      ],
    },
  },
]

export default eslintConfig
