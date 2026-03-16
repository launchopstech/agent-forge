import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/index.ts',
        'src/actions.ts', // Next.js Server Action (cookies/revalidatePath) — requires Next.js runtime
        'src/navigation.ts', // next-intl createNavigation — requires Next.js runtime
        'src/request.ts', // next-intl getRequestConfig — requires Next.js runtime
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 60,
      },
    },
  },
})
