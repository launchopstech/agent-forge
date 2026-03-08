# Next.js Frontend — Agent Build Spec v2

**Project:** Scalable, white-label-ready Next.js frontend
**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Vercel
**Objective:** Build a reusable, agency-ready template codebase with zero branding lock-in, full test coverage, and a human-in-the-loop visual review system

---

## How to Use This Spec

- Work through phases **in order** — each phase unblocks the next
- Each task is self-contained and executable without clarification
- Mark tasks `[x]` as completed before moving on
- When a task says "create", produce the file. When it says "configure", edit an existing file.
- At the end of every phase, run the **Phase Gate Check** before proceeding

---

## Key Principles (Apply to Every Task)

1. **No hardcoded copy** — all text, labels, nav items come from config files or props
2. **No hardcoded colors** — all colors reference CSS variables from `tokens.css`
3. **All components accept `className`** — never block customization
4. **Prefer composition over configuration** — small components assembled, not monolithic ones configured
5. **Types for everything** — no `any`, no untyped API responses
6. **One source of truth per concern** — auth in `lib/auth.ts`, site config in `config/site.ts`, nav in `config/nav.ts`
7. **Every component gets a Story** — no component is "done" until it has a Storybook story
8. **Every utility gets a test** — no `lib/` function ships without a Vitest unit test

---

## Phase 1 — Project Foundation

_Goal: Non-negotiable architectural decisions before any UI is built._

### 1.1 TypeScript & ESLint Hardening

- [x] Enable `strict: true` in `tsconfig.json`
- [x] Add `noUncheckedIndexedAccess: true` to `tsconfig.json`
- [x] Install and configure `eslint-config-next` with custom rules:
  - `no-console: warn`
  - `@typescript-eslint/no-explicit-any: error`
  - `@typescript-eslint/consistent-type-imports: error`
- [x] Add `.eslintignore` for `node_modules`, `.next`, `dist`, `storybook-static`

### 1.2 Absolute Imports & Path Aliases

- [x] Configure `tsconfig.json` paths:
  ```json
  {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/features/*": ["./src/features/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/hooks/*": ["./src/hooks/*"],
    "@/types/*": ["./src/types/*"],
    "@/config/*": ["./src/config/*"]
  }
  ```

### 1.3 Folder Structure

- [x] Scaffold under `src/`:
  ```
  src/
  ├── app/
  ├── components/
  │   ├── ui/
  │   └── layout/
  ├── features/
  ├── hooks/
  ├── lib/
  ├── config/
  ├── styles/
  └── types/
  ```
- [x] Add `index.ts` barrel exports to each directory

### 1.4 Environment Config Validation

- [x] Install `zod`
- [x] Create `src/config/env.ts` — validates all `process.env` values with Zod, throws descriptive error on startup if required vars are missing
- [x] Create `.env.example` with all keys documented
- [x] Add `.env.local` to `.gitignore`

### 1.5 Pre-commit Hooks

- [x] Install `husky` and `lint-staged`
- [x] Configure `lint-staged`: run `eslint --fix` on `*.ts/*.tsx`, `prettier --write` on all staged files
- [x] Add `husky pre-commit` hook that runs `lint-staged`
- [x] Add `husky commit-msg` hook enforcing conventional commit format

### ✅ Phase 1 Gate Check

```bash
npx tsc --noEmit          # Must pass with zero errors
npx eslint src/           # Must pass with zero errors
```

---

## Phase 2 — Design System & Theming

_Goal: Token-based design system — swap any brand in one config file._

### 2.1 Tailwind Design Tokens

- [x] Extend Tailwind v4 via `@theme inline` in `globals.css` (no `tailwind.config.ts` in v4):
  - `--color-brand-50` through `--color-brand-900` brand scale
  - `--color-surface`, `--color-muted`, `--color-border` semantic aliases
  - `--font-sans`, `--font-mono`, `--radius-*` variants
- [x] Create `src/styles/tokens.css` with all CSS custom properties for the default theme
- [x] Import `tokens.css` in `app/globals.css`

### 2.2 Dark Mode

- [x] Configure Tailwind `darkMode: 'class'` via `@custom-variant dark (&:is(.dark *))` in globals.css
- [x] Add dark mode overrides under `.dark { }` in `tokens.css`
- [x] Create `src/hooks/use-theme.ts` — reads localStorage, syncs with system preference, exposes `theme`, `setTheme`, `toggleTheme`
- [x] Wire `ThemeProvider` into `layout.tsx` with `attribute="class" defaultTheme="system" enableSystem`

### 2.3 Typography Scale

- [x] Install and configure `next/font` with Inter (sans) + JetBrains Mono (mono) via `next/font/google`
- [x] Expose as CSS variables `--font-sans` / `--font-mono` applied to `<html>` — feed into Tailwind `@theme inline`

### 2.4 Theme Presets

- [x] Create `src/config/themes/default.ts` and `src/config/themes/dark.ts` — each exports CSS variable overrides
- [x] Create `ThemeSwitcher` dev-only component (hidden via `process.env.NODE_ENV !== 'development'` check)

### ✅ Phase 2 Gate Check

- [x] `pnpm typecheck` — zero errors
- [x] `pnpm lint` — zero errors
- [x] `pnpm build` — compiles successfully
- [x] Open app in browser — default theme loads correctly
- [x] Toggle dark mode — all tokens switch, no hardcoded colors visible
- [x] `ThemeSwitcher` visible in dev, hidden in production build

---

## Phase 3 — Core UI Component Library

_Goal: Composable, accessible primitives. Every component ships with a Storybook story._

### 3.1 Setup

- [x] Install `class-variance-authority`, `clsx`, `tailwind-merge`
- [x] Create `src/lib/utils.ts` with `cn()` helper combining `clsx` + `twMerge`
- [x] Install Radix UI primitives: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`

### 3.2 Primitive Components

Each must have: TypeScript props interface, cva variants, `className` passthrough, `forwardRef`, and a `.stories.tsx` file.

- [x] `Button` — variants: `default | outline | ghost | destructive | link`; sizes: `sm | md | lg`; loading state with spinner
- [x] `Input` — with label, error state, helper text, disabled state
- [x] `Textarea` — same pattern as Input
- [x] `Select` — with label, error state
- [x] `Checkbox` — accessible, with label, indeterminate state
- [x] `Badge` — variants: `default | success | warning | destructive | outline`
- [x] `Avatar` — with image, fallback initials, size variants
- [x] `Spinner` — size variants, inherits color from parent
- [x] `Separator` — horizontal and vertical

### 3.3 Composite Components

Each must have a `.stories.tsx` file showing all states.

- [x] `Card` — with `CardHeader`, `CardContent`, `CardFooter` sub-components
- [x] `Dialog` — using Radix, with `DialogHeader`, `DialogFooter`, controlled and uncontrolled modes
- [x] `DropdownMenu` — using Radix, with items, separators, icons
- [x] `Toast` — singleton provider pattern, expose `useToast()` hook with `success | error | warning | info` variants
- [x] `Tooltip` — using Radix, configurable delay
- [x] `Tabs` — using Radix, with controlled and uncontrolled modes
- [x] `Skeleton` — variants: `SkeletonText`, `SkeletonAvatar`, `SkeletonCard`, `SkeletonBlock`
- [x] `EmptyState` — icon slot, title, description, CTA slot

### 3.4 Form Pattern

- [x] Install `react-hook-form` and `@hookform/resolvers`
- [x] Create `FormField` wrapper that integrates `react-hook-form` context with Input/Select/Textarea
- [x] Create `src/features/example/ExampleForm.tsx` demonstrating: Zod schema, validation, error display, submit state

### ✅ Phase 3 Gate Check

- [x] Run Storybook — every component renders in all variants without errors
- [x] No TypeScript errors in component files
- [x] Dark mode toggle in Storybook — all components adapt correctly

---

## Phase 4 — Layout Architecture

_Goal: Flexible multi-layout shells, all white-label ready._

### 4.1 Root Layout

- [x] `app/layout.tsx` — wraps in `ThemeProvider`, injects fonts, sets metadata defaults
- [x] No hardcoded text anywhere in layout files

### 4.2 Layout Variants

- [x] `DashboardLayout` — sidebar + topbar + main content area
- [x] `MarketingLayout` — full-width navbar + hero slot + footer
- [x] `AuthLayout` — centered card layout
- [x] Each accepts `children` + optional config props (`showSidebar`, `showFooter`, etc.)

### 4.3 Navigation Components

- [x] `Navbar` — responsive, mobile hamburger, accepts `navItems: NavItem[]` prop
- [x] `Sidebar` — collapsible, icon + label, accepts `navItems: NavItem[]` prop
- [x] `Footer` — accepts `links` and `copyrightText` as props
- [x] Create `src/config/nav.ts` — all nav items defined here, zero hardcoded nav copy in components

### 4.4 Page Templates

- [x] `src/app/(marketing)/page.tsx` — landing page shell
- [x] `src/app/(dashboard)/dashboard/page.tsx` — dashboard shell
- [x] `src/app/(auth)/login/page.tsx` — auth shell
- [x] `src/app/not-found.tsx` — polished 404
- [x] `src/app/error.tsx` — global error boundary UI

### 4.5 Layout Storybook Stories

- [x] Create `src/components/layout/DashboardLayout.stories.tsx`:
  - Set `parameters: { layout: 'fullscreen' }`
  - Stories: Default, WithSidebar, WithoutSidebar
  - Include mock content in children prop
- [x] Create `src/components/layout/MarketingLayout.stories.tsx`:
  - Set `parameters: { layout: 'fullscreen' }`
  - Stories: Default, WithFooter, WithoutFooter
  - Include hero section mock content
- [x] Create `src/components/layout/AuthLayout.stories.tsx`:
  - Set `parameters: { layout: 'fullscreen' }`
  - Stories: Default, WithLogo, Centered
  - Include login form mock content
- [x] Create stories for navigation components:
  - `Navbar.stories.tsx` — mobile and desktop states
  - `Sidebar.stories.tsx` — collapsed and expanded states
  - `Footer.stories.tsx` — with various link configurations

### ✅ Phase 4 Gate Check

- [x] Run Storybook: `npm run storybook`
  - DashboardLayout story renders with sidebar toggle working
  - MarketingLayout story renders with navbar and footer
  - AuthLayout story renders with centered card
  - Navbar story shows mobile hamburger state
  - Sidebar story shows collapsed/expanded states
- [x] Run dev server: `npm run dev`
  - Visit /dashboard — DashboardLayout renders correctly
  - Visit / — MarketingLayout renders correctly
  - Visit /login — AuthLayout renders correctly
- [x] Mobile responsive check (resize browser to 375px width):
  - Navbar collapses to hamburger menu
  - Sidebar is hidden on mobile or shows toggle button
  - All layouts are mobile-friendly
- [x] No hardcoded copy anywhere in layout files:
  ```bash
  grep -r "Copyright\|Home\|Dashboard\|Login\|About\|Contact" src/components/layout/
  # Should return zero results (all copy comes from config files)
  ```
- [x] TypeScript check passes: `npx tsc --noEmit`
- [x] All layout components accept className prop and forward refs where needed

---

## Phase 5 — Performance & Optimization

_Goal: Core Web Vitals-ready out of the box._

### 5.1 Image Optimization

- [ ] Wrap `next/image` in a `ResponsiveImage` component with sensible `sizes` defaults and a `priority` prop
- [ ] Add `remotePatterns` to `next.config.ts` for common CDN domains

### 5.2 Bundle Analysis

- [ ] Install `@next/bundle-analyzer`
- [ ] Add `"analyze": "ANALYZE=true next build"` npm script
- [ ] Run analysis once, document baseline in `PERFORMANCE.md`

### 5.3 Loading States

- [ ] Add `loading.tsx` to each major route group
- [ ] All async components wrapped in Suspense with Skeleton fallbacks from Phase 3

### 5.4 Metadata & SEO

- [ ] Create `src/config/site.ts` — site name, description, OG image URL, base URL
- [ ] Create `generateMetadata()` utility merging page overrides with site defaults
- [ ] Add `robots.ts` and `sitemap.ts` route handlers
- [ ] Root layout includes OG and Twitter card tags driven by `site.ts`

### ✅ Phase 5 Gate Check

```bash
npm run build             # Must complete with no errors
npm run analyze           # Review output, no single chunk > 250kb
```

---

## Phase 6 — Auth Scaffolding

_Goal: Plug-in-ready auth, not tied to any specific provider._

### 6.1 Auth Abstraction

- [ ] Install `next-auth` or `@clerk/nextjs` (document the choice in README)
- [ ] Create `src/lib/auth.ts` as single source of auth config
- [ ] Expose: `getSession()`, `requireAuth()` server utilities, `useUser()` client hook

### 6.2 Route Protection

- [ ] Create `middleware.ts` protecting `/dashboard/*`
- [ ] Create `withAuth` HOC for client-side page protection
- [ ] Auth route group: login, signup, forgot-password pages (UI shells, no logic yet)

### 6.3 User Context

- [ ] `UserProvider` wraps root layout
- [ ] `useUser()` hook exposes `user`, `isLoading`, `isAuthenticated`
- [ ] User avatar + name rendered in Topbar from `useUser()`

### ✅ Phase 6 Gate Check

- [ ] Visiting `/dashboard` unauthenticated redirects to `/login`
- [ ] Visiting `/dashboard` authenticated renders correctly
- [ ] `src/lib/auth.ts` is the only file referencing the auth provider package directly

---

## Phase 7 — Data Layer Abstraction

_Goal: UI components stay agnostic to data source._

### 7.1 API Client

- [ ] Create `src/lib/api-client.ts` — typed fetch wrapper with base URL from env, auth token injection, error normalization, TypeScript generics: `apiClient.get<User>('/me')`

### 7.2 Server Actions Pattern

- [ ] Create `src/features/example/actions.ts` demonstrating: Zod input validation → action → typed response

### 7.3 CMS-Ready Content Layer

- [ ] Create `src/lib/content.ts` with abstract functions: `getPage(slug)`, `getPosts()`, `getPost(slug)`
- [ ] Implement with static JSON for now, add `// TODO: swap with Contentful/Sanity` comment at each function

### ✅ Phase 7 Gate Check

- [ ] `npx tsc --noEmit` passes
- [ ] API client returns correct TypeScript types (verify with a test call)

---

## Phase 8 — Testing Infrastructure

_Goal: Automated quality gates that run in CI. Three layers: unit, component, and E2E._

### 8.1 Vitest — Unit Tests

- [ ] Install `vitest`, `@vitest/ui`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`
- [ ] Configure `vitest.config.ts` with jsdom environment and path aliases matching `tsconfig.json`
- [ ] Add npm scripts:
  - `"test": "vitest"`
  - `"test:ui": "vitest --ui"`
  - `"test:coverage": "vitest run --coverage"`
- [ ] Write unit tests for every function in `src/lib/`:
  - [ ] `cn()` utility — tests: merges classes, handles conditionals, resolves Tailwind conflicts
  - [ ] `api-client.ts` — tests: correct headers, error normalization, generic types
  - [ ] `env.ts` — tests: throws on missing required vars, parses correctly
  - [ ] `content.ts` — tests: returns expected shape for each function
- [ ] Write component behavior tests for:
  - [ ] `Button` — renders, calls `onClick`, disabled state prevents click, shows spinner in loading state
  - [ ] `Input` — renders label, shows error message, calls `onChange`
  - [ ] `Toast` / `useToast` — calling `toast.success()` renders toast, dismisses on close
  - [ ] `ExampleForm` — validation errors show on submit with empty fields, submits with valid data

### 8.2 Playwright — End-to-End Tests

- [ ] Install `@playwright/test`, run `npx playwright install`
- [ ] Create `playwright.config.ts` — base URL from env, 3 browsers (chromium, firefox, webkit), screenshot on failure
- [ ] Add npm scripts:
  - `"test:e2e": "playwright test"`
  - `"test:e2e:ui": "playwright test --ui"`
- [ ] Write E2E tests:
  - [ ] `tests/e2e/navigation.spec.ts` — homepage loads, all nav links resolve without 404
  - [ ] `tests/e2e/auth.spec.ts` — unauthenticated redirect to login, login form renders
  - [ ] `tests/e2e/theme.spec.ts` — dark mode toggle persists across page reload
  - [ ] `tests/e2e/404.spec.ts` — unknown routes render the 404 page

### 8.3 Accessibility Tests

- [ ] Install `axe-core` and `@axe-core/playwright`
- [ ] Add accessibility check to each Playwright test:
  ```ts
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
  expect(accessibilityScanResults.violations).toEqual([])
  ```
- [ ] Add `@axe-core/react` to Storybook config for per-story a11y panel

### ✅ Phase 8 Gate Check

```bash
npm run test              # All Vitest unit tests pass
npm run test:coverage     # Coverage > 80% on src/lib/
npm run test:e2e          # All Playwright tests pass in chromium
```

---

## Phase 9 — Storybook & Visual Review System

_Goal: Human-in-the-loop component review with automated visual regression._

### 9.1 Storybook Setup

- [ ] Install `@storybook/nextjs`, `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-themes`
- [ ] Configure `.storybook/main.ts`:
  - Enable Next.js framework
  - Add path aliases matching `tsconfig.json`
  - Import `globals.css` and `tokens.css`
- [ ] Configure `.storybook/preview.ts`:
  - Wrap all stories in `ThemeProvider`
  - Add theme toggle toolbar button (light / dark)
  - Set default viewport to desktop
- [ ] Add npm scripts:
  - `"storybook": "storybook dev -p 6006"`
  - `"storybook:build": "storybook build"`
- [ ] Deploy Storybook to Vercel as a separate project (or subdirectory) so it's always accessible at a URL

### 9.2 Story Files

Each story file must cover: default state, all variants, all sizes, error/disabled states, dark mode.

- [ ] `Button.stories.tsx` — all variants × sizes, loading state, disabled state, icon button
- [ ] `Input.stories.tsx` — default, with label, error state, disabled, with helper text
- [ ] `Badge.stories.tsx` — all variants
- [ ] `Card.stories.tsx` — empty, with header/footer, loading skeleton version
- [ ] `Dialog.stories.tsx` — open/closed, with form inside
- [ ] `Toast.stories.tsx` — all 4 variants triggered via button
- [ ] `Skeleton.stories.tsx` — all skeleton types, animated
- [ ] `EmptyState.stories.tsx` — with/without CTA
- [ ] `Navbar.stories.tsx` — desktop and mobile viewport
- [ ] `Sidebar.stories.tsx` — expanded and collapsed
- [ ] `ExampleForm.stories.tsx` — idle, validation errors, submitting, success

### 9.3 Visual Regression with Chromatic

- [ ] Create Chromatic account and connect to the GitHub repo
- [ ] Install `chromatic` package
- [ ] Add npm script: `"chromatic": "chromatic --project-token=$CHROMATIC_PROJECT_TOKEN"`
- [ ] Add `CHROMATIC_PROJECT_TOKEN` to Vercel and GitHub Actions secrets
- [ ] Chromatic runs on every PR and blocks merge until visual changes are approved

### 9.4 Human-in-the-Loop Preview Page

- [ ] Create `src/app/_dev/preview/page.tsx` (only accessible in development — add a middleware guard that returns 404 in production)
- [ ] Page renders a full component catalog:
  - Section per component group (Primitives, Composite, Layout, Forms)
  - Every component shown in all variants side by side
  - Live theme switcher at the top to preview token changes instantly
  - Dark/light toggle
- [ ] Page renders a **QA Checklist** sidebar with checkboxes for:
  - [ ] Renders in light mode
  - [ ] Renders in dark mode
  - [ ] Mobile responsive (test at 375px)
  - [ ] Keyboard navigable
  - [ ] No console errors
  - [ ] Accessible (run axe)
- [ ] Checklist state persists in `localStorage` so you can track progress per session
- [ ] Add a link to the preview page in the README under "Development"

### ✅ Phase 9 Gate Check

- [ ] `npm run storybook` — opens without errors, all stories render in both light and dark mode
- [ ] `npm run chromatic` — runs successfully and registers baseline screenshots
- [ ] `/_dev/preview` — renders all components, theme switcher works, checklist state saves

---

## Phase 10 — CI/CD Pipeline

_Goal: Every PR runs all quality gates automatically. Nothing merges without passing._

### 10.1 GitHub Actions CI

- [ ] Create `.github/workflows/ci.yml`:
  ```yaml
  on: [push, pull_request]
  jobs:
    quality:
      steps:
        - npm ci
        - npx tsc --noEmit
        - npx eslint src/
        - npm run test
        - npm run build
    e2e:
      steps:
        - npm ci
        - npx playwright install --with-deps
        - npm run test:e2e
    visual:
      steps:
        - npm ci
        - npm run chromatic
  ```
- [ ] Set branch protection rules on `main`: require all 3 jobs to pass before merge

### 10.2 PR Workflow

- [ ] Vercel preview deployments enabled — every PR gets a preview URL
- [ ] Add Storybook build to Vercel — deployed at `storybook.yourproject.vercel.app`
- [ ] Add PR comment bot that posts: preview URL, Storybook URL, Chromatic review link

### ✅ Phase 10 Gate Check

- [ ] Open a test PR — all 3 CI jobs run and pass
- [ ] Chromatic posts a review link in the PR
- [ ] Vercel posts a preview deployment link in the PR

---

## Phase 11 — Developer Experience & Documentation

_Goal: Handoff-ready for agency clients or new team members._

### 11.1 README

- [ ] Project overview and tech stack
- [ ] Setup: clone → install → `.env` → run
- [ ] Folder structure explanation
- [ ] How to add a new feature module
- [ ] How to apply a new brand/theme (the one-file swap)
- [ ] How to run tests (unit, E2E, Storybook, Chromatic)
- [ ] Link to live Storybook
- [ ] Link to `/_dev/preview`

### 11.2 Additional Docs

- [ ] `CONTRIBUTING.md` — code style, PR process, conventional commits
- [ ] `PERFORMANCE.md` — baseline bundle sizes, Lighthouse scores
- [ ] `THEMING.md` — how to create a new theme preset, token reference

### 11.3 i18n Scaffolding

- [ ] Install `next-intl`
- [ ] Set up locale routing under `src/app/[locale]/`
- [ ] Create `src/messages/en.json` as default locale
- [ ] Document how to add a new locale in README

---

## Phase 12 — White-Labeling & Deployment

_Goal: Multi-tenant brand switching, environment setup, and production deployment._

### 12.1 Brand Config System

- [ ] Create `src/config/brands/` folder structure:
  ```
  src/config/brands/
  ├── index.ts           # exports activeBrand
  ├── types.ts           # BrandConfig interface
  ├── default.ts         # default brand config
  ├── client-a.ts        # client A overrides
  └── client-b.ts        # client B overrides
  ```
- [ ] Define `BrandConfig` type in `types.ts`:
  ```typescript
  export interface BrandConfig {
    name: string
    logo: string
    favicon: string
    theme: string
    colors: Record<string, any>
    fonts: { sans: string; mono: string }
    metadata: {
      title: string
      description: string
      ogImage: string
    }
    nav: Array<{ label: string; href: string }>
    footer: {
      copyrightText: string
      links: Array<{ label: string; href: string }>
    }
  }
  ```
- [ ] Create `default.ts` brand config with placeholder values
- [ ] Create `client-a.ts` and `client-b.ts` with brand-specific overrides
- [ ] Create `src/config/brands/index.ts` with brand selection logic:

  ```typescript
  import type { BrandConfig } from './types'

  const ACTIVE_BRAND = process.env.NEXT_PUBLIC_BRAND || 'default'

  const brands: Record<string, () => Promise<{ brandConfig: BrandConfig }>> = {
    default: () => import('./default'),
    'client-a': () => import('./client-a'),
    'client-b': () => import('./client-b'),
  }

  export const getBrand = async () => {
    const brand = await brands[ACTIVE_BRAND]?.()
    if (!brand) throw new Error(`Brand "${ACTIVE_BRAND}" not found`)
    return brand.brandConfig
  }

  // For client components (sync access)
  export { brandConfig as activeBrand } from './default'
  ```

### 12.2 Environment-Based Brand Selection

- [ ] Add `NEXT_PUBLIC_BRAND` to `.env.example`:
  ```bash
  # Brand selection (default, client-a, client-b)
  NEXT_PUBLIC_BRAND=default
  ```
- [ ] Update `src/config/env.ts` to validate brand:
  ```typescript
  NEXT_PUBLIC_BRAND: z.enum(['default', 'client-a', 'client-b']).default('default'),
  ```
- [ ] Add brand-specific build scripts to `package.json`:
  ```json
  {
    "scripts": {
      "build:default": "next build",
      "build:client-a": "NEXT_PUBLIC_BRAND=client-a next build",
      "build:client-b": "NEXT_PUBLIC_BRAND=client-b next build"
    }
  }
  ```

### 12.3 Dynamic Theme & Metadata Injection

- [ ] Update `app/layout.tsx` to consume brand config for metadata:

  ```typescript
  import { getBrand } from '@/config/brands'

  export async function generateMetadata() {
    const brand = await getBrand()
    return {
      title: brand.metadata.title,
      description: brand.metadata.description,
      icons: { icon: brand.favicon },
      openGraph: { images: [brand.metadata.ogImage] },
    }
  }
  ```

- [ ] Update `app/layout.tsx` to apply brand fonts:
  ```typescript
  export default async function RootLayout({ children }) {
    const brand = await getBrand()
    return (
      <html lang="en" className={brand.fonts.sans}>
        <body>
          <ThemeProvider theme={brand.theme}>
            {children}
          </ThemeProvider>
        </body>
      </html>
    )
  }
  ```
- [ ] Update `Navbar` to use brand nav items from config (no hardcoded nav)
- [ ] Update `Footer` to use brand footer config

### 12.4 Brand-Specific Assets

- [ ] Create `public/brands/` folder structure:
  ```
  public/brands/
  ├── default/
  │   ├── logo.svg
  │   ├── favicon.ico
  │   └── og.png
  ├── client-a/
  │   ├── logo.svg
  │   ├── favicon.ico
  │   └── og.png
  └── client-b/
      ├── logo.svg
      ├── favicon.ico
      └── og.png
  ```
- [ ] Add placeholder assets for each brand
- [ ] Verify no hardcoded asset paths in components (all use brand config)

### 12.5 Vercel Environment Setup

- [ ] Create Vercel project (if not exists)
- [ ] Configure environment variables in Vercel:
  - **Production**: Set `NEXT_PUBLIC_BRAND=client-a` (or desired brand)
  - **Preview (staging branch)**: Set `NEXT_PUBLIC_BRAND=client-b` with branch filter
  - **Preview (other branches)**: Set `NEXT_PUBLIC_BRAND=default`
- [ ] Set build command per environment:
  - Production: `npm run build:client-a`
  - Preview: Use branch-based env var switching
- [ ] Test deployment triggers for each environment

### 12.6 Domain Setup (GoDaddy + Vercel)

- [ ] Plan domain structure:
  - Production: `example.com` (+ `www.example.com`)
  - Staging: `staging.example.com`
  - Preview: branch-based Vercel URLs or `*.preview.example.com` (optional wildcard)
- [ ] Add domains in Vercel:
  - Project → Settings → Domains → Add each domain
  - Set branch filters for staging domain (map to staging branch)
- [ ] Configure DNS in GoDaddy:
  - Apex (`example.com`): A record → `76.76.21.21`
  - `www`: CNAME → `cname.vercel-dns.com`
  - `staging`: CNAME → `cname.vercel-dns.com`
  - (Optional) `*.preview`: CNAME → `cname.vercel-dns.com`
- [ ] Verify domains in Vercel (wait for DNS propagation)
- [ ] Confirm SSL certificates are provisioned automatically

### 12.7 CI/CD Environment-Specific Updates

- [ ] Update GitHub Actions workflow to run tests per environment:
  ```yaml
  - name: Test (default brand)
    run: NEXT_PUBLIC_BRAND=default npm run test
  - name: Test (client-a brand)
    run: NEXT_PUBLIC_BRAND=client-a npm run test
  ```
- [ ] Add environment-specific build validation:
  ```yaml
  - name: Build all brands
    run: |
      npm run build:default
      npm run build:client-a
      npm run build:client-b
  ```
- [ ] Update Chromatic workflow to capture visual diffs per brand (optional)

### 12.8 Multi-Tenant Domain Mapping (Optional Advanced)

If multiple brands need to run from the same deployment on different domains:

- [ ] Create `middleware.ts` to detect domain and set brand header:

  ```typescript
  import { NextResponse } from 'next/server'

  const DOMAIN_BRAND_MAP = {
    'client-a.com': 'client-a',
    'client-b.com': 'client-b',
    'localhost:3000': 'default',
  }

  export function middleware(request) {
    const host = request.headers.get('host') || ''
    const brand = DOMAIN_BRAND_MAP[host] || 'default'
    const response = NextResponse.next()
    response.headers.set('x-brand', brand)
    return response
  }
  ```

- [ ] Update `getBrand()` to read from request headers:

  ```typescript
  import { headers } from 'next/headers'

  export const getBrand = async () => {
    const headersList = headers()
    const brand = headersList.get('x-brand') || process.env.NEXT_PUBLIC_BRAND || 'default'
    return (await brands[brand]()).brandConfig
  }
  ```

- [ ] Map multiple domains to same Vercel project
- [ ] Test brand switching via domain in production

### ✅ Phase 12 Gate Check

```bash
# Test brand switching locally
NEXT_PUBLIC_BRAND=default npm run dev    # Default branding loads
NEXT_PUBLIC_BRAND=client-a npm run dev   # Client A branding loads
NEXT_PUBLIC_BRAND=client-b npm run dev   # Client B branding loads

# Verify no hardcoded brand names in components
grep -r "Client A\|default-brand\|hardcoded-company" src/components/
# Should return zero results

# Verify all environments build successfully
npm run build:default
npm run build:client-a
npm run build:client-b

# Verify domain DNS (after GoDaddy setup)
dig example.com           # Should resolve to Vercel IP
dig staging.example.com   # Should resolve to Vercel
```

---

### 13 Pending TODOs

- [ ] Setup envivornments in Vercel
- [ ] Setup domains in GoDaddy
- [ ] Update CI as per enviornment

## Master Completion Checklist

| Phase | Description                 | Gate Check                             | Status |
| ----- | --------------------------- | -------------------------------------- | ------ |
| 1     | Project Foundation          | `tsc` + `eslint` pass                  | ⬜     |
| 2     | Design System & Theming     | Tokens load, dark mode works           | ⬜     |
| 3     | Core UI Components          | All stories render                     | ⬜     |
| 4     | Layout Architecture         | All layouts render, no hardcoded copy  | ⬜     |
| 5     | Performance                 | Build passes, no chunk > 250kb         | ⬜     |
| 6     | Auth Scaffolding            | Redirect works, one auth file          | ⬜     |
| 7     | Data Layer                  | Types pass, API client works           | ⬜     |
| 8     | Testing Infrastructure      | Unit + E2E pass, >80% coverage         | ⬜     |
| 9     | Storybook & Visual Review   | Stories render, Chromatic baseline set | ⬜     |
| 10    | CI/CD Pipeline              | All 3 CI jobs pass on test PR          | ⬜     |
| 11    | Docs & DX                   | README complete, i18n scaffolded       | ⬜     |
| 12    | White-Labeling & Deployment | Brands switch, domains live, CI passes | ⬜     |
| 13    | Pending TODOs               |                                        | ⬜     |

---

## Quick Reference: Test Commands

```bash
# Type checking
npx tsc --noEmit

# Linting
npx eslint src/

# Unit tests
npm run test
npm run test:ui           # visual test runner
npm run test:coverage     # with coverage report

# E2E tests
npm run test:e2e
npm run test:e2e:ui       # visual playwright runner

# Component development
npm run storybook

# Visual regression
npm run chromatic

# Bundle analysis
npm run analyze

# Full CI simulation (run before opening a PR)
npm run build && npm run test && npm run test:e2e
```
