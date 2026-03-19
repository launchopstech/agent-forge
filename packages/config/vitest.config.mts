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
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/index.ts',
        'src/types.ts', // TypeScript interfaces only — no runtime logic
        'src/nav.ts', // static navigation config data — no logic to test
        'src/site.ts', // static site config data — no logic to test
        'src/properties.ts', // static properties config data — no logic to test
        'src/themes/**', // static theme config data — no logic to test
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
