# AgentForge

> **AI Agent Platform** — A production-ready, white-label Next.js template built for agencies.  
> Zero branding lock-in. Multi-tenant ready. C## 📋 Available Commands

| Command    | Description                                      |
| ---------- | ------------------------------------------------ |
| `pnpm dev` | Start dev server at local## 📁 Project Structure |

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── (auth)/       # Authentication pages (login, signup)
│   ├── (dashboard)/  # Protected dashboard pages
│   └── (marketing)/  # Public marketing pages
├── components/
│   ├── ui/           # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── layout/       # Layout components (Navbar, Sidebar, Footer)
│   └── auth/         # Auth-specific components
├── config/
│   ├── env.ts        # Zod-validated environment variables
│   ├── nav.ts        # Navigation config (multi-tenant ready)
│   ├── site.ts       # Site metadata config
│   └── themes/       # CSS variable preset objects per brand
├── features/         # Feature modules (co-located components + logic)
├── hooks/            # Shared React hooks (useTheme, useMobile, useToast, useUser)
├── lib/              # Utilities (cn, auth, metadata)
├── styles/
│   └── tokens.css    # 🎨 Design tokens — THE file to change per brand
└── types/            # Shared TypeScript types
```

---

## 🚧 Roadmap

### ✅ Completed (Phases 1-5)

- [x] TypeScript strict mode + Zod env validation
- [x] Tailwind v4 token-based design system
- [x] 17 components with Storybook documentation
- [x] 3 layout systems (Auth, Dashboard, Marketing)
- [x] React.memo performance optimizations
- [x] Bundle analyzer + Lighthouse CI
- [x] Vercel Analytics integration

### 🏗️ In Progress (Phase 6-7)

- [ ] Authentication system (Clerk/Auth.js)
- [ ] Data layer (Prisma/Drizzle + tRPC/Server Actions)

### 📝 Planned (Phase 8-13)

- [ ] Test suite (Vitest + Playwright)
- [ ] Visual regression testing (Chromatic)
- [ ] i18n scaffolding
- [ ] Complete multi-tenant system
- [ ] Vercel environment setup
- [ ] Domain configuration guide

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Key rules:**

- TypeScript strict mode (no `any`)
- Conventional commits enforced
- All components need Storybook stories
- No hardcoded colors/copy (use tokens + config)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for component primitives
- [Next.js](https://nextjs.org/) team for the framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Storybook](https://storybook.js.org/) for component docs

---

## 📞 Support

- 📖 [Documentation](./docs/)
- 🐛 [Report Bug](https://github.com/bomatra/agent-forge/issues)
- 💡 [Request Feature](https://github.com/bomatra/agent-forge/issues)

---

<div align="center">

**[⭐ Star this repo](https://github.com/bomatra/agent-forge)** if you find it useful!

Built with ❤️ for agencies and SaaS founders

</div>m build` | Production build |
| `pnpm start` | Run production build locally |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix linting issues |
| `pnpm format` | Format all files with Prettier |
| `pnpm format:check` | Check formatting without changes |
| `pnpm storybook` | Launch Storybook component library |
| `pnpm build-storybook` | Build Storybook for deployment |
| `pnpm analyze` | Bundle size analysis (opens browser) |

---

## 🎨y included.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

---

## 🎯 Why This Repo?

**The Problem:** Most Next.js starter templates lock you into specific branding, have hardcoded colors/copy, and lack production-grade architecture.

**The Solution:** AgentForge is an **agency-first template** designed for:

- 🎨 **White-label projects** — Change entire brand in one file
- 🏢 **Multi-tenant SaaS** — React.memo optimized layouts, tenant context ready
- 📦 **Component library** — 100% Storybook coverage, zero prop-drilling
- ⚡ **Performance** — Lighthouse CI, bundle analysis, Vercel Analytics built-in
- 🔒 **Type-safe** — TypeScript strict mode + Zod env validation

**Perfect for:**

- Agencies building client dashboards
- SaaS founders launching MVPs
- Developers who hate hardcoded `#ff0000` colors

---

## 🚀 Quick Start

```bash
# Clone & install
git clone https://github.com/bomatra/agent-forge.git
cd agent-forge
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local: Set NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_APP_ENV

# Start development server
pnpm dev
# → http://localhost:3000

# View component library
pnpm storybook
# → http://localhost:6006
```

---

## ✨ Features

### 🎨 **One-File Brand Swapping**

Change your entire color scheme by editing **one CSS file**:

```css
/* src/styles/tokens.css */
--color-brand-500: oklch(0.57 0.17 280); /* Purple */
--color-brand-500: oklch(0.57 0.17 230); /* → Blue */
--color-brand-500: oklch(0.57 0.17 145); /* → Green */
```

All components update instantly. No rebuild required.

### 📦 **Component Library**

- 9 UI primitives (Button, Card, Dialog, etc.)
- 8 composite components (Navbar, Sidebar, Footer, etc.)
- 100% Storybook documentation
- Dark mode support built-in

### ⚡ **Performance Optimized**

- React.memo on all layout components
- Bundle analyzer configured (`pnpm analyze`)
- Lighthouse CI workflow
- Vercel Speed Insights integrated

### 🔒 **Type-Safe & Validated**

- TypeScript strict mode + `noUncheckedIndexedAccess`
- Zod environment variable validation
- ESLint + Prettier enforced via Husky
- Conventional commits required

### 🌍 **Multi-Tenant Ready**

- Config-driven navigation (`config/nav.ts`)
- No hardcoded copy anywhere
- Brand config system (Phase 12 spec complete)
- Tenant context provider ready

---

## 📚 Documentation

| Doc                                                     | Description                          |
| ------------------------------------------------------- | ------------------------------------ |
| [**Theming Guide**](#theming--branding) ↓               | How to change colors/fonts           |
| [**PERFORMANCE.md**](./docs/PERFORMANCE.md)             | React.memo patterns, Core Web Vitals |
| [**CODE_REVIEW.md**](./docs/CODE_REVIEW_PHASE_1-4.md)   | Quality audit (5/5 approved)         |
| [**REACT_PATTERNS.md**](./docs/REACT_PATTERNS_AUDIT.md) | Multi-tenant scalability analysis    |
| [**Spec**](./docs/specs/nextjs-frontend-specs.md)       | Full 13-phase implementation plan    |

---

## 🛠️ Tech Stack

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| **Framework**  | Next.js 16 (App Router, Turbopack)   |
| **UI**         | React 19, TypeScript 5.7             |
| **Styling**    | Tailwind CSS v4, CSS Variables       |
| **Components** | shadcn/ui + custom library           |
| **Docs**       | Storybook 8.6                        |
| **Validation** | Zod (env vars, forms)                |
| **Analytics**  | Vercel Analytics + Speed Insights    |
| **CI/CD**      | GitHub Actions, Husky, Lighthouse CI |

---

## 📖 Setup

### Prerequisites

- Node.js 18+ (20+ recommended)
- pnpm 9+ (`npm install -g pnpm`)

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/bomatra/agent-forge.git
   cd agent-forge
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_APP_ENV=development
   ```

4. **Start dev server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## 📋

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

## 🎨 Theming & Branding

**TL;DR:** Change one file (`src/styles/tokens.css`) to rebrand the entire app.

### How It Works

The design system is **token-based** — all colors, radii, and fonts are CSS custom properties defined in a single source of truth:

```
src/styles/tokens.css   ← All CSS variables (colors, spacing, typography)
src/app/globals.css     ← Imports tokens, maps to Tailwind utilities
```

### Applying a New Brand in One File

1. Open `src/styles/tokens.css`
2. Update `--color-brand-*` under `:root` and `.dark`:

   ```css
   /* Purple (default) → hue 280 */
   --color-brand-500: oklch(0.57 0.17 280);

   /* Blue → change hue to 230 */
   --color-brand-500: oklch(0.57 0.17 230);

   /* Green → change hue to 145 */
   --color-brand-500: oklch(0.57 0.17 145);
   ```

3. Save — all components update instantly (no rebuild needed)

### Available Brand Utilities

```tsx
<button className="bg-brand-500 hover:bg-brand-600">
  // Purple by default, changes when you update tokens.css
</button>
```

Full scale: `brand-50`, `brand-100`, ..., `brand-900`  
Available as: `bg-brand-*`, `text-brand-*`, `border-brand-*`, `ring-brand-*`

---

## 🌙 Dark Mode

Dark mode is managed by [`next-themes`](https://github.com/pacocoursey/next-themes) and CSS class toggling:

```tsx
// Any client component
'use client'
import { useTheme } from '@/hooks/use-theme'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  return <button onClick={toggleTheme}>{isDark ? '☀️ Light' : '🌙 Dark'}</button>
}
```

**How it works:**

- `layout.tsx` wraps app in `ThemeProvider`
- Provider reads `localStorage` or system preference
- Toggles `.dark` class on `<html>`
- `tokens.css` `.dark { }` block overrides all CSS vars

---

## 🔤 Typography

Fonts are loaded via `next/font/google` and exposed as CSS variables:

| Variable      | Font           | Tailwind Class |
| ------------- | -------------- | -------------- |
| `--font-sans` | Inter          | `font-sans`    |
| `--font-mono` | JetBrains Mono | `font-mono`    |

**To swap fonts:** Replace imports in `src/app/layout.tsx`

---

## 📁

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
