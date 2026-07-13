---
name: coverage-fix
description: Identify files below coverage thresholds and generate missing tests. Use when the user says "coverage failing", "coverage is low", "fix coverage", or "tests below threshold".
argument-hint: '[file-path to focus on]'
---

Fix failing coverage thresholds. Focus target (if provided): `$ARGUMENTS`

## Coverage thresholds (enforced in `vitest.config.mts`)

| Metric     | Minimum |
| ---------- | ------- |
| Lines      | 80%     |
| Statements | 80%     |
| Branches   | 80%     |
| Functions  | 60%     |

Scope: `apps/web/src/lib/**` and `apps/web/src/hooks/**`

## Step 1 — Get the coverage report

```bash
pnpm --filter=@forge/web test:coverage 2>&1 | tail -50
```

Identify which files are below threshold. Coverage report shows per-file percentages.

## Step 2 — Audit uncovered files

For each file below threshold:

1. Read the file to understand what it exports
2. Check if there's an existing `*.test.ts(x)` colocated in the same directory
3. Determine if the file is genuinely testable or should be excluded

## Exclusion criteria (add to `coverage.exclude` in `vitest.config.mts` with a comment)

Only exclude if:

- Clerk/auth hooks that require browser context (`useUser`, `useAuth`)
- Pure re-export files with no logic (`export * from '...'`)
- Browser-only APIs (`navigator`, `window`, `document` without abstraction)

**Never** lower the threshold numbers — fix by writing tests.

## Step 3 — Write missing tests

For each testable file, create a colocated `<filename>.test.ts(x)`:

### For `src/lib/` files (utility functions):

```ts
import { describe, it, expect } from 'vitest'
import { functionName } from './filename'

describe('functionName', () => {
  it('returns expected value for happy path', () => {
    expect(functionName(input)).toBe(expected)
  })
  it('handles edge case', () => {
    expect(functionName(edgeInput)).toBe(edgeExpected)
  })
})
```

### For `src/hooks/` files (React hooks):

```tsx
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useHookName } from './use-hook-name'

describe('useHookName', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useHookName())
    expect(result.current).toBeDefined()
  })
})
```

## Step 4 — Verify

```bash
pnpm --filter=@forge/web test:coverage
```

All four metrics must be at or above threshold. If still failing, check which branches are uncovered and add tests for those specific code paths.
