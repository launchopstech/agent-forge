import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['../../apps/web/src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/index.ts',
        'src/config/types.ts', // pure TypeScript interfaces — no runtime code to cover
        'src/config/client-b.ts', // static brand config data — no logic to test
        'src/config/client-a.ts', // static brand config data — no logic to test
        'src/config/default.ts', // static brand config data — no logic to test
        'src/persistence/types.ts', // pure TypeScript interface — no runtime code to cover
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
