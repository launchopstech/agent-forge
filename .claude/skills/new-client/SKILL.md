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

## Step 7 — Domain setup (do when domain is ready)

Two sub-steps: add domains to Vercel, then set DNS in GoDaddy. Order matters — add to Vercel first so Vercel can verify ownership after DNS propagates.

### 7a — Add custom domains to the Vercel project

```bash
node scripts/setup-domain.mjs --project ploutos-<slug> --all-envs
```

This adds all four domains from `domains.json` (`dev.<domain>`, `qa.<domain>`, `staging.<domain>`, `<domain>`) to the Vercel project and maps each to the correct git branch. The script prints the exact DNS records needed — copy them for Step 7b.

Dry-run first to preview:
```bash
node scripts/setup-domain.mjs --project ploutos-<slug> --all-envs --dry-run
```

### 7b — Set DNS records in GoDaddy (automated)

Requires GoDaddy API credentials in macOS Keychain (one-time setup via `scripts/godaddy-credentials.mjs`). Once configured:

```bash
# Dry-run first — see exactly what will be created
node scripts/godaddy-dns-set.mjs --project ploutos-<slug> --dry-run

# Apply — idempotent, safe to re-run
node scripts/godaddy-dns-set.mjs --project ploutos-<slug>
```

This creates:
- `A @ → 76.76.21.21` (production root domain)
- `CNAME www → cname.vercel-dns.com`
- `CNAME dev → cname.vercel-dns.com`
- `CNAME qa → cname.vercel-dns.com`
- `CNAME staging → cname.vercel-dns.com`

### 7c — Verify

DNS propagation takes 5–30 min. Check with:
```bash
dig dev.<domain>       # should resolve to 76.76.21.21 or cname.vercel-dns.com
dig <domain>           # should resolve to 76.76.21.21
```

Vercel provisions SSL automatically once DNS resolves. Check domain status:
```bash
vercel domains inspect <domain> --scope launch-ops
```

### 7d — Set `NEXT_PUBLIC_APP_URL` per environment

Once domains resolve, add the URL env var for each environment so the app knows its own origin:

```bash
# Development (branch: develop)
vercel env add NEXT_PUBLIC_APP_URL --scope launch-ops --project ploutos-<slug>
# Enter: https://dev.<domain>  →  Environment: Preview  →  Git branch: develop

# QA (branch: qa)
vercel env add NEXT_PUBLIC_APP_URL --scope launch-ops --project ploutos-<slug>
# Enter: https://qa.<domain>   →  Environment: Preview  →  Git branch: qa

# Staging (branch: staging)
vercel env add NEXT_PUBLIC_APP_URL --scope launch-ops --project ploutos-<slug>
# Enter: https://staging.<domain> → Environment: Preview → Git branch: staging

# Production
vercel env add NEXT_PUBLIC_APP_URL --scope launch-ops --project ploutos-<slug>
# Enter: https://<domain>      →  Environment: Production
```

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

**Vercel project (run after Step 4):**
- [ ] `vercel project inspect ploutos-<slug> --scope launch-ops` shows `Root Directory: apps/ploutos/clients/<slug>` and `Framework Preset: Next.js` — if not, the PATCH in `vercel-project-create.mjs` failed; fix manually in dashboard
- [ ] First preview deployment in `vercel list` shows `● Ready`, not `Canceled` or `● Error`
- [ ] Build log shows `@ploutos/<slug>:build` — NOT `@forge/web:build` (wrong root dir symptom)

**CI (run after Step 8 push):**
- [ ] All 4 checks pass: `lint`, `typecheck`, `test`, `build`
- [ ] `Vercel – ploutos-<slug>: Deployment has completed` in PR checks
- [ ] GitHub Actions deploy step shows `ploutos-<slug>` in the fired hooks output

**End-to-end:**
- [ ] `pnpm --filter @ploutos/<slug> typecheck` passes locally
- [ ] Preview URL loads with correct branding (no `@forge/web` 404 or env error)
- [ ] Contact form submits → email arrives via Resend to `hello@<domain>`
- [ ] Production deploy URL resolves at `<domain>`

## Known gotchas

**`rootDirectory` not set after `vercel link`**
`vercel link --yes` only creates the local `.vercel/project.json` — it does NOT set `rootDirectory` on the Vercel project server-side. Without it, Vercel builds from the repo root, pulls in `@forge/web`, and fails with missing env vars. `vercel-project-create.mjs` handles this automatically via `vercel api PATCH`.

**`ignoreCommand` breaks when `rootDirectory` is set**
Vercel runs `ignoreCommand` from `rootDirectory`, so repo-root-relative pathspecs (e.g. `apps/ploutos/clients/<slug>/`) resolve to nothing → git diff always exits 0 → every build is skipped. Do not add `ignoreCommand` to `vercel.json`. Selective deploys are handled by GitHub Actions change detection in `multi-deploy/action.yml`.

**GitHub environment name is `Production` (capital P)**
When setting secrets with `gh secret set --env`, the production environment name is `Production`, not `production`. A 503 from `gh secret set` usually means the environment name is wrong. `vercel-deploy-hooks.mjs` already has this hardcoded correctly.

**`vercel git connect` must run from repo root**
`vercel git connect` needs the `.git` directory — run it from the agent-forge repo root, not the client subdirectory.
