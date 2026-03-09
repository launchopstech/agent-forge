# Performance Guide

## 5.1 — Memoization Pattern (React.memo / useCallback / useMemo)

AgentForge layout components use `React.memo`, `useCallback`, and `useMemo` to prevent
unnecessary re-renders — a prerequisite for Core Web Vitals targets.

### React.memo

Wrap a component so it only re-renders when its props change (shallow comparison).

```tsx
export const MyComponent = React.memo(function MyComponent(props: MyProps) {
  return <div>{props.title}</div>
})
```

Applied to: `Navbar`, `AppSidebar`, `Topbar`, `Topbar > UserAvatarPlaceholder`, `Footer`.

> **Note:** `Footer` is a Server Component — `React.memo` is a no-op server-side but
> documents intent and is harmless if the component is ever moved client-side.

### useCallback

Stabilise event-handler references so child components wrapped in `React.memo` do not
re-render when the parent re-renders.

```tsx
// Before — new function reference on every render
<Link onClick={() => setOpen(false)}>…</Link>

// After — stable reference
const handleClose = useCallback(() => setOpen(false), [])
<Link onClick={handleClose}>…</Link>
```

Applied to: `Navbar` (`handleClose`).

### useMemo (future pattern)

When a component needs to **filter or sort** a nav array, wrap the computation:

```tsx
const visibleItems = useMemo(() => navItems.filter((item) => !item.hidden), [navItems])
```

**Not currently applied** — existing components do no filtering, so memoising a plain
`.map()` would add overhead with zero benefit. Add `useMemo` when filtering logic lands.

---

## 5.2 — Code Splitting & Dynamic Imports

Next.js automatically splits bundles per route. Confirmed from build output:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /dashboard
└ ○ /login
```

Each route ships only the JS it needs. No manual intervention required for route splitting.

### Dynamic import pattern

Use `next/dynamic()` for any heavy component (threshold: ~50 kb parsed). Always provide
a `loading` skeleton so the layout does not shift while the chunk loads.

```tsx
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  ssr: false, // disable SSR for browser-only libs
  loading: () => <Skeleton className="h-64 w-full" />,
})
```

### Identified candidates

| Candidate              | Package                      | Action                                               |
| ---------------------- | ---------------------------- | ---------------------------------------------------- |
| Charts                 | `recharts` (already in deps) | Wrap with `dynamic()` when first chart page is added |
| Rich text editor       | tbd                          | Wrap with `dynamic({ ssr: false })`                  |
| Heavy modals / drawers | tbd                          | Import dynamically if > 50 kb                        |

> **Rule:** do not add `dynamic()` pre-emptively. Apply it when `pnpm analyze` shows
> a chunk that pushes a route bundle over the 150 kb budget.

---

## 5.3 — Image Optimization

Always use `<ResponsiveImage>` from `src/components/ResponsiveImage.tsx` — never a bare
`<img>` tag or unwrapped `next/image`.

```tsx
import { ResponsiveImage } from '@/components/ResponsiveImage'
;<ResponsiveImage
  src="/hero.jpg"
  alt="Hero illustration"
  width={1200}
  height={600}
  priority // add for above-the-fold images (improves LCP)
  sizes="100vw" // override default when image is full-width
/>
```

### Why

- Enforces explicit `alt` text (accessibility + SEO)
- Default `sizes` prevents browser from downloading an oversized image
- `object-cover` default prevents layout shifts

### Allowed remote domains (`next.config.mjs` → `remotePatterns`)

| Domain                          | Use case             |
| ------------------------------- | -------------------- |
| `images.unsplash.com`           | Stock photos         |
| `res.cloudinary.com`            | Cloudinary CDN       |
| `*.amazonaws.com`               | S3 / CloudFront      |
| `avatars.githubusercontent.com` | GitHub avatars       |
| `lh3.googleusercontent.com`     | Google OAuth avatars |

Add new domains to `next.config.mjs` — never use `unoptimized: true`.

---

## 5.4 — Bundle Analysis

### Running the analyzer

```bash
pnpm analyze
```

Opens two treemap reports in the browser — client and server bundles. Look for:

- Any single chunk > 250 kb (main bundle budget)
- Any route bundle > 150 kb (per-route budget)
- Unexpected duplicates (e.g. two copies of a library)

### Performance budgets

| Budget                 | Limit    |
| ---------------------- | -------- |
| Main bundle            | < 250 kb |
| Per-route bundle       | < 150 kb |
| First Contentful Paint | < 1.5 s  |
| Time to Interactive    | < 3 s    |

### Baseline (Phase 5.4, March 2026)

Measured from `pnpm build` output before bundle analyzer was added.
Route bundles from Next.js build:

```
Route (app)    Size     First Load JS
/              ~180 kb  (shared chunks included)
/dashboard     ~180 kb
/login         ~180 kb
```

> Re-run `pnpm analyze` after adding any new heavy dependency and ensure no budget
> is exceeded before merging.

---

## Core Web Vitals Targets

| Metric                          | Target   |
| ------------------------------- | -------- |
| LCP (Largest Contentful Paint)  | < 2.5 s  |
| INP (Interaction to Next Paint) | < 200 ms |
| CLS (Cumulative Layout Shift)   | < 0.1    |

---

## Gate Checks (run before every commit)

```bash
pnpm typecheck             # zero TS errors
pnpm lint                  # zero errors/warnings
pnpm build                 # production build succeeds
pnpm exec storybook build  # all stories compile
```
