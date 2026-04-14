import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['src/utils/**'],
      // auth-handler adapter files (client.ts, context.tsx, middleware.ts, provider.tsx, server.ts)
      // use browser/React APIs (window, fetch, React context) that cannot be exercised in a Node
      // test environment — excluded rather than covered by brittle mocks.
      exclude: ['src/**/*.test.ts', 'src/**/index.ts'],
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
