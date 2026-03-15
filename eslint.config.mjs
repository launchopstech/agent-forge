import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import i18next from 'eslint-plugin-i18next'

const eslintConfig = [
  { ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/storybook-static/**', '**/coverage/**', '**/.storybook/**'] },
  // ── React ─────────────────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'warn',
    },
  },
  // ── TypeScript ─────────────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@typescript-eslint': tseslint.plugin },
    languageOptions: { parser: tseslint.parser },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
    },
  },
  // ── i18n guardrail ────────────────────────────────────────────────────────
  // Flags raw string literals rendered directly in JSX markup.
  // Use t('key') from useTranslations() / getTranslations() instead.
  {
    files: ['**/src/**/*.tsx'],
    ignores: [
      '**/src/config/**',
      '**/src/messages/**',
      '**/*.stories.tsx',
      '**/*.test.tsx',
      '**/*.test.ts',
      '**/src/i18n/**',
    ],
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': [
        'warn',
        {
          markupOnly: true,
          ignoreAttribute: [
            'className', 'class', 'href', 'src', 'alt', 'type', 'id', 'key',
            'name', 'value', 'style', 'variant', 'size', 'side', 'align',
            'asChild', 'suppressHydrationWarning', 'data-testid',
            'aria-labelledby', 'aria-describedby', 'tabIndex',
          ],
          i18nFunctionNames: ['t', 'useTranslations', 'getTranslations'],
        },
      ],
    },
  },
  // ── Component library packages (vendor-sourced shadcn code) ──────────────
  // packages/ui and packages/ai-ui are copied-in component libraries.
  // Their demo/preview code uses natural-language text, hooks inside render
  // functions (valid in Storybook), console in handlers, and `any` from the
  // upstream shadcn AI SDK types — none of which apply here.
  {
    files: ['packages/ui/src/**', 'packages/ai-ui/src/**'],
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'i18next/no-literal-string': 'off',
      'jsx-a11y/alt-text': 'off',
    },
  },
]

export default eslintConfig
