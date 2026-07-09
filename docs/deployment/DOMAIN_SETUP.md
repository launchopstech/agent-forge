# Domain Setup — GoDaddy + Vercel

## Overview

Each client brand is deployed to its own Vercel project. Custom domains per environment are registered in `scripts/domains.json` and applied with `scripts/setup-domain.mjs`.

## Automated setup (recommended)

Add the client's domain to `scripts/domains.json`, then run:

```bash
# One project, one environment
node scripts/setup-domain.mjs --project ploutos-blue-stone --env preview

# All environments for a project
node scripts/setup-domain.mjs --project ploutos-blue-stone --all-envs

# All projects, one environment (e.g. wire up preview for every client at once)
node scripts/setup-domain.mjs --env preview --all-projects

# Dry-run (prints what would happen, makes no changes)
node scripts/setup-domain.mjs --project ploutos-blue-stone --env preview --dry-run

# List all registered projects and their domains
node scripts/setup-domain.mjs --list
```

The script:

1. Adds the domain to the Vercel project via CLI
2. Sets `NEXT_PUBLIC_APP_URL` for the correct Vercel environment tier
3. Prints the exact DNS record to add in GoDaddy

**Adding a new client:** edit `scripts/domains.json` only — no script changes needed.

---

## Manual steps

### 1. Add the domain to Vercel

In **Vercel Dashboard → Project → Settings → Domains**, click **Add Domain** and enter the client's domain (e.g. `client-a.example.com`).

Vercel will show you the DNS records to add.

### 2. Configure DNS in GoDaddy

Log in to **GoDaddy → DNS Management** for the domain.

**For a root domain (e.g. `example.com`):**

| Type | Name | Value         | TTL    |
| ---- | ---- | ------------- | ------ |
| `A`  | `@`  | `76.76.21.21` | 1 Hour |

**For a subdomain (e.g. `app.example.com`):**

| Type    | Name  | Value                  | TTL    |
| ------- | ----- | ---------------------- | ------ |
| `CNAME` | `app` | `cname.vercel-dns.com` | 1 Hour |

> Note: Vercel's IP address and CNAME target may change. Always use the values shown in the Vercel dashboard, not the ones above.

### 3. Verify propagation

DNS changes can take up to 48 hours. Check propagation with:

```bash
dig app.example.com
# or
nslookup app.example.com
```

Vercel will show a green checkmark in the Domains settings once the domain is verified.

### 4. SSL certificate

Vercel automatically provisions a Let's Encrypt TLS certificate once DNS propagation is confirmed. No manual steps required.

---

## Multi-client domain strategy

| Client   | Vercel Project        | Domain                  |
| -------- | --------------------- | ----------------------- |
| Default  | `agentforge-default`  | `agentforge.app`        |
| Client A | `agentforge-client-a` | `platform.client-a.com` |
| Client B | `agentforge-client-b` | `app.client-b.io`       |

Each Vercel project builds the same repo with `NEXT_PUBLIC_BRAND` set to the appropriate value.

## Wildcard domains (advanced)

For runtime multi-tenancy (all clients on one Vercel project, brand resolved per request via domain):

1. Add a wildcard `CNAME *.agentforge.app → cname.vercel-dns.com` in GoDaddy
2. Add `*.agentforge.app` in Vercel Domains
3. Update `src/config/brands/index.ts` SWAP POINT to resolve brand from `headers().get('host')`
