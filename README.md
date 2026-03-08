# AgentForge

AI Agent Platform — built on Next.js 16, React 19, TypeScript, Tailwind CSS v4.

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_APP_ENV
pnpm dev
```

## Commands

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `pnpm dev`          | Start dev server at localhost:3000 |
| `pnpm build`        | Production build                   |
| `pnpm typecheck`    | TypeScript check                   |
| `pnpm lint`         | ESLint                             |
| `pnpm lint:fix`     | ESLint with auto-fix               |
| `pnpm format`       | Prettier format all files          |
| `pnpm format:check` | Check formatting                   |

---

## Theming & Branding

The design system is **token-based** — swapping an entire brand requires changing one file.

### How it works

All colors, radii, and font references are CSS custom properties defined in a single file:

```
src/styles/tokens.css   ← single source of truth for all CSS variables
src/app/globals.css     ← imports tokens.css, maps vars to Tailwind utilities
```

`tokens.css` defines two blocks:

```css
:root {
  /* light mode defaults */
}
.dark {
  /* dark mode overrides  */
}
```

`globals.css` maps those variables into Tailwind's `@theme inline` so utilities like `bg-brand-500`, `text-primary`, and `border-border` all resolve through the CSS var chain at runtime — no JS rebuild needed.

### Applying a new brand in one file

1. Open `src/styles/tokens.css`
2. Change `--color-brand-*` under `:root` and `.dark` — adjust the oklch hue (the third number) to shift the entire palette:

   ```css
   /* Purple (default) → hue 280 */
   --color-brand-500: oklch(0.57 0.17 280);

   /* Blue → change hue to 230 */
   --color-brand-500: oklch(0.57 0.17 230);

   /* Green → change hue to 145 */
   --color-brand-500: oklch(0.57 0.17 145);
   ```

3. Update `--primary` and `--ring` to reference your chosen brand shade
4. Save — all components update instantly, no rebuild

### Brand color scale

The `--color-brand-*` scale runs 50–900 in [oklch](https://oklch.com) color space, giving perceptually uniform lightness. Available as Tailwind utilities:

```
bg-brand-50  bg-brand-100  ...  bg-brand-900
text-brand-*   border-brand-*   ring-brand-*
```

### Dark mode

Dark mode is driven by the `.dark` class on `<html>`, managed by [`next-themes`](https://github.com/pacocoursey/next-themes):

```
layout.tsx
  └─ ThemeProvider (attribute="class", defaultTheme="system", enableSystem)
       └─ reads localStorage / system preference
       └─ toggles .dark on <html>
       └─ tokens.css .dark { } overrides all CSS vars
```

To toggle theme in a component:

```tsx
'use client'
import { useTheme } from '@/hooks/use-theme'

export function MyButton() {
  const { isDark, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{isDark ? '☀ Light' : '☾ Dark'}</button>
}
```

### Typography

Fonts are loaded via `next/font/google` in `layout.tsx` and exposed as CSS variables on `<html>`:

| Variable      | Font           | Tailwind class |
| ------------- | -------------- | -------------- |
| `--font-sans` | Inter          | `font-sans`    |
| `--font-mono` | JetBrains Mono | `font-mono`    |

To swap fonts, replace the `next/font` imports in `src/app/layout.tsx`.

### ThemeSwitcher (dev only)

A floating widget in the bottom-right corner of every page during `pnpm dev`. It toggles between light and dark mode. It returns `null` in production — zero DOM output, zero bundle cost.

### Theme presets

`src/config/themes/` exports CSS variable override maps for each brand:

```
src/config/themes/
├── default.ts   ← light mode brand vars
└── dark.ts      ← dark mode brand vars
```

Use these to apply brand changes programmatically, e.g. for a white-label client swap.

---

## Project Structure

```
src/
├── app/              Next.js App Router pages and layouts
├── components/
│   ├── ui/           shadcn/ui primitives + custom components
│   └── layout/       layout shells (nav, sidebar, footer)
├── config/
│   ├── env.ts        Zod-validated environment variables
│   └── themes/       CSS variable preset objects per brand
├── features/         feature modules (co-located components + actions)
├── hooks/            shared React hooks (useTheme, useMobile, useToast)
├── lib/              utilities (cn, api-client, content)
├── styles/
│   └── tokens.css    design tokens — the one file to change per brand
└── types/            shared TypeScript types
```
