# Multi-Project Deploy Hooks Spec

## Problem

Each deploy workflow (`deploy-development.yml`, `deploy-qa.yml`,
`deploy-staging-prod.yml`) previously fired a single `VERCEL_DEPLOY_HOOK`
per GitHub Environment — targeting only `@forge/web`. All other Vercel
projects in the monorepo (`ploutos-blue-stone`, `launchops`, future Ploutos
clients) received no deploy trigger and were silently Canceled by Vercel's
`ignoreCommand` when the most recent commit didn't touch their subdirectory.

**Discovered 2026-06-28:** `ploutos-blue-stone` develop builds were Canceled
for hours after CI showed "Deploy to Development ✓". The hook fired against
`agent-forge-web`, not `ploutos-blue-stone`.

---

## Solution

A new reusable workflow `shared-deploy.yml` accepts one deploy hook secret per
Vercel project and fires all non-empty hooks in parallel. Each deploy workflow
calls `shared-deploy.yml` instead of the inline `curl`.

**Skip a project:** leave its secret empty or unset. The workflow logs
`⏭ Skipping <project> (no hook configured)` and continues. No registry edits,
no flags.

**Add a new project:** create a Vercel deploy hook, add the secret to each
GitHub Environment, then add one line each to `shared-deploy.yml`'s secrets
block and bash HOOKS map.

---

## Architecture

```
deploy-development.yml
deploy-qa.yml              ──calls──►  shared-deploy.yml
deploy-staging-prod.yml                (fires hooks in parallel)
                                              │
                              ┌───────────────┼──────────────────┐
                              ▼               ▼                  ▼
                        agent-forge-web  ploutos-blue-stone  launchops
                        (VERCEL_DEPLOY_  (VERCEL_DEPLOY_     (VERCEL_DEPLOY_
                          HOOK)           HOOK_BLUE_STONE)    HOOK_LAUNCHOPS)
```

`shared-deploy.yml` fires each non-empty hook as a background `curl` process
and uses `wait` to collect exit codes — all hooks run in parallel, the job
fails if any hook curl returns non-zero.

---

## Projects & Secrets

| Project              | Secret name                     | Status                                                                   |
| -------------------- | ------------------------------- | ------------------------------------------------------------------------ |
| `agent-forge-web`    | `VERCEL_DEPLOY_HOOK`            | Existing — unchanged                                                     |
| `ploutos-blue-stone` | `VERCEL_DEPLOY_HOOK_BLUE_STONE` | Hook created 2026-06-28 (id `vWmJ0MhFRW`) — **secret not yet in GitHub** |
| `launchops`          | `VERCEL_DEPLOY_HOOK_LAUNCHOPS`  | **Blocked: `apps/launchops/` not yet Vercel-linked**                     |

Hook URL for blue-stone development (save as `VERCEL_DEPLOY_HOOK_BLUE_STONE`
in the `development` GitHub Environment):

```
https://api.vercel.com/v1/integrations/deploy/prj_GqcFqOFTxeMk6rEv0KYcKqb5aqBy/vWmJ0MhFRW
```

---

## Todos

### Blue-stone — immediate

- [ ] Add `VERCEL_DEPLOY_HOOK_BLUE_STONE` to GitHub `development` Environment
      (hook URL above — already created)
- [ ] Create deploy hook for `ploutos-blue-stone` staging environment in Vercel
- [ ] Add `VERCEL_DEPLOY_HOOK_BLUE_STONE` to GitHub `staging` Environment
- [ ] Create deploy hook for `ploutos-blue-stone` production environment in Vercel
- [ ] Add `VERCEL_DEPLOY_HOOK_BLUE_STONE` to GitHub `production` Environment

### Launchops — prerequisite: Vercel link

- [ ] Run `vercel link` from `apps/launchops/` to create `.vercel/project.json`
- [ ] Create deploy hooks for launchops (development, staging, production)
- [ ] Add `VERCEL_DEPLOY_HOOK_LAUNCHOPS` to all three GitHub Environments

### Workflow — done

- [x] Create `.github/workflows/shared-deploy.yml`
- [x] Update `deploy-development.yml` to call `shared-deploy.yml`
- [x] Update `deploy-qa.yml` to call `shared-deploy.yml`
- [x] Update `deploy-staging-prod.yml` to call `shared-deploy.yml`

---

## Adding a new Ploutos client (runbook)

1. Copy `apps/ploutos/clients/_template/` → rename, replace `CLIENT_SLUG`
2. `vercel link` from the new client directory (creates `.vercel/project.json`)
3. In Vercel dashboard, create deploy hooks for **development**, **staging**,
   and **production** environments
4. Add `VERCEL_DEPLOY_HOOK_<CLIENT>` to each of the three GitHub Environments
5. In `.github/workflows/shared-deploy.yml`, add:
   - One line in `secrets:` block: `VERCEL_DEPLOY_HOOK_<CLIENT>: { required: false }`
   - One line in the bash `HOOKS` map: `[ploutos-<client>]="$HOOK_<CLIENT>"`
   - One `env:` entry: `HOOK_<CLIENT>: ${{ secrets.VERCEL_DEPLOY_HOOK_<CLIENT> }}`
6. In each of the three deploy workflows, pass the new secret through
7. Done — next push to `develop` deploys the new client automatically

---

## Why deploy hooks bypass ignoreCommand

Vercel's `ignoreCommand` (`git diff HEAD^ HEAD --quiet -- <path>`) only applies
to deployments triggered by the GitHub integration (push/PR events). Deploy hooks
trigger a build unconditionally. Vercel's incremental build cache means unchanged
files don't rebuild; the hook simply queues the build job without running the
ignore check.

This is intentional — the CI workflow already knows a deploy is needed (the
push event triggered it). We don't want Vercel second-guessing that.
