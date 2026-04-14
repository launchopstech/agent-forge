# @forge/web

Next.js 16 / React 19 App Router application.

## Coverage thresholds (vitest.config.mts)

| Metric     | Minimum |
| ---------- | ------- |
| Lines      | 80%     |
| Statements | 80%     |
| Branches   | 80%     |
| Functions  | 60%     |

Scope: `src/lib/**`, `src/hooks/**`, `src/features/agents/api/**`, `src/features/agents/store/**`.
Fix coverage by writing tests, never by lowering thresholds. Co-locate `*.test.ts(x)` with new files in covered dirs. If genuinely untestable, add to `coverage.exclude` in `vitest.config.mts` with a comment.

## Bundle health

- Main shared chunk: < 250 kb
- Per-route bundle: < 150 kb
- `recharts` must use `next/dynamic()` — never imported directly in a route
- Each route (`/`, `/dashboard`, `/login`) must have its own chunk

## Performance rules

- `React.memo` on `'use client'` layout components and components with stable props from frequently-updating parents
- `useCallback` for every event handler passed as a prop or in a dependency array
- `useMemo` for filtered/sorted arrays and expensive derived state; not for plain `.map()` calls
- `next/dynamic()` for components > ~50 kb (charts, rich editors, heavy modals)
- `next/image` always — never `<img>`. Set explicit `width`/`height` or `fill` + `sizes`

## Auth import rules (app side)

- Import from `@/lib/auth` or `@/hooks/use-user` — never directly from `@clerk/nextjs`
- Provider UI (`<UserButton />`) at route/page level only, marked `// PROVIDER-SPECIFIC`
