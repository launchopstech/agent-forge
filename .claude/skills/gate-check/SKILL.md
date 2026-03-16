---
name: gate-check
description: Run the full gate check sequence (typecheck, lint, build, test, storybook build) and report failures. Use when the user says "run gate checks", "check before commit", "are we green", or "run all checks".
argument-hint: '[--fast] to skip storybook build and e2e'
---

Run the full gate check sequence for this monorepo. The project uses pnpm + Turborepo. Working directory is `/Users/bomatra/Developement/agentic-ai/agent-forge`.

## Steps — run in order, stop at first failure and report clearly

1. **Typecheck** — `pnpm typecheck`
   - Zero TS errors required. ignoreBuildErrors in next.config.mjs masks them in build — this is the real check.

2. **Lint** — `pnpm lint`
   - Zero errors AND zero warnings. `no-console` fires on `console.*` in `src/`.

3. **Build** — `pnpm build`
   - Production build must succeed.

4. **Tests** — `pnpm test:coverage`
   - All Vitest unit tests pass.
   - Coverage thresholds: lines 80%, statements 80%, branches 80%, functions 60%.
   - If coverage fails: identify uncovered files, do NOT lower thresholds.

5. **Storybook build** — `pnpm storybook:build`
   - All stories must compile without errors.
   - Skip this step if `--fast` argument was passed.

6. **E2E** — skipped by default (requires running dev server). Remind the user to run `pnpm test:e2e` manually after `pnpm dev`.

## Reporting

After all steps complete, output a clear summary table:

| Step            | Status | Notes                          |
| --------------- | ------ | ------------------------------ |
| typecheck       | ✓ / ✗  | error count or "clean"         |
| lint            | ✓ / ✗  | error/warning count or "clean" |
| build           | ✓ / ✗  | "succeeded" or error summary   |
| test:coverage   | ✓ / ✗  | pass count, coverage %         |
| storybook:build | ✓ / ✗  | "compiled" or error            |

If any step fails, show the exact error output and suggest a fix based on common patterns:

- TS errors: file:line with the error message
- Lint: rule name + file
- Coverage: which files are below threshold
- Storybook: which story file failed and why
