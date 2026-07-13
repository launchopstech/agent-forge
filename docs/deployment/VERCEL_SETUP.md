# Vercel Setup — Multi-Client Deployment

Each client brand gets its own Vercel project pointing at the same GitHub repository. The only difference between deployments is the `NEXT_PUBLIC_BRAND` environment variable.

For the full identity, API, DNS, and tenant verification checklist, use the canonical [New Tenant / White-Label Org Setup](../../../docs/runbooks/new-tenant-setup.md) runbook.

## Initial Setup (one-time per client)

### 1. Create a new Vercel project

```bash
# Link the repo to a new Vercel project (run from repo root)
pnpm dlx vercel link
```

In the Vercel dashboard → **Add New Project** → import the same GitHub repo. Give it a meaningful name (e.g. `agentforge-client-a`).

### 2. Set environment variables

In **Vercel Dashboard → Project → Settings → Environment Variables**, add:

| Variable                         | Value                                                          | Environments                     |
| -------------------------------- | -------------------------------------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_BRAND`              | `client-a`                                                     | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL`            | `https://client-a.example.com`                                 | Production                       |
| `NEXT_PUBLIC_APP_URL`            | `https://staging.client-a.example.com`                         | Preview                          |
| `NEXT_PUBLIC_APP_URL`            | `http://localhost:3000`                                        | Development                      |
| `NEXT_PUBLIC_APP_ENV`            | `production`                                                   | Production                       |
| `NEXT_PUBLIC_APP_ENV`            | `staging`                                                      | Preview                          |
| `NEXT_PUBLIC_APP_ENV`            | `development`                                                  | Development                      |
| `NEXT_PUBLIC_FORGE_API_BASE_URL` | `https://api.client-a.example.com`                             | All                              |
| `NEXT_PUBLIC_AUTH_PROVIDER`      | `auth-handler`                                                 | All                              |
| `NEXT_PUBLIC_ORG_ID`             | `org_...`                                                      | All                              |
| `AUTH_HANDLER_ISSUER`            | `https://auth.client-a.example.com/auth`                       | All                              |
| `AUTH_HANDLER_CLIENT_ID`         | `agent-forge-web`                                              | All                              |
| `AUTH_HANDLER_REDIRECT_URI`      | `https://client-a.example.com/callback`                        | Production                       |
| `AUTH_HANDLER_REDIRECT_URI`      | `https://staging.client-a.example.com/callback`                | Preview                          |
| `AUTH_HANDLER_REDIRECT_URI`      | `http://localhost:3000/callback`                               | Development                      |
| `AUTH_HANDLER_SCOPE`             | `openid profile email offline_access agents:read agents:write` | All                              |
| `AUTH_HANDLER_CONNECTION`        | `clerk`                                                        | All                              |
| `AUTH_HANDLER_SESSION_SECRET`    | encrypted random secret                                        | All                              |
| `AUTH_HANDLER_ORG_ID`            | `org_...`                                                      | Optional server-only override    |

`NEXT_PUBLIC_ORG_ID` is required for auth-handler deployments. The web auth routes pass it as OAuth `org_id` so auth-handler mints platform JWTs with a non-empty `org_id` claim. If this value is missing, new users can sign in but tenant-scoped API calls such as `GET /api/agent-templates`, `GET /api/agents`, and `GET /api/metrics` will return 403.

`AUTH_HANDLER_ORG_ID` is optional and only needed when you want a server-only org ID override. If it is unset, the routes fall back to `NEXT_PUBLIC_ORG_ID`.

Legacy Clerk-direct deployments may still use:

| Variable                            | Value                     | Environments |
| ----------------------------------- | ------------------------- | ------------ |
| `NEXT_PUBLIC_AUTH_PROVIDER`         | `clerk`                   | All          |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | _(client's Clerk key)_    | All          |
| `CLERK_SECRET_KEY`                  | _(client's Clerk secret)_ | All          |

### 3. Pull env vars locally for this client

```bash
pnpm dlx vercel env pull --environment=development
```

### 4. Deploy

Push to `main` — Vercel auto-deploys. Each Vercel project independently builds with its own env vars.

---

## Brand values

| `NEXT_PUBLIC_BRAND` | Description                          |
| ------------------- | ------------------------------------ |
| `default`           | AgentForge purple brand (hue 280)    |
| `mindrithm`         | MindRithm indigo/slate (Clean Slate) |
| `client-a`          | Blue brand (hue 220)                 |
| `client-b`          | Green brand (hue 150)                |

## Adding a new brand

1. Create `src/config/brands/client-c.ts` with `BrandConfig`
2. Register in `src/config/brands/index.ts` → `brandRegistry`
3. Add placeholder assets in `public/brands/client-c/`
4. Set `NEXT_PUBLIC_BRAND=client-c` in the new Vercel project

## Environment variable inheritance

Vercel supports variable inheritance across environments (Production → Preview → Development). Set shared values once and override per-environment where needed.

To sync non-sensitive vars from Vercel to GitHub Actions:

```bash
gh variable set NEXT_PUBLIC_APP_URL --body "https://client-a.example.com"
gh variable set NEXT_PUBLIC_BRAND --body "client-a"
```
