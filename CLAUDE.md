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

## Guardrails — always follow these

### Before starting any phase task

1. Check `memory/MEMORY.md` to confirm which sub-tasks are already done — never re-implement completed work.
2. Read the relevant section of `docs/specs/nextjs-frontend-specs.md` to understand acceptance criteria.

### Gate checks — run ALL four before every commit

```bash
pnpm typecheck              # zero TS errors (ignoreBuildErrors masks them in build)
pnpm lint                   # zero errors, zero warnings (no-console fires on console.*)
pnpm build                  # production build must succeed
pnpm exec storybook build   # all stories must compile
```

Never skip or reorder these. A passing build alone is not sufficient.

### Code rules

- **Never edit** files in `src/components/ui/` — shadcn/ui primitives, add via `pnpm dlx shadcn@latest add <component>`
- **Never hardcode copy** in layout components — all text comes from `src/config/` or props
- **Never add `'use client'`** to Server Components (`MarketingLayout`, `DashboardLayout`, `AuthLayout`, `Footer`) unless the spec explicitly requires it
- **Never commit** build artifacts: `.next/`, `storybook-static/`, `out/`
- Use `cn()` from `lib/utils.ts` for all conditional className composition — never string concatenation
- Use `pnpm` — never `npm` or `yarn`

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
