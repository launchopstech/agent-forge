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

## Coverage thresholds (enforced in `vitest.config.mts`)

| Metric     | Minimum |
| ---------- | ------- |
| Lines      | 80%     |
| Statements | 80%     |
| Branches   | 80%     |
| Functions  | 60%     |

Scope: `src/lib/**`, `src/hooks/**`, `src/features/agents/api/**`, `src/features/agents/store/**` (auth adapters, re-exports, and browser-only hooks excluded). Fix coverage by writing tests, never by lowering thresholds. When adding files to covered directories, co-locate a `*.test.ts(x)`. If genuinely untestable, add to `coverage.exclude` in `vitest.config.mts` with a comment.

## Bundle health

- Main shared chunk: < 250 kb
- Per-route bundle: < 150 kb
- `recharts` must be wrapped with `next/dynamic()` — never in a route bundle directly
- Each route (`/`, `/dashboard`, `/login`) must have its own chunk separate from shared bundle

## Auth pluggability

Active provider set by `NEXT_PUBLIC_AUTH_PROVIDER=clerk|next-auth|okta` (default: `clerk`).

**Import rules:**

- `src/lib/auth/adapters/clerk/server.ts` — only file that imports from `@clerk/nextjs/server`
- `src/lib/auth/adapters/clerk/client.ts` — only file that imports from `@clerk/nextjs` (hooks)
- App code imports from `@/lib/auth` or `@/hooks/use-user` — never directly from `@clerk/nextjs`
- Provider UI components (`<UserButton />`, `<SignIn />`, `<SignUp />`) allowed at route/page level only, marked `// PROVIDER-SPECIFIC`

**Adding a new provider (4 steps):**

1. Create `src/lib/auth/adapters/<provider>/` with `server.ts`, `client.ts`, `provider.tsx`, `middleware.ts`
2. Add the new key to `AuthProviderKey` in `src/lib/auth/contracts.ts` — TypeScript flags every missing switch case
3. Add `import * as <provider>Adapter` + `case '<provider>': return <provider>Adapter` to each registry file
4. Set `NEXT_PUBLIC_AUTH_PROVIDER=<provider>` in `.env.local`, Vercel, and GitHub Variables

## i18n rules

- No hardcoded user-visible strings in JSX — ESLint `i18next/no-literal-string` enforces this
- Server Components: `const t = await getTranslations('namespace')` from `next-intl/server`
- Client Components: `const t = useTranslations('namespace')` from `next-intl`
- New keys go in `src/messages/en.json` first, then mirror in all locale files
- Nav items: add `labelKey` in `src/config/nav.ts` matching a key in the `sidebar` namespace
- Run `pnpm test run src/i18n/i18n.test.ts` after any message file change (guards key parity and empty values)

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

## Performance rules

- `React.memo` on `'use client'` layout components and components with stable props from frequently-updating parents
- `useCallback` for every event handler passed as a prop or in a dependency array
- `useMemo` for filtered/sorted arrays and expensive derived state; not for plain `.map()` calls
- `next/dynamic()` for components > ~50kb (charts, rich editors, heavy modals)
- `next/image` always (never `<img>`) — set explicit `width`/`height` or `fill` + `sizes`
- See `docs/PERFORMANCE.md` for patterns and Core Web Vitals targets
