# Changelog

All notable changes to AgentForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Phase 5 performance optimizations
- React.memo on all layout components (Navbar, Footer, AppSidebar, Topbar)
- ResponsiveImage component wrapper for next/image
- Bundle analyzer with webpack support
- Lighthouse CI workflow
- Vercel Analytics integration
- Performance documentation (docs/PERFORMANCE.md)
- Code review documentation (docs/CODE_REVIEW_PHASE_1-4.md)
- React patterns audit (docs/REACT_PATTERNS_AUDIT.md)

### Changed

- Enhanced README with agency-ready structure
- Updated nextjs-frontend-specs.md with Phase 5 & 12 details

### Fixed

- Bundle analyzer compatibility with Next.js 16 Turbopack
- Prettier formatting violations in documentation

---

## [0.1.0] - 2024-01-XX

### Added

- Initial project setup
- Next.js 16 with App Router
- TypeScript strict mode configuration
- Tailwind CSS v4 token-based design system
- Environment variable validation with Zod
- ESLint + Prettier configuration
- Husky + lint-staged + commitlint
- Dark mode support with next-themes
- 9 UI primitives (Button, Card, Badge, Avatar, Dialog, Input, Label, Dropdown, Separator)
- 8 composite components (Navbar, Footer, AppSidebar, Topbar, etc.)
- Storybook 8.6 with 100% component coverage
- 3 layout systems (Auth, Dashboard, Marketing)
- Config-driven navigation system
- White-label ready architecture (no hardcoded branding)
- Project documentation structure

### Documentation

- README.md with setup instructions
- docs/specs/nextjs-frontend-specs.md (13-phase plan)
- docs/prompts/prompts-guideline-claude.md
- docs/specs/domain-setup.md
- CLAUDE.md for environment setup

---

## Version History

### Version Format

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes
MINOR: New features (backward compatible)
PATCH: Bug fixes (backward compatible)
```

### Change Categories

- **Added:** New features
- **Changed:** Changes to existing functionality
- **Deprecated:** Soon-to-be removed features
- **Removed:** Removed features
- **Fixed:** Bug fixes
- **Security:** Vulnerability fixes

---

## [Unreleased] - Planned Features

### Phase 6 - Authentication

- [ ] Clerk/Auth.js integration
- [ ] Protected routes
- [ ] Role-based access control

### Phase 7 - Data Layer

- [ ] Database setup (Prisma/Drizzle)
- [ ] tRPC/Server Actions
- [ ] Data fetching patterns

### Phase 8 - Testing

- [ ] Vitest unit tests
- [ ] Playwright E2E tests
- [ ] > 80% code coverage

### Phase 9 - Visual Regression

- [ ] Chromatic integration
- [ ] Storybook deployment
- [ ] Visual diff testing

### Phase 10 - CI/CD

- [ ] Enhanced GitHub Actions workflows
- [ ] Automated dependency updates
- [ ] Release automation

### Phase 11 - Documentation

- [ ] i18n scaffolding
- [ ] THEMING.md guide
- [ ] Architecture diagrams

### Phase 12 - White-Labeling

- [ ] Brand config system
- [ ] Tenant context provider
- [ ] Multi-environment setup

### Phase 13 - Deployment

- [ ] Vercel environment configuration
- [ ] GoDaddy domain setup
- [ ] Production monitoring

---

[Unreleased]: https://github.com/bomatra/agent-forge/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/bomatra/agent-forge/releases/tag/v0.1.0
