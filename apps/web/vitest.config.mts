import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    include: ['src/**/*.test.{ts,tsx}', '.storybook/**/*.test.{ts,tsx}'],
    exclude: [
      'src/i18n/i18n.test.ts', // i18n tests live in @forge/i18n package
    ],
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**',
        'src/hooks/**',
        'src/features/agents/api/**',
        'src/features/agents/store/**',
      ],
      exclude: [
        'src/lib/auth/**', // auth adapters are intentional NotImplementedError stubs
        'src/lib/auth.ts', // auth registry proxy — integration tested via E2E
        'src/lib/content.ts', // CMS stub (TODO: swap with Contentful/Sanity) — no real logic to test yet
        'src/lib/index.ts', // re-export barrel, no logic
        'src/lib/metadata.ts', // Next.js metadata config, no testable logic
        'src/hooks/use-mobile.ts', // wraps matchMedia — browser API, no unit-testable logic
        'src/hooks/use-mobile.tsx', // wraps matchMedia — browser API, no unit-testable logic
        'src/hooks/use-theme.ts', // wraps next-themes useTheme — tested via E2E
        'src/hooks/use-user.ts', // wraps Clerk useUser — requires Clerk mock environment
        'src/hooks/index.ts', // re-export barrel, no logic
      ],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 60,
      },
    },
  },
})
