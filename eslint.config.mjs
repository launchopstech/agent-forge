import nextConfig from 'eslint-config-next'
import tseslint from 'typescript-eslint'

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
]

export default eslintConfig
