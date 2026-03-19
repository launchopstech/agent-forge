import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      // Only cover utility logic — shadcn/ui components are primitives
      // (never edited directly per project rules) and are validated via Storybook/E2E
      include: ['src/utils.ts'],
      exclude: [],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 60,
      },
    },
  },
})
