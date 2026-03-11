# Contributing to AgentForge

Thank you for considering contributing to AgentForge! This document outlines the process and guidelines.

---

## 🚀 Quick Start

1. **Fork the repository**

   ```bash
   gh repo fork bomatra/agent-forge --clone
   cd agent-forge
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make your changes**
   - Follow the code style below
   - Add tests if applicable
   - Update documentation

5. **Test your changes**

   ```bash
   pnpm typecheck      # TypeScript check
   pnpm lint           # ESLint
   pnpm format:check   # Prettier
   pnpm build          # Production build
   ```

6. **Commit using conventional commits**

   ```bash
   git add .
   git commit -m "feat(component): add new Button variant"
   ```

7. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   gh pr create --fill
   ```

---

## 📝 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/). Commits are enforced via Husky + commitlint.

**Format:**

```
<type>(<scope>): <subject>

<body> (optional)
<footer> (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no feature/fix)
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Build process, tooling, dependencies

**Examples:**

```bash
git commit -m "feat(auth): add OAuth login"
git commit -m "fix(button): prevent double-click submit"
git commit -m "docs(readme): update installation steps"
git commit -m "perf(layout): memoize Navbar component"
```

---

## 🎨 Code Style

### TypeScript

- **Strict mode:** No `any`, use `unknown` if needed
- **Explicit return types:** Required for exported functions
- **No `null`:** Use `undefined` for optional values

**Good:**

```tsx
export function formatDate(date: Date | undefined): string {
  if (!date) return 'N/A'
  return date.toISOString()
}
```

**Bad:**

```tsx
export function formatDate(date: any) {
  // ❌ any
  return date?.toISOString() // ❌ no explicit return type
}
```

### React Components

- **File naming:** PascalCase for components (`Button.tsx`)
- **Export style:** Named exports preferred
- **Props interface:** Always define TypeScript interface

```tsx
// Good
interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### CSS/Tailwind

- **No hardcoded colors:** Use token classes (`bg-brand-500`, `text-primary`)
- **No inline hex/rgb:** Use CSS variables
- **Responsive:** Mobile-first (`sm:`, `md:`, `lg:`)

**Good:**

```tsx
<div className="bg-brand-500 text-white hover:bg-brand-600 sm:px-6">
```

**Bad:**

```tsx
<div className="bg-[#9333ea] text-[#ffffff]">  {/* ❌ hardcoded colors */}
```

### File Structure

- **Co-locate:** Keep related files together
- **Index exports:** Use `index.ts` for clean imports

```
features/
  auth/
    index.ts              # export * from './LoginForm'
    LoginForm.tsx
    LoginForm.stories.tsx
    useAuth.ts
```

---

## 📦 Adding Components

1. **Create component file:**

   ```bash
   # src/components/ui/MyComponent.tsx
   ```

2. **Define props interface:**

   ```tsx
   interface MyComponentProps {
     title: string
     onAction?: () => void
   }

   export function MyComponent({ title, onAction }: MyComponentProps) {
     return <div>{title}</div>
   }
   ```

3. **Add to index:**

   ```tsx
   // src/components/ui/index.ts
   export { MyComponent } from './MyComponent'
   ```

4. **Create Storybook story:**

   ```tsx
   // src/components/ui/MyComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { MyComponent } from './MyComponent'

   const meta: Meta<typeof MyComponent> = {
     title: 'UI/MyComponent',
     component: MyComponent,
   }

   export default meta
   type Story = StoryObj<typeof MyComponent>

   export const Default: Story = {
     args: {
       title: 'Hello World',
     },
   }
   ```

5. **Test in Storybook:**
   ```bash
   pnpm storybook
   ```

---

## 🧪 Testing

### Before Creating PR

Run all checks:

```bash
pnpm typecheck && pnpm lint && pnpm format:check && pnpm build
```

### If Tests Exist (Phase 8+)

```bash
pnpm test           # Unit tests
pnpm test:e2e       # E2E tests
pnpm test:coverage  # Coverage report
```

---

## 🎯 White-Label Rules

**Critical:** AgentForge is a white-label template. **Never** hardcode:

❌ **Don't:**

```tsx
<h1 className="text-purple-500">AgentForge Dashboard</h1>
<button style={{ backgroundColor: '#9333ea' }}>Submit</button>
```

✅ **Do:**

```tsx
<h1 className="text-brand-500">{siteConfig.name} Dashboard</h1>
<button className="bg-brand-500 hover:bg-brand-600">Submit</button>
```

### Checklist Before PR

- [ ] No hardcoded colors (use `bg-brand-*`, CSS variables)
- [ ] No hardcoded copy (use `config/site.ts`, `config/nav.ts`)
- [ ] Dark mode works
- [ ] TypeScript passes (`pnpm typecheck`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Prettier formatted (`pnpm format`)
- [ ] Storybook story added (if component)
- [ ] Conventional commit message

---

## 🐛 Reporting Bugs

**Before reporting:**

1. Search [existing issues](https://github.com/bomatra/agent-forge/issues)
2. Update to latest version
3. Clear `.next`, `node_modules`, reinstall

**Bug report should include:**

- Expected behavior
- Actual behavior
- Steps to reproduce
- Environment (OS, Node version, pnpm version)
- Screenshots (if visual bug)

---

## 💡 Feature Requests

**Good feature requests include:**

- Problem statement ("As a developer, I need...")
- Proposed solution
- Alternatives considered
- Mockups/examples (if UI feature)

---

## 📋 PR Guidelines

### PR Title

Use conventional commit format:

```
feat(auth): add OAuth login
fix(button): prevent double-click submit
docs(readme): update installation steps
```

### PR Description Template

```markdown
## What does this PR do?

Brief description

## Why?

Problem being solved

## How to test?

1. Step one
2. Step two

## Screenshots (if applicable)

[Add screenshots]

## Checklist

- [ ] TypeScript passes
- [ ] Lint passes
- [ ] Prettier formatted
- [ ] Storybook story added (if component)
- [ ] No hardcoded colors/copy
- [ ] Dark mode tested
```

---

## 🏗️ Development Workflow

### Branch Naming

```
feature/add-oauth-login
fix/button-double-click
docs/update-readme
refactor/auth-hooks
```

### Rebasing (Keep History Clean)

```bash
# Update your branch with main
git fetch origin
git rebase origin/main

# If conflicts, resolve and continue
git add .
git rebase --continue
```

---

## 🙋 Questions?

- 💬 [GitHub Discussions](https://github.com/bomatra/agent-forge/discussions)
- 🐛 [Issues](https://github.com/bomatra/agent-forge/issues)

---

**Thank you for contributing!** 🎉
