# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                    # Start dev server at localhost:3000
pnpm build                  # Production build (Turbo orchestrates all packages)
pnpm start                  # Run production build

# Quality gates — run ALL before committing
pnpm typecheck              # tsc --noEmit (ignoreBuildErrors masks errors in build)
pnpm lint                   # ESLint (all packages)
pnpm format:check           # Prettier check
pnpm build                  # Production build must succeed
pnpm test:coverage          # Unit tests + coverage thresholds
pnpm storybook:build        # Stories must compile
pnpm check                  # Runs all of the above + e2e in sequence

# Testing
pnpm test                   # Vitest watch mode
pnpm test run               # Single run, no watch
pnpm test:coverage          # With coverage enforcement
pnpm --filter=@forge/web exec vitest src/features/example/ExampleForm.test.tsx  # Single test file
pnpm test:e2e               # Playwright (requires built app)
pnpm test:e2e:ui            # Playwright with visual debugger

# Other
pnpm storybook              # Storybook at localhost:6006
pnpm analyze                # Bundle treemap (ANALYZE=true next build)
pnpm format                 # Prettier write all
pnpm lint:fix               # ESLint --fix (via @forge/web filter)
```

This project uses **pnpm** (never npm or yarn) with **Turbo** for monorepo orchestration.

## Architecture

**Turbo monorepo** — Next.js 16 / React 19 white-label platform for AI agent apps, deployed on Vercel.

### Monorepo layout

```
apps/web/               # @forge/web — Main Next.js App Router application
packages/
  ui/                   # @forge/ui — shadcn/ui components (owned, editable)
  ai-ui/                # @forge/ai-ui — AI-specific UI components (Vercel AI SDK)
  auth/                 # @forge/auth — Pluggable auth adapters
  brand/                # @forge/brand — White-label branding system
  config/               # @forge/config — Zod-validated env & app config
  i18n/                 # @forge/i18n — next-intl setup
  api-client/           # @forge/api-client — Shared API client utilities
  tsconfig/             # @forge/tsconfig — Shared TypeScript configs
```

### Web app source (`apps/web/src/`)

- **`app/`** — Next.js App Router. Route groups: `(auth)`, `(dashboard)`, `(marketing)`
- **`features/<name>/`** — Feature modules with co-located components, tests, stories, API, store, mocks, and types. This is the primary pattern for adding functionality.
- **`components/`** — Shared components: `ui/` (shadcn primitives), `layout/` (Navbar, Sidebar, Footer), `auth/`
- **`config/`** — App config objects: `env.ts` (Zod schema), `nav.ts`, `site.ts`, `themes/`
- **`hooks/`** — Shared React hooks
- **`lib/`** — Utilities and services: `utils.ts` (cn helper), `auth/` (pluggable adapters)
- **`styles/tokens.css`** — OKLCH design tokens (the file to change for branding)
- **`messages/`** — Translation files (next-intl)

### Path aliases

- `@/*` → `apps/web/src/*` (and specific sub-paths like `@/components/*`, `@/features/*`, `@/lib/*`, `@/hooks/*`, `@/config/*`)
- `@forge/ui`, `@forge/brand`, `@forge/auth`, `@forge/config`, `@forge/i18n`, `@forge/api-client` → workspace packages

### Key conventions

- **Styling**: Tailwind CSS v4 via `@theme inline` (no `tailwind.config.js`). Colors use OKLCH CSS variables with light/dark variants.
- **`cn()` utility**: Always use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for conditional classNames — never string concatenation.
- **Dark mode**: CSS-variable-based via next-themes. Toggled by `.dark` class.
- **Server Components first**: Default to Server Components. Add `'use client'` only at leaf boundaries. Never add it to layout components unless the spec explicitly requires it.
- **Commit format**: Conventional Commits enforced via commitlint + Husky (e.g., `feat(auth): add OAuth login`).
- **Pre-commit hooks**: Husky runs lint-staged (ESLint fix, Prettier, related Vitest tests).

## Auth pluggability

Active provider: `NEXT_PUBLIC_AUTH_PROVIDER=clerk|next-auth|okta` (default: `clerk`). See `packages/auth/CLAUDE.md` for import rules and adding a new provider.

## i18n

See `packages/i18n/CLAUDE.md`. Use the `/i18n-add` skill to add keys across all locales safely.

## Coverage, bundle health & performance

See `apps/web/CLAUDE.md` for thresholds, bundle budgets, and performance rules.

## Environment variables

### Source of truth

| Environment                    | Source                                                        |
| ------------------------------ | ------------------------------------------------------------- |
| Local dev                      | `.env.local` (gitignored)                                     |
| CI (GitHub Actions)            | GitHub → Settings → Secrets and Variables → Actions           |
| Preview / Staging / Production | Vercel dashboard → Project → Settings → Environment Variables |

### New developer setup

```bash
pnpm dlx vercel link          # link local repo to Vercel project (one-time)
pnpm dlx vercel env pull      # pull all env vars into .env.local
```

### Adding a new env var

1. Add to `.env.example` with placeholder and comment (always commit)
2. Set in Vercel dashboard for each environment
3. Set in GitHub Actions if needed by CI (Variables for non-sensitive, Secrets for sensitive)
4. Add to `src/config/env.ts` Zod schema if it must be validated at build time
5. Run `pnpm dlx vercel env pull` locally

## Code rules

- **`packages/ui/src/`** — owned and editable. Add components with `pnpm dlx shadcn@latest add <component>`. Keep generic (no app-specific imports like `@/config`, `@forge/brand`). App-specific wrappers go in `apps/web/src/components/`.
- **Never hardcode copy** in layout components — text comes from `src/config/` or props
- **Never commit** build artifacts: `.next/`, `storybook-static/`, `out/`
- **TypeScript build errors are suppressed** (`ignoreBuildErrors: true` in `next.config.mjs`) — always run `pnpm typecheck` separately
- **`no-explicit-any`**: ERROR — no `any` types allowed
