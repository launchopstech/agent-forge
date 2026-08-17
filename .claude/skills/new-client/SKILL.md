---
name: new-client
description: Full setup for a new white-label client site in the agent-forge monorepo — scaffold app, wire CI pipeline, create Vercel project, set env vars, create deploy hooks, and add GitHub secrets. Use when the user says "new client", "add client", "onboard client", or "set up [client name]".
argument-hint: '<client-slug> [--domain <domain>] [--dry-run]'
---

End-to-end onboarding for a new white-label client. Covers all steps from scaffolding to production pipeline. Working directory: `/Users/bomatra/Developement/agentic-ai/agent-forge`.

## Prerequisites

- Vercel CLI authenticated: `vercel whoami`
- GitHub CLI authenticated: `gh auth status`
- Root `.vercel/project.json` linked to agent-forge-web (already done)

## Arguments

- `<client-slug>` — kebab-case slug for the client (e.g. `acme-plumbing`, `sunrise-dental`)
- `--domain <domain>` — production domain (e.g. `acmeplumbing.com`)
- `--dry-run` — print commands without executing

## Step 0 — Gather inputs

If `client-slug` is not provided, ask the user:
1. Client slug (kebab-case, no spaces)
2. Production domain
3. Vercel project name (default: `ploutos-<slug>`)
4. Contact email for the site (goes in contact route `to:`)

## Step 1 — Scaffold the app

Copy the `_template` client into a new directory:

```bash
cp -r apps/ploutos/clients/_template apps/ploutos/clients/<slug>
```

Then update `package.json` in the new directory:
- `name`: `@ploutos/<slug>`
- `description`: client name

Update `vercel.json`:
- `buildCommand`: `cd ../../.. && pnpm turbo build --filter=@ploutos/<slug>`

Do NOT add an `ignoreCommand` — Vercel runs it from the `rootDirectory` subdirectory, so repo-root-relative pathspecs silently resolve to nothing and every build gets skipped. Selective deploys are handled by GitHub Actions change detection in `multi-deploy/action.yml`.

Register in `pnpm-workspace.yaml` — it's already covered by `apps/ploutos/clients/*` glob, no change needed.

## Step 2 — Wire the CI pipeline

Add the new client to `.github/actions/multi-deploy/action.yml`:

1. **Input** — add after the last `hook_*` input:
```yaml
hook_<slug_under>:
  description: 'Deploy hook for ploutos-<slug>'
  required: false
  default: ''
```
Where `<slug_under>` = slug with hyphens replaced by underscores.

2. **Change detection** — add after the PLOUTOS detection line:
```bash
{ [ "$SHARED" -gt 0 ] || echo "$CHANGED" | grep -q '^apps/ploutos/clients/<slug>/'; } && <SLUG_UPPER>=true || true
echo "DEPLOY_<SLUG_UPPER>=$<SLUG_UPPER>" >> $GITHUB_ENV
```

3. **Force-deploy and first-commit fallback** — add:
```bash
echo "DEPLOY_<SLUG_UPPER>=true" >> $GITHUB_ENV
```

4. **Env block** — add:
```yaml
HOOK_<SLUG_UPPER>: ${{ inputs.hook_<slug_under> }}
```

5. **Parallel fire** — add:
```bash
fire "ploutos-<slug>" "$HOOK_<SLUG_UPPER>" "$DEPLOY_<SLUG_UPPER>" & PIDS+=($!)
```

Add `hook_<slug_under>: ${{ secrets.VERCEL_DEPLOY_HOOK_<SLUG_UPPER> }}` to all 4 workflow files:
- `.github/workflows/deploy-development.yml`
- `.github/workflows/deploy-qa.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

Also add a comment line documenting the secret in each workflow header.

## Step 3 — Register in domains.json

Add entry to `scripts/domains.json` under `projects`:

```json
"ploutos-<slug>": {
  "dir": "apps/ploutos/clients/<slug>",
  "domains": {
    "development": "dev.<domain>",
    "qa": "qa.<domain>",
    "staging": "staging.<domain>",
    "production": "<domain>"
  },
  "gitBranches": {
    "development": "develop",
    "qa": "qa",
    "staging": "staging"
  },
  "envVars": {
    "NEXT_PUBLIC_APP_ENV": {
      "development": "development",
      "qa": "qa",
      "staging": "staging",
      "production": "production"
    }
  },
  "secrets": ["RESEND_API_KEY"]
}
```

## Step 4 — Create and link the Vercel project

```bash
# Create the project
vercel projects add ploutos-<slug> --scope launch-ops

# Link the directory AND set rootDirectory + framework=nextjs on the Vercel project
node scripts/vercel-project-create.mjs --project ploutos-<slug>

# Connect to GitHub (run from repo root where .git lives)
vercel git connect --project ploutos-<slug> --scope launch-ops --yes
```

`vercel-project-create.mjs` automatically PATCHes the Vercel project after linking to set `rootDirectory` (relative path from repo root) and `framework=nextjs`. Without this, Vercel builds from the repo root and fails with missing env vars from other apps.

## Step 5 — Set Vercel environment variables

```bash
node scripts/vercel-env-set.mjs --project ploutos-<slug> --all-envs \
  --secret RESEND_API_KEY=<resend_key>
```

For any extra env vars (phone number, brand token, etc.), pass additional `--secret KEY=VALUE` flags.

## Step 6 — Create deploy hooks and GitHub secrets

```bash
node scripts/vercel-deploy-hooks.mjs --project ploutos-<slug>
```

This creates 4 Vercel deploy hooks (develop/qa/staging/main) and adds `VERCEL_DEPLOY_HOOK_<SLUG_UPPER>` to all 4 GitHub environments automatically.

## Step 7 — DNS setup (optional, if domain is ready)

```bash
node scripts/setup-domain.mjs --project ploutos-<slug> --all-envs
```

This configures custom domains in Vercel. DNS records still need to be set in GoDaddy — the script prints exact records to add.

## Step 8 — Commit and push

Commit all new files on `develop`:
- `apps/ploutos/clients/<slug>/` (all scaffolded files)
- `apps/ploutos/clients/<slug>/.vercel/project.json`
- `scripts/domains.json` (updated registry)
- `.github/actions/multi-deploy/action.yml` (updated)
- `.github/workflows/deploy-*.yml` (updated ×4)

```
feat(ploutos): add <slug> client site and wire into deploy pipeline
```

Push `develop` → CI fires → first dev deploy.

## Step 9 — Ship to production

Follow the branch chain:
1. Push `develop` → dev deploy
2. PR `develop` → `qa` → merge → QA deploy
3. PR `qa` → `main` → production approval → live

## Verification checklist

- [ ] `pnpm --filter @ploutos/<slug> typecheck` passes
- [ ] Dev deploy URL loads with correct branding
- [ ] Contact form submits → email arrives via Resend
- [ ] GitHub Actions shows the new client in the deploy step output
- [ ] Production deploy URL resolves at `<domain>`
