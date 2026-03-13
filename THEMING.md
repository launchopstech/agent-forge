# Theming Guide

AgentForge uses a **token-based design system** — every color, radius, and font is a CSS custom property defined in one file. Switching brands requires no rebuild.

---

## The One File to Change

```
src/styles/tokens.css
```

This file defines all design tokens as CSS custom properties. Light and dark variants are defined in `:root` and `.dark` blocks respectively.

---

## Token Reference

### Brand Colors (OKLCH)

```css
/* src/styles/tokens.css */

:root {
  --color-brand-50: oklch(0.97 0.02 280);
  --color-brand-100: oklch(0.94 0.04 280);
  --color-brand-200: oklch(0.89 0.07 280);
  --color-brand-300: oklch(0.82 0.11 280);
  --color-brand-400: oklch(0.72 0.15 280);
  --color-brand-500: oklch(0.57 0.17 280); /* ← primary brand hue */
  --color-brand-600: oklch(0.48 0.17 280);
  --color-brand-700: oklch(0.39 0.15 280);
  --color-brand-800: oklch(0.31 0.12 280);
  --color-brand-900: oklch(0.23 0.09 280);
}
```

**To change the brand color**, update the hue value (third argument) across all `--color-brand-*` tokens:

| Hue | Color            |
| --- | ---------------- |
| 280 | Purple (default) |
| 230 | Blue             |
| 145 | Green            |
| 30  | Orange           |
| 10  | Red              |

### Semantic Tokens

These map brand values to semantic UI roles:

| Token                        | Usage                            |
| ---------------------------- | -------------------------------- |
| `--color-primary`            | Primary actions (buttons, links) |
| `--color-primary-foreground` | Text on primary backgrounds      |
| `--color-secondary`          | Secondary actions                |
| `--color-muted`              | Subtle backgrounds               |
| `--color-muted-foreground`   | Subdued text                     |
| `--color-destructive`        | Errors, delete actions           |
| `--color-border`             | Borders and dividers             |
| `--color-background`         | Page background                  |
| `--color-foreground`         | Body text                        |

### Typography

```css
:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

To swap fonts, replace the imports in `src/app/layout.tsx` (uses `next/font/google`).

### Radius

```css
:root {
  --radius: 0.5rem; /* base border-radius — scales all shadcn/ui components */
}
```

---

## Creating a New Theme Preset

Theme presets live in `src/config/themes/`. Each preset exports a plain object of CSS variable overrides.

**1. Create the preset file:**

```ts
// src/config/themes/ocean.ts
export const oceanTheme = {
  '--color-brand-500': 'oklch(0.57 0.17 230)',
  '--color-brand-600': 'oklch(0.48 0.17 230)',
  // ... override only what differs from the default
}
```

**2. Register it in the themes index:**

```ts
// src/config/themes/index.ts
export { oceanTheme } from './ocean'
```

**3. Apply it at runtime** (e.g. from a theme switcher):

```ts
import { oceanTheme } from '@/config/themes'

function applyTheme(theme: Record<string, string>) {
  const root = document.documentElement
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}

applyTheme(oceanTheme)
```

---

## Dark Mode

Dark mode is class-based (`.dark` on `<html>`), managed by `next-themes`.

Override any token in the `.dark` block:

```css
.dark {
  --color-brand-500: oklch(0.65 0.17 280); /* slightly lighter in dark mode */
  --color-background: oklch(0.09 0 0);
  --color-foreground: oklch(0.97 0 0);
}
```

---

## White-Label Checklist

When handing off to a new client:

- [ ] Update `--color-brand-*` hue in `src/styles/tokens.css`
- [ ] Update `--font-sans` in `src/app/layout.tsx`
- [ ] Update `siteConfig` in `src/config/site.ts` (name, description, URL)
- [ ] Update `navConfig` in `src/config/nav.ts`
- [ ] Replace logo asset
- [ ] Update `--radius` if the client prefers sharp vs rounded corners
- [ ] Verify dark mode tokens look correct with new brand color
