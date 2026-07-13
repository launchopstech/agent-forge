# AgentForge — Architecture Document

> Version 1.0 · March 2026
> Stack: Next.js 16 / React 19 · pnpm monorepo · Turbo · TypeScript 5.7
> Current deployment target: Vercel (PaaS) | AWS target: see §4

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Monorepo & Application Architecture](#2-monorepo--application-architecture)
3. [API Layer](#3-api-layer)
4. [AWS Infrastructure](#4-aws-infrastructure)
5. [Branching Strategy](#5-branching-strategy)
6. [Testing Strategy](#6-testing-strategy)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Security & Auth](#8-security--auth)
9. [Observability](#9-observability)

---

## 1. System Overview

AgentForge is a **white-label AI agent builder SaaS** — a multi-tenant platform that lets organisations build, configure, and deploy conversational AI agents across channels (web chat, Slack, email, etc.).

```
┌─────────────────────────────────────────────────────────────────┐
│                         INTERNET                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
                ┌──────────────▼───────────────┐
                │        CDN / Edge             │
                │   (CloudFront / Vercel Edge)  │
                │   • Static assets             │
                │   • Edge middleware (auth)    │
                │   • Locale detection          │
                └──────────────┬───────────────┘
                               │
                ┌──────────────▼───────────────┐
                │     Next.js Application       │
                │   (App Router — SSR/RSC)      │
                │                               │
                │  ┌──────────┐ ┌────────────┐  │
                │  │Marketing │ │ Dashboard  │  │
                │  │ (public) │ │(protected) │  │
                │  └──────────┘ └────────────┘  │
                │  ┌──────────┐ ┌────────────┐  │
                │  │   Auth   │ │   Admin    │  │
                │  │  Pages   │ │ (agency)   │  │
                │  └──────────┘ └────────────┘  │
                └──────┬──────────────┬─────────┘
                       │              │
          ┌────────────▼──┐    ┌──────▼──────────┐
          │  Internal API  │    │  External APIs  │
          │  (Server Acts) │    │  • Clerk (Auth) │
          │  • Zod valid.  │    │  • AI Providers │
          │  • ActionResult│    │  • CMS / CDN    │
          └────────────┬──┘    └─────────────────┘
                       │
          ┌────────────▼──────────────────┐
          │         Data Layer            │
          │  • REST API backend           │
          │  • PostgreSQL (RDS)           │
          │  • Redis (ElastiCache)        │
          │  • S3 (knowledge / assets)    │
          └───────────────────────────────┘
```

### Key Principles

| Principle          | Implementation                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Server-first**   | React Server Components by default; `'use client'` only at leaf level                           |
| **Auth-agnostic**  | Registry pattern with `NEXT_PUBLIC_AUTH_PROVIDER` env var (Clerk / NextAuth / Okta)             |
| **Brand-agnostic** | `NEXT_PUBLIC_BRAND` env var selects tenant config; CSS variables injected server-side (no FOUC) |
| **i18n-first**     | All UI strings via `next-intl`; ESLint rule blocks hardcoded text                               |
| **Zero-trust**     | Edge middleware protects all dashboard/admin routes before page render                          |

---

## 2. Monorepo & Application Architecture

### 2.1 Package Graph

```
agent-forge/ (pnpm workspace · Turbo v2)
│
├── apps/
│   └── web (@forge/web)                ← Next.js 16 application
│       ├── src/app/                    ← App Router routes
│       ├── src/features/               ← Feature modules (agents, dashboard…)
│       ├── src/lib/                    ← Server utilities, auth, content
│       ├── src/hooks/                  ← Client hooks
│       ├── src/config/                 ← Site & brand config
│       └── src/messages/               ← i18n base (en.json, fr.json…)
│
└── packages/
    ├── ui           (@forge/ui)         ← shadcn/ui components (owned & editable)
    ├── ai-ui        (@forge/ai-ui)      ← AI-specific UI (XYFlow, streaming chat)
    ├── auth         (@forge/auth)       ← Pluggable auth abstraction
    ├── brand        (@forge/brand)      ← Multi-tenant / white-label engine
    ├── config       (@forge/config)     ← Nav, site config, theme definitions
    ├── i18n         (@forge/i18n)       ← next-intl wrapper, routing, messages
    ├── api-client   (@forge/api-client) ← Typed fetch wrapper (Bearer token)
    └── tsconfig     (@forge/tsconfig)   ← Shared TypeScript configurations
```

**Build orchestration (Turbo pipeline):**

```
typecheck ─┐
lint       ├──► build ──► test:coverage ──► storybook:build
format     ┘
```

### 2.2 Application Layer Diagram

```
┌────────────────────── apps/web/src ──────────────────────────┐
│                                                               │
│  app/[locale]/                                                │
│  ├── (marketing)/          Server Components, public          │
│  │   └── page.tsx          Landing page                       │
│  ├── (dashboard)/          Protected via proxy.ts middleware  │
│  │   ├── dashboard/        Metrics, overview                  │
│  │   ├── agents/           Agent list + builder               │
│  │   │   ├── new/          Template picker → wizard           │
│  │   │   └── [id]/[sect]   Identity · Behaviour · Actions     │
│  │   └── admin/theme/      Agency theme editor                │
│  ├── (auth)/               Clerk SignIn / SignUp components    │
│  └── _dev/preview/         QA catalog (notFound in prod)      │
│                                                               │
│  features/                 ← Feature-sliced design            │
│  ├── agents/               api/ · components/ · store/ · types│
│  └── dashboard/            api/ · components/                 │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │               Package Dependencies                      │   │
│  │  @forge/ui  @forge/auth  @forge/brand  @forge/i18n     │   │
│  │  @forge/config  @forge/api-client  @forge/ai-ui        │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### 2.3 State Management

```
Component State  ──► React useState / useReducer (local UI state)
      │
Server State     ──► React Server Components + Server Actions
      │                  └─ ActionResult<T> discriminated union
      │
Global State     ──► Zustand stores (per feature)
      │                  └─ useAgentBuilderStore (wizard draft)
      │
Persistent State ──► LocalStorage (theme editor)
                        └─ LocalStorageThemeStore (@forge/brand)
```

---

## 3. API Layer

### 3.1 Layers

```
┌──────────────────────────────────────────────────────────┐
│                   Next.js Application                     │
│                                                           │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────┐  │
│  │  RSC / Page │   │  'use client'│   │  Server Action│  │
│  │  Components │   │  Components  │   │  ('use server')│  │
│  └──────┬──────┘   └──────┬───────┘   └───────┬───────┘  │
│         │                 │                   │           │
│         │ direct call     │ fetch / SWR        │ form/RPC  │
│         ▼                 ▼                   ▼           │
│  ┌──────────────────────────────────────────────────┐     │
│  │              @forge/api-client                   │     │
│  │  apiClient.get<T>() · .post<T>() · .put<T>()    │     │
│  │  • Bearer token injection (getToken callback)    │     │
│  │  • ApiError class (status + data)                │     │
│  │  • JSON serialisation                            │     │
│  └────────────────────────┬─────────────────────────┘     │
└───────────────────────────┼───────────────────────────────┘
                            │ HTTPS / REST
              ┌─────────────▼─────────────┐
              │      Backend REST API      │
              │   (Node / FastAPI / etc.)  │
              │   • /api/agents            │
              │   • /api/templates         │
              │   • /api/metrics           │
              └─────────────┬─────────────┘
                            │
              ┌─────────────▼─────────────┐
              │         Database           │
              │   PostgreSQL (RDS) +       │
              │   Redis (ElastiCache)      │
              └───────────────────────────┘
```

### 3.2 Server Actions Pattern

```typescript
// Pattern: ActionResult<T> discriminated union
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

// Usage in Server Action
;('use server')
export async function createAgent(
  _prev: ActionResult<Agent>,
  formData: FormData
): Promise<ActionResult<Agent>> {
  const parsed = agentSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success)
    return {
      ok: false,
      error: 'Validation failed',
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  const agent = await apiClient.post<Agent>('/api/agents', parsed.data)
  return { ok: true, data: agent }
}
```

### 3.3 Feature API Modules

```
src/features/agents/api/
├── agents.api.ts      GET /agents, POST /agents, PUT /agents/:id, DELETE /agents/:id
├── templates.api.ts   GET /templates
└── metrics.api.ts     GET /metrics/dashboard

src/lib/
├── api-client.ts      Typed fetch wrapper (see §3.1)
├── auth.ts            Public auth entry point (server)
└── content.ts         CMS-ready content API (Page, Post interfaces)
```

### 3.4 Auth Flow

```
Request
  │
  ▼
proxy.ts (Edge Middleware)
  │── /dashboard/** ─► requireAuth() → 401 redirect to /login
  │── /admin/**     ─► requireAuth() → 401 redirect to /login
  │── /agents/**    ─► requireAuth() → 401 redirect to /login
  │── /login        ─► allow (public)
  └── /             ─► allow (public)
                              │
                              ▼
                    Page / Server Component
                              │
                    getSession() → { userId, email, role }
                              │
                    Server Action / API call
                    Bearer: <session_token>
```

---

## 4. AWS Infrastructure

> Current: Vercel (PaaS). This section describes the equivalent AWS target architecture for self-hosted / enterprise deployments.

### 4.1 High-Level AWS Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                            AWS Account                              │
│                                                                     │
│  ┌─────────┐    ┌───────────────────────────────────────────────┐   │
│  │ Route53 │───►│              CloudFront (CDN)                 │   │
│  │  (DNS)  │    │  • Edge caching (static assets, ISR pages)   │   │
│  └─────────┘    │  • Lambda@Edge for auth headers               │   │
│                 │  • WAF (rate limiting, bot protection)         │   │
│                 └─────────────────┬─────────────────────────────┘   │
│                                   │                                 │
│              ┌────────────────────▼────────────────────────┐        │
│              │              VPC (us-east-1)                 │        │
│              │                                              │        │
│              │  ┌──────────────────────────────────────┐   │        │
│              │  │           Public Subnets              │   │        │
│              │  │  ┌──────────────────────────────┐    │   │        │
│              │  │  │    Application Load Balancer  │    │   │        │
│              │  │  │    (ALB — HTTPS termination)  │    │   │        │
│              │  │  └─────────────┬────────────────┘    │   │        │
│              │  └────────────────┼────────────────────-┘   │        │
│              │                   │                          │        │
│              │  ┌────────────────▼────────────────────┐    │        │
│              │  │          Private Subnets             │    │        │
│              │  │                                      │    │        │
│              │  │  ┌─────────────────────────────┐    │    │        │
│              │  │  │   ECS Fargate Cluster        │    │    │        │
│              │  │  │   ┌──────────────────────┐   │    │    │        │
│              │  │  │   │  Task: Next.js App    │   │    │    │        │
│              │  │  │   │  (@forge/web)         │   │    │    │        │
│              │  │  │   │  • Port 3000          │   │    │    │        │
│              │  │  │   │  • Auto-scaling        │   │    │    │        │
│              │  │  │   │    (target: CPU 60%)   │   │    │    │        │
│              │  │  │   └──────────────────────┘   │    │    │        │
│              │  │  └─────────────────────────────┘    │    │        │
│              │  │                                      │    │        │
│              │  │  ┌──────────────┐ ┌───────────────┐ │    │        │
│              │  │  │  RDS Aurora  │ │  ElastiCache  │ │    │        │
│              │  │  │  PostgreSQL  │ │  Redis        │ │    │        │
│              │  │  │  (Multi-AZ)  │ │  (cluster)    │ │    │        │
│              │  │  └──────────────┘ └───────────────┘ │    │        │
│              │  └──────────────────────────────────────┘   │        │
│              │                                              │        │
│              │  ┌─────────────────────────────────────┐    │        │
│              │  │        Supporting Services           │    │        │
│              │  │  ┌──────────┐  ┌─────────────────┐  │    │        │
│              │  │  │   S3     │  │  Secrets Manager│  │    │        │
│              │  │  │ (assets, │  │  (env vars,     │  │    │        │
│              │  │  │  uploads,│  │   API keys,     │  │    │        │
│              │  │  │  backups)│  │   DB creds)     │  │    │        │
│              │  │  └──────────┘  └─────────────────┘  │    │        │
│              │  │  ┌──────────┐  ┌─────────────────┐  │    │        │
│              │  │  │   SQS    │  │   CloudWatch    │  │    │        │
│              │  │  │ (async   │  │   (logs, metrics│  │    │        │
│              │  │  │  tasks)  │  │    alarms)      │  │    │        │
│              │  │  └──────────┘  └─────────────────┘  │    │        │
│              │  └─────────────────────────────────────┘    │        │
│              └──────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 ECS Fargate Service

```
ECR (Container Registry)
  └── agent-forge/web:${GIT_SHA}   ← Docker image (Next.js standalone output)
         │
         ▼
ECS Task Definition
  ├── CPU: 512 (.5 vCPU)  / Memory: 1024 MB   ← standard
  ├── CPU: 1024 (1 vCPU)  / Memory: 2048 MB   ← high-traffic
  ├── Environment variables ← injected from Secrets Manager
  ├── Health check: GET /api/health → 200
  └── Log driver: awslogs → /ecs/agent-forge/web

ECS Service
  ├── Desired count: 2 (min) → 10 (max)
  ├── Auto-scaling: CPU target 60%, ALB RequestCountPerTarget
  ├── Deployment: Rolling (min 50%, max 200%)
  └── Load balancer: ALB target group (:3000)
```

**Dockerfile (Next.js standalone):**

```dockerfile
FROM node:22-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY packages/ packages/
COPY apps/web/package.json apps/web/
RUN corepack enable && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm turbo build --filter=@forge/web

# Runtime
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### 4.3 Data Stores

| Store            | Service                  | Config                                     |
| ---------------- | ------------------------ | ------------------------------------------ |
| Primary DB       | RDS Aurora PostgreSQL 16 | Multi-AZ, r8g.large, encrypted             |
| Cache / Sessions | ElastiCache Redis 7      | cluster mode, 2 nodes                      |
| Object Storage   | S3                       | versioned, SSE-S3, lifecycle → Glacier 90d |
| Async Jobs       | SQS FIFO                 | DLQ with 3 retries, visibility 30s         |
| Secrets          | Secrets Manager          | auto-rotation 30d                          |

### 4.4 Networking

```
VPC: 10.0.0.0/16
├── Public Subnets (ALB, NAT Gateway)
│   ├── us-east-1a: 10.0.1.0/24
│   └── us-east-1b: 10.0.2.0/24
└── Private Subnets (ECS, RDS, Redis)
    ├── us-east-1a: 10.0.10.0/24
    └── us-east-1b: 10.0.11.0/24

Security Groups:
  alb-sg:      Inbound 443 from 0.0.0.0/0
  ecs-sg:      Inbound 3000 from alb-sg only
  rds-sg:      Inbound 5432 from ecs-sg only
  redis-sg:    Inbound 6379 from ecs-sg only
```

### 4.5 Environment Tiers

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  dev         │  staging     │  production  │  dr          │
│  (feature/*) │  (main)      │  (main+gate) │  (us-west-2) │
├──────────────┼──────────────┼──────────────┼──────────────┤
│  1 Fargate   │  2 Fargate   │  2-10 Fargate│  2 Fargate   │
│  task        │  tasks       │  auto-scale  │  warm standby│
│  RDS t4g.sm  │  RDS r8g.med │  RDS r8g.lg  │  read replica│
│  No Redis    │  Redis 1 nd  │  Redis 2 nd  │  Redis 1 nd  │
│  S3 (dev)    │  S3 (stage)  │  S3 (prod)   │  S3 (replica)│
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 5. Branching Strategy

### 5.1 Git Flow

```
main ─────────────────────────────────────────────────────────────► prod
  │                                                              [tag: v*]
  │  merge (squash)
  │◄────────────────────────────────────────────────────────────
  │                                                    ↑ manual gate
staging ─────────────────────────────────────────────────────────► staging env
  │
  │  merge (squash)
  │◄──────────────────────────────────────────────────
  │                                         ↑ PR required (2 reviews)
develop ─────────────────────────────────────────────────────────► dev env
  │
  ├── feature/agent-hub ──────────────────────────► PR → develop
  ├── feature/theme-editor ──────────────────────► PR → develop
  ├── fix/mobile-cta ────────────────────────────► PR → develop
  └── chore/update-deps ────────────────────────► PR → develop
```

### 5.2 Branch Rules

| Branch      | Protection                                    | Who merges                     | Deploy target            |
| ----------- | --------------------------------------------- | ------------------------------ | ------------------------ |
| `main`      | Required: 2 reviews, CI green, signed commits | Tech Lead / Release Manager    | Production (manual gate) |
| `staging`   | Required: 1 review, CI green                  | Senior Dev                     | Staging                  |
| `develop`   | Required: 1 review, CI green                  | Any Dev                        | Dev environment          |
| `feature/*` | None                                          | Author (self-merge to develop) | Preview (Vercel)         |
| `fix/*`     | None                                          | Author                         | Preview                  |
| `chore/*`   | None                                          | Author                         | Preview                  |
| `hotfix/*`  | 1 review                                      | Tech Lead                      | main + develop           |

### 5.3 Branch Naming Convention

```
feature/<ticket-id>-<short-desc>    e.g. feature/AF-123-agent-builder-wizard
fix/<ticket-id>-<short-desc>        e.g. fix/AF-456-mobile-cta-overflow
chore/<short-desc>                  e.g. chore/upgrade-next-16-1
hotfix/<ticket-id>-<short-desc>     e.g. hotfix/AF-789-auth-bypass
release/<version>                   e.g. release/1.4.0
```

### 5.4 Commit Convention

```
type(scope): subject                   ← max 72 chars

body (optional)

footer: BREAKING CHANGE / closes #id

Types: feat · fix · chore · docs · refactor · test · perf · ci · style
Scope: agents · dashboard · auth · ui · brand · i18n · infra · api
```

Enforced by `commitlint` + husky `commit-msg` hook.

---

## 6. Testing Strategy

### 6.1 Test Pyramid

```
                        ┌───────────────┐
                        │   E2E Tests   │  ← Playwright (Chromium)
                        │   ~20 tests   │     smoke · auth · navigation
                        │  (slowest)    │     a11y · admin-theme · 404
                        └───────┬───────┘
                   ┌────────────▼────────────┐
                   │   Integration / Visual  │  ← Chromatic (Storybook)
                   │   All UI components     │     visual regression
                   │   + Storybook stories   │     component contracts
                   └───────────┬─────────────┘
            ┌──────────────────▼──────────────────┐
            │           Unit Tests                 │  ← Vitest (happy-dom)
            │   ~50+ tests · lib · hooks · api     │     fast · isolated
            │   coverage ≥ 80% lines/stmts/branch │     ActionResult · stores
            │   coverage ≥ 60% functions           │     api-client · utils
            └─────────────────────────────────────┘
```

### 6.2 Unit Tests (Vitest)

```
Tool:         Vitest 2.x + happy-dom + @testing-library/react
Config:       apps/web/vitest.config.mts
Scope:        src/lib/** · src/hooks/** · src/features/**/api/** · **/store/**
Excluded:     src/lib/auth/**  (NotImplementedError stubs — intentional)
              src/lib/content.ts (CMS stub)
              src/hooks/use-user.ts (Clerk hook — browser-only)

Coverage thresholds (enforced — never lower):
  Lines:      80%
  Statements: 80%
  Branches:   80%
  Functions:  60%

Run:
  pnpm test:coverage     ← CI (with coverage report)
  pnpm test              ← watch mode (dev)
  pnpm test run src/i18n/i18n.test.ts   ← targeted
```

**Key test files:**

```
src/lib/utils.test.ts                  cn() helper
src/lib/api-client.test.ts             ApiError, typed fetch
src/features/agents/api/*.test.ts      agent / template / metrics API
src/features/agents/store/*.test.ts    Zustand store actions
src/i18n/i18n.test.ts                  key parity · empty values · locale coverage
src/hooks/use-toast.test.ts            toast state management
```

### 6.3 E2E Tests (Playwright)

```
Tool:         Playwright 1.58 · Chromium
Config:       apps/web/playwright.config.ts
baseURL:      http://localhost:3000  (CI: PLAYWRIGHT_BASE_URL env var)
WebServer:    pnpm start (reuses existing on dev)

e2e/
├── smoke.spec.ts          Homepage loads, basic navigation
├── auth.spec.ts           Login redirect, Clerk flow
├── navigation.spec.ts     Sidebar, route transitions
├── theme.spec.ts          Light/dark toggle persists
├── 404.spec.ts            Not-found page renders
├── admin-theme.spec.ts    Agency + tenant theme editor
└── helpers/
    └── a11y.ts            axe-core wrapper (disableRules for known violations)
```

### 6.4 Visual Regression (Chromatic)

```
Tool:         Chromatic 15 (Storybook 8)
Trigger:      Every PR to develop/staging/main
Token:        CHROMATIC_PROJECT_TOKEN (GitHub Secret)
Command:      pnpm chromatic --build-script-name=storybook:build

Stories:      All packages/ui/src/** components
              All src/components/layout/**
              All src/features/**/components/**
```

### 6.5 i18n Guardrails (Vitest)

```
src/i18n/i18n.test.ts enforces:
  ✓ Key parity       — all locale files have identical keys to en.json
  ✓ No empty values  — no translation key has an empty string
  ✓ Locale coverage  — routing.locales matches files on disk

Run after any message file change:
  pnpm test run src/i18n/i18n.test.ts
```

---

## 7. CI/CD Pipeline

### 7.1 Overview

```
Developer pushes → GitHub
       │
       ├── Push to feature/* ──────────────────► Vercel Preview Deploy
       │                                          (automatic, no CI checks)
       │
       ├── PR to develop ──────────────────────► CI: develop workflow
       │                                          typecheck + lint + build + test
       │                                          → merge to develop
       │                                            → deploy to dev env
       │
       ├── PR to staging ──────────────────────► CI: staging workflow
       │                                          + Chromatic visual tests
       │                                          → merge to staging
       │                                            → deploy to staging
       │                                              → E2E tests on staging
       │
       └── Push to main ───────────────────────► CI: production workflow
                                                  shared checks + Chromatic
                                                  → deploy to staging (smoke)
                                                  → ⏸ MANUAL APPROVAL GATE
                                                  → deploy to production
                                                  → smoke tests on production
```

### 7.2 Workflow Matrix

| Workflow                  | Trigger           | typecheck | lint | build | unit tests | E2E       | Chromatic | Deploy                    |
| ------------------------- | ----------------- | --------- | ---- | ----- | ---------- | --------- | --------- | ------------------------- |
| `ci-development.yml`      | PR/push `develop` | ✓         | ✓    | ✓     | ✓          | ✗         | ✗         | dev                       |
| `ci-qa.yml`               | PR/push `qa`      | ✓         | ✓    | ✓     | ✓          | ✗         | ✗         | qa                        |
| `deploy-staging-prod.yml` | push `main`       | ✓         | ✓    | ✓     | ✓          | ✓ staging | ✓         | staging → **gate** → prod |

### 7.3 Shared Checks (Reusable Workflow)

```yaml
# .github/workflows/shared-checks.yml
jobs:
  typecheck:   pnpm typecheck        # tsc --noEmit — zero errors
  lint:        pnpm lint             # ESLint + Prettier check — zero warnings
  test:        pnpm test:coverage    # Vitest + coverage thresholds
  build:       turbo build           # Production build must succeed
  e2e:         [optional]  playwright test
  storybook:   [optional]  chromatic

Inputs:
  environment:          staging | production | development
  run-e2e:              true | false
  run-chromatic:        true | false
  wait-for-deployment:  true | false   (30s delay before E2E)
  e2e-test-path:        '' | 'e2e/smoke.spec.ts'
```

### 7.4 Production Deployment Flow (AWS)

```
┌─────────────────────────────────────────────────────────────────┐
│                    deploy-staging-prod.yml                       │
│                                                                  │
│  Phase 1: CI Checks (shared-checks.yml)                         │
│  ─────────────────────────────────────                          │
│  typecheck → lint → build → test:coverage → chromatic           │
│                                                                  │
│  Phase 2: Build & Push Docker Image                              │
│  ──────────────────────────────────                             │
│  docker build --build-arg GIT_SHA=${{ github.sha }}             │
│  docker push ECR: agent-forge/web:${{ github.sha }}             │
│                                                                  │
│  Phase 3: Deploy to Staging                                      │
│  ───────────────────────────                                    │
│  aws ecs update-service \                                        │
│    --cluster agent-forge-staging \                               │
│    --service web \                                               │
│    --force-new-deployment                                        │
│  → wait for service stable (ECS rollout)                         │
│                                                                  │
│  Phase 4: E2E on Staging                                         │
│  ────────────────────────                                       │
│  PLAYWRIGHT_BASE_URL=https://staging.agentforge.io               │
│  pnpm test:e2e                                                   │
│                                                                  │
│  Phase 5: ⏸ Manual Approval Gate                                 │
│  ─────────────────────────────────                              │
│  GitHub Environment: production                                  │
│  Reviewers: [tech-lead, release-manager]                         │
│  Timeout: 24h                                                    │
│                                                                  │
│  Phase 6: Deploy to Production                                   │
│  ─────────────────────────────                                  │
│  aws ecs update-service \                                        │
│    --cluster agent-forge-prod \                                  │
│    --service web \                                               │
│    --force-new-deployment                                        │
│  → rolling deploy (min 50% healthy, max 200%)                    │
│                                                                  │
│  Phase 7: Smoke Tests on Production                              │
│  ──────────────────────────────────                             │
│  PLAYWRIGHT_BASE_URL=https://agentforge.io                       │
│  pnpm test:e2e -- e2e/smoke.spec.ts                              │
│                                                                  │
│  Phase 8: Tag Release                                            │
│  ────────────────────                                           │
│  git tag v$(cat package.json | jq -r .version)-$SHA             │
│  git push origin --tags                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 7.5 Rollback Strategy

```
Automated:
  ECS health check fails within 5 min → ECS auto-rolls back to previous task def

Manual:
  aws ecs update-service \
    --task-definition agent-forge-web:<previous-revision> \
    --cluster agent-forge-prod \
    --service web

Database:
  RDS automated backups (daily, 7-day retention)
  Point-in-time recovery (5 min RPO)
  Migration rollback via numbered migration files
```

### 7.6 Gate Check Sequence (local — before every commit)

```bash
pnpm typecheck       # 1. Zero TS errors
pnpm lint            # 2. Zero ESLint errors/warnings (no-console fires on console.*)
pnpm format:check    # 3. Zero Prettier violations
pnpm build           # 4. Production build must succeed
pnpm test:coverage   # 5. All tests pass + coverage thresholds met
pnpm exec storybook build  # 6. All stories compile
pnpm analyze         # 7. No chunk > 250 kb (main) or > 150 kb (per-route)
```

---

## 8. Security & Auth

### 8.1 Auth Architecture

```
NEXT_PUBLIC_AUTH_PROVIDER=clerk|next-auth|okta
         │
         ▼
packages/auth/src/
  adapters/
  ├── clerk/      ← default: Clerk 7 (JWKS-based tokens)
  ├── next-auth/  ← stub (NotImplementedError)
  └── okta/       ← stub (NotImplementedError)
  │
  contracts.ts   ← AuthServerAdapter · AuthClientAdapter interfaces
  │
  server-registry.ts → getSession() · requireAuth()
  client-registry.ts → useUser()
  middleware-registry.ts → buildMiddleware()
```

### 8.2 Security Controls

| Layer   | Control                                                |
| ------- | ------------------------------------------------------ |
| Edge    | WAF (AWS WAF: SQL injection, XSS, rate limiting rules) |
| CDN     | CloudFront signed URLs for private S3 assets           |
| Network | Private subnets, no public RDS/Redis access            |
| App     | CSRF via Server Actions (Next.js built-in)             |
| App     | Content Security Policy headers (`next.config.mjs`)    |
| App     | Zod validation on all Server Action inputs             |
| App     | `ApiError` class — no raw error propagation to client  |
| Auth    | Short-lived JWT (Clerk: 60s) + session cookie          |
| Secrets | AWS Secrets Manager (auto-rotation 30d)                |
| Images  | `next/image` with allowlisted remote domains only      |

---

## 9. Observability

### 9.1 Logging

```
Application logs → CloudWatch Logs (/ecs/agent-forge/web)
  • Structured JSON (level, message, requestId, userId, duration)
  • Log retention: 30 days (dev) · 90 days (staging) · 1 year (prod)

Vercel Analytics → Web Vitals (LCP, FID, CLS, INP, TTFB)
  • Built into root layout.tsx (Analytics + SpeedInsights)
```

### 9.2 Metrics & Alarms

```
CloudWatch Alarms:
  • ECS CPU > 80% for 5 min    → scale out + PagerDuty
  • ECS 5xx rate > 1%          → PagerDuty P1
  • RDS connection count > 80% → alert
  • ALB TargetResponseTime > 2s → alert

Lighthouse CI (lighthouserc.json):
  • Performance ≥ 90
  • Accessibility ≥ 90
  • Best Practices ≥ 90
  • SEO ≥ 90
```

### 9.3 Bundle Health

```bash
# Quick size check
pnpm build 2>&1 | grep "First Load JS"

# Budget targets
Main shared chunk:  < 250 kb
Per-route bundle:  < 150 kb

# Red flags (auto-fail)
recharts in any route → must use next/dynamic()
Duplicate library names in treemap → audit package versions
```

---

_Document maintained by the AgentForge engineering team. Update when architecture decisions change._
