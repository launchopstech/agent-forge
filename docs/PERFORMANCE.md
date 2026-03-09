# Performance Guide

## Memoization Pattern

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

## Core Web Vitals Targets

| Metric                          | Target   |
| ------------------------------- | -------- |
| LCP (Largest Contentful Paint)  | < 2.5 s  |
| INP (Interaction to Next Paint) | < 200 ms |
| CLS (Cumulative Layout Shift)   | < 0.1    |

Memoisation reduces INP by avoiding redundant reconciliation during user interactions
(navigation, sidebar toggle, etc.).

---

## Gate Checks (run before every commit)

```bash
pnpm typecheck          # zero TS errors
pnpm lint               # zero errors/warnings
pnpm build              # production build succeeds
pnpm exec storybook build  # all stories compile
```
