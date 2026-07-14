# @forge/ui

shadcn/ui component library — owned and fully editable.

## Rules

- **Keep generic** — no imports from `@/config`, `@forge/brand`, or any app package. App-specific wrappers belong in `apps/web/src/components/`.
- **Add components** via `pnpm dlx shadcn@latest add <component>` from the repo root.
- **Style** with Tailwind CSS v4. Use `cn()` from `./utils` for conditional classNames.
- **No `'use client'`** unless the component genuinely needs browser APIs or event handlers.
- **Stories** — every component gets a `*.stories.tsx` co-located in `src/`.
- **Tests** — co-locate `*.test.tsx` for any logic-bearing component.
