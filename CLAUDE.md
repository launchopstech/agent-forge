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