# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start development server at http://localhost:3000
pnpm build      # Build for production
pnpm start      # Run production build
pnpm lint       # Run ESLint
```

> This project uses **pnpm** as its package manager (pnpm-lock.yaml is the lockfile).

## Architecture

This is a **Next.js 16 / React 19** app using the App Router, bootstrapped via [v0.app](https://v0.app) and deployed on Vercel.

### Key conventions

- **Path aliases**: `@/components`, `@/components/ui`, `@/lib`, `@/hooks` — all defined in `tsconfig.json`
- **UI components**: shadcn/ui ("new-york" style) live in `components/ui/`. Add new components with `pnpm dlx shadcn@latest add <component>`. The icon library is lucide-react.
- **Styling**: Tailwind CSS v4 — configured entirely in `app/globals.css` via `@theme inline` (no `tailwind.config.js`). Colors use OKLCH and are defined as CSS variables with light/dark variants.
- **`cn()` utility**: `lib/utils.ts` exports `cn()` (clsx + tailwind-merge) — use this for all conditional className composition.
- **Dark mode**: CSS-variable-based, toggled via the `.dark` class (next-themes via `components/theme-provider.tsx`).
- **TypeScript build errors are suppressed** (`ignoreBuildErrors: true` in `next.config.mjs`) — do not rely on the build to catch type errors; run `tsc --noEmit` manually if needed.

### Structure

```
app/
  layout.tsx      # Root layout: Geist fonts, Vercel Analytics, metadata
  page.tsx        # Landing page (currently the only route, uses 'use client')
  globals.css     # Tailwind imports + all CSS custom properties (design tokens)
components/
  ui/             # shadcn/ui primitives (never edit these directly)
  theme-provider.tsx
hooks/
  use-mobile.ts   # Responsive breakpoint hook
  use-toast.ts    # Toast state management
lib/
  utils.ts        # cn() helper
```

### Adding new pages/features

New routes go in `app/` following Next.js App Router conventions. Server Components are the default; add `'use client'` only when needed (event handlers, hooks, browser APIs).

## Environment Variables

### Source of truth per environment

| Environment                    | Source of truth                                               |
| ------------------------------ | ------------------------------------------------------------- |
| Local dev                      | `.env.local` (gitignored)                                     |
| CI (GitHub Actions)            | GitHub → Settings → Secrets and Variables → Actions           |
| Preview / Staging / Production | Vercel dashboard → Project → Settings → Environment Variables |

### New developer setup

```bash
pnpm dlx vercel link          # link local repo to Vercel project (one-time)
pnpm dlx vercel env pull      # pull all env vars into .env.local
```

### Adding a new environment variable

1. Add it to `.env.example` with a placeholder value and comment (always commit this)
2. Set real value in **Vercel dashboard** for each environment (Production / Preview / Development)
3. Set in **GitHub → Settings → Secrets and Variables → Actions** if needed by CI:
   - Non-sensitive → **Variables** tab: `gh variable set NAME --body "value"`
   - Sensitive → **Secrets** tab: `gh secret set NAME`
4. Add to `src/config/env.ts` schema if it must be validated at build time
5. Run `pnpm dlx vercel env pull` locally to get the updated `.env.local`

### Updating GitHub Actions variables via CLI

```bash
# List all variables
gh variable list

# Set / update a variable
gh variable set NEXT_PUBLIC_APP_URL --body "https://myapp.com"
gh variable set NEXT_PUBLIC_APP_ENV --body "production"

# Set / update a secret (sensitive values)
gh secret set DATABASE_URL

# Pull from Vercel into GitHub Variables (manual sync — run when Vercel vars change)
# Non-sensitive vars only:
gh variable set NEXT_PUBLIC_APP_URL --body "$(vercel env pull --yes > /dev/null && grep NEXT_PUBLIC_APP_URL .env.local | cut -d= -f2)"
```

### Rules

- **Never commit** `.env.local`, `.env*.local`, or any file containing real secrets
- **Always commit** `.env.example` when adding a new variable
- **Vercel is the source of truth** — do not manually edit `.env.local` for shared vars; pull from Vercel instead
- CI workflows reference vars as `${{ vars.NAME }}` (non-sensitive) or `${{ secrets.NAME }}` (sensitive)

## Guardrails — always follow these

### Before starting any phase task

1. Check `memory/MEMORY.md` to confirm which sub-tasks are already done — never re-implement completed work.
2. Read the relevant section of `docs/specs/nextjs-frontend-specs.md` to understand acceptance criteria.

### Gate checks — run ALL before every commit

```bash
pnpm typecheck              # zero TS errors (ignoreBuildErrors masks them in build)
pnpm lint                   # zero errors, zero warnings (no-console fires on console.*)
pnpm format:check           # zero prettier violations (CI runs this; pre-commit hook only auto-fixes)
pnpm build                  # production build must succeed
pnpm test:coverage          # all unit tests must pass AND coverage thresholds must be met
pnpm exec storybook build   # all stories must compile
pnpm analyze                # inspect bundle treemap (see bundle health checks below)
```

Never skip or reorder these. A passing build alone is not sufficient.

### Coverage thresholds (enforced in `vitest.config.mts`)

Thresholds are hardcoded — **if CI fails on coverage, fix it by writing more tests, never by lowering the threshold.**

| Metric     | Minimum |
| ---------- | ------- |
| Lines      | 80%     |
| Statements | 80%     |
| Branches   | 80%     |
| Functions  | 60%     |

Scope: `src/lib/**` and `src/hooks/**` (auth adapters, re-exports, and browser-only hooks excluded).

When adding new files to `src/lib/` or `src/hooks/`: write a colocated `*.test.ts(x)` in the same directory before committing. If the file is genuinely untestable (Clerk hooks, browser APIs), add it to the `coverage.exclude` list in `vitest.config.mts` with a comment explaining why.

### Bundle health checks (after every `pnpm analyze`)

Use `pnpm build 2>&1 | grep "First Load JS"` for a quick size summary without opening a browser.

Budgets — **fail if exceeded:**

- Main shared chunk: < 250 kb
- Per-route bundle: < 150 kb

Red flags to check in the treemap:

- `recharts` appearing in any route bundle → wrap with `next/dynamic()` immediately
- `date-fns` unexpectedly large → switch to named imports (`import { format } from 'date-fns'`)
- Any library duplicated (two blocks with the same name) → audit package versions
- Everything in one giant shared chunk → route-based splitting is broken

Route isolation — each route (`/`, `/dashboard`, `/login`) must have its own small chunk separate from the shared bundle.

### Auth pluggability rules (Phase 6 — Agency Model)

The active provider is selected by `NEXT_PUBLIC_AUTH_PROVIDER=clerk|next-auth|okta` (default: `clerk`).
**To switch providers: change the env var + implement the 4 stub files.** Nothing else changes.

**Import rules:**

- `src/lib/auth/adapters/clerk/server.ts` — **only** file allowed to import from `@clerk/nextjs/server`
- `src/lib/auth/adapters/clerk/client.ts` — **only** file allowed to import from `@clerk/nextjs` (hooks)
- `src/lib/auth.ts` and `src/hooks/use-user.ts` — the two public API entry points (never changes)
- All app code imports from `@/lib/auth` or `@/hooks/use-user` — **never** directly from `@clerk/nextjs`
- Provider UI components (`<UserButton />`, `<SignIn />`, `<SignUp />`) allowed at **route/page level only**, marked `// PROVIDER-SPECIFIC` comment

**Adding a new provider (4 steps):**

1. Create `src/lib/auth/adapters/<provider>/` with `server.ts`, `client.ts`, `provider.tsx`, `middleware.ts`
2. Add the new key to `AuthProviderKey` in `src/lib/auth/contracts.ts` — TypeScript will flag every registry switch missing the new case
3. Add `import * as <provider>Adapter` + `case '<provider>': return <provider>Adapter` to each of the 4 registry files
4. Set `NEXT_PUBLIC_AUTH_PROVIDER=<provider>` in `.env.local`, Vercel, and GitHub Variables

### Code rules

- **`packages/ui/src/` components are owned and editable** — shadcn/ui's philosophy is that components are copied into your repo for you to own. Edit them freely to fix bugs or adjust behavior. Add new components with `pnpm dlx shadcn@latest add <component>` (outputs to `packages/ui/src/` via `components.json`). Keep them generic — no app-specific imports (`@/config`, `@forge/brand`, `@forge/i18n`, etc.). App-specific logic belongs in `apps/web/src/components/`.
- **Never hardcode copy** in layout components — all text comes from `src/config/` or props
- **Never add `'use client'`** to Server Components (`MarketingLayout`, `DashboardLayout`, `AuthLayout`, `Footer`) unless the spec explicitly requires it
- **Never commit** build artifacts: `.next/`, `storybook-static/`, `out/`
- Use `cn()` from `lib/utils.ts` for all conditional className composition — never string concatenation
- Use `pnpm` — never `npm` or `yarn`

### i18n rules — every UI component and feature MUST follow these

- **No hardcoded user-visible strings in JSX** — ESLint rule `i18next/no-literal-string` enforces this at lint time (warns on violations in `src/**/*.tsx`)
- **Server Components** use `const t = await getTranslations('namespace')` from `next-intl/server`
- **Client Components** use `const t = useTranslations('namespace')` from `next-intl`
- **New translation namespace**: add keys to `src/messages/en.json` first, then mirror exact same keys in every other locale file (`fr.json`, etc.)
- **Nav items** — add `labelKey: 'keyName'` alongside `label` in `src/config/nav.ts`; the key must exist in the `sidebar` namespace in all message files
- **Adding a new locale**: (1) create `src/messages/<locale>.json`, (2) add the locale to `routing.locales` in `src/i18n/routing.ts`, (3) add to the `messageLoaders` map in `src/i18n/request.ts`, (4) add to the `localeFiles` map in `src/i18n/i18n.test.ts`
- **Vitest guardrails** (`src/i18n/i18n.test.ts`) — run `pnpm test run src/i18n/i18n.test.ts` after any message file change:
  - Key parity: all locale files must have identical keys to `en.json`
  - No empty values: no translation key may have an empty string
  - Locale coverage: `routing.locales` must match files on disk

### Performance rules

- **React.memo** — wrap all `'use client'` layout components (Navbar, AppSidebar, Topbar) and any component that receives stable props from a frequently-updating parent
- **useCallback** — wrap every event handler passed as a prop or used in a dependency array
- **useMemo** — wrap filtered/sorted arrays and expensive derived state; do NOT memoize plain `.map()` calls with no filtering
- **Dynamic imports** — use `next/dynamic()` for any component > ~50kb (charts, rich text editors, heavy modals)
- **Images** — always use `next/image` (never `<img>`); set explicit `width`/`height` or `fill` + `sizes` to avoid CLS
- **Server Components first** — keep components as Server Components unless they need state, effects, or browser APIs; `'use client'` boundary should be as deep (leaf) as possible
- Refer to `PERFORMANCE.md` for patterns, examples, and Core Web Vitals targets

### After completing any phase task

Update `memory/MEMORY.md`:

- Move the sub-task to the completed list
- Note any key decisions or patterns introduced
