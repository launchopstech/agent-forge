---
name: seo
description: Audit and fix SEO for a ploutos client site — metadata, JSON-LD schema, sitemap, OG image, Apple touch icon, local SEO signals, and Core Web Vitals hygiene. Use when asked to "fix SEO", "improve search ranking", "check metadata", or "add structured data".
argument-hint: '<client-slug> [--audit-only] [--schema local-business|restaurant|ecommerce|saas]'
---

End-to-end SEO audit and fix for a ploutos client site. Runs as audit-then-fix: reads current state, reports gaps, then applies targeted improvements. Working directory: `/Users/bomatra/Developement/agentic-ai/agent-forge`.

## Arguments

- `<client-slug>` — kebab-case slug matching the client directory (e.g. `ploutos`, `blue-stone`)
- `--audit-only` — print gap table without making changes
- `--schema <type>` — JSON-LD schema type: `local-business` (default) | `restaurant` | `ecommerce` | `saas`

## Step 0 — Gather Inputs

If `client-slug` not provided, ask:
1. Client slug (kebab-case, must match `apps/ploutos/clients/<slug>`)
2. Business type for JSON-LD: `local-business` | `restaurant` | `ecommerce` | `saas`
3. Phone number and full address (street, city, state, zip) — needed for local pack ranking
4. Business hours (optional)
5. Social profile URLs (optional — for `sameAs` in JSON-LD)

Set `APP_DIR=apps/ploutos/clients/<slug>/src/app`.

## Step 1 — Audit Current State

Read each file and report a gap table. Stop here if `--audit-only`.

| File | What to check |
|------|---------------|
| `layout.tsx` | `metadataBase` set from env var; `title.template`; `twitter.images` set; JSON-LD `@type` and address/phone/geo fields |
| `sitemap.ts` | All page sections listed with correct `changeFrequency` and `priority` values |
| `robots.ts` | `allow: '/'`, `sitemap` pointer uses env var |
| `opengraph-image.tsx` | Exists? 1200×630? Brand colors? |
| `apple-touch-icon.tsx` | Exists? (App Router metadata image route, 180×180) |
| `vercel.json` | `redirects` block for www → apex? |
| `page.tsx` + section components | `<img>` tags without `alt`; hero image uses `next/image` with `priority`? |

Output format:
```
SEO Audit — <slug>
──────────────────────────────────────────────────────
✓ metadata.title.template
✓ metadata.openGraph
✓ opengraph-image.tsx               (auto-discovered by Next.js)
✗ apple-touch-icon.tsx              MISSING
✗ JSON-LD address/phone             MISSING — required for Google local pack
✓ sitemap.ts                        present
✗ sitemap section routes            only homepage; sections not listed
✓ robots.ts                         correct
✗ www → apex redirect               missing in vercel.json
```

## Step 2 — Fix `layout.tsx`

### 2a — Twitter images

If `twitter.images` not set, add it. `opengraph-image.tsx` auto-discovered by Next.js handles OG — the twitter card still needs an explicit image URL:

```typescript
twitter: {
  card: 'summary_large_image',
  images: [`${BASE_URL}/opengraph-image`],
}
```

**Do NOT add `openGraph.images`** — Next.js auto-discovers `opengraph-image.tsx` for OG. Setting both causes duplicate OG image tags.

### 2b — Enrich JSON-LD for local business

Replace/extend the `<script type="application/ld+json">` block. Use `@type` based on `--schema` flag:

| Flag | `@type` |
|------|---------|
| `local-business` (default) | `LocalBusiness` |
| `restaurant` | `Restaurant` |
| `ecommerce` | `Organization` |
| `saas` | `SoftwareApplication` |

For `LocalBusiness` / `Restaurant` — include address, phone, and geo when provided:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: '<Business Name>',
  url: BASE_URL,
  email: 'hello@<domain>',
  telephone: '+1-XXX-XXX-XXXX',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '...',
    addressLocality: '...',
    addressRegion: '...',
    postalCode: '...',
    addressCountry: 'AU',  // or 'US', etc.
  },
  // geo: only add if you have accurate coordinates — wrong coords hurt local pack
  areaServed: [{ '@type': 'Country', name: 'AU' }],
  sameAs: [],  // add social profile URLs if available
  hasOfferCatalog: { /* keep existing services block */ },
}
```

## Step 3 — Enrich `sitemap.ts`

List all section anchors. First, read `src/app/page.tsx` and grep component files for `id=` attributes to find actual anchor IDs. Then map them to priorities:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://example.com'
  return [
    { url: base,                  lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/#services`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#pricing`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#contact`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.7 },
    { url: `${base}/#about`,      lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.6 },
  ]
}
```

For sites with real sub-routes (`/services`, `/blog/[slug]`), add full URL paths instead of anchor fragments. Read the `src/app/` directory structure to find all route segments.

## Step 4 — Scaffold Missing Files

### `opengraph-image.tsx` (if missing)

Follow the pattern from `apps/ploutos/clients/ploutos/src/app/opengraph-image.tsx`:
- Uses `ImageResponse` from `next/og`
- Size: `{ width: 1200, height: 630 }`
- Brand primary background, logo mark, brand name, tagline
- Exports: `alt`, `size`, `contentType`

### `apple-touch-icon.tsx` (if missing)

Create `src/app/apple-touch-icon.tsx` — the App Router metadata image route for iOS home-screen icon:

```typescript
import { ImageResponse } from 'next/og'

export const alt = '<Brand Name>'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleTouchIcon() {
  return new ImageResponse(
    <div style={{ background: '<bg-color>', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 120, height: 120, borderRadius: 28, background: '<brand-primary>', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Logo mark — SVG or text symbol */}
      </div>
    </div>,
    { ...size }
  )
}
```

Follow the brand colors from `globals.css` or the existing `opengraph-image.tsx`.

## Step 5 — Core Web Vitals Hygiene

```bash
# Find raw <img> tags — hero/above-fold images must use next/image
grep -rn '<img ' apps/ploutos/clients/<slug>/src/ --include='*.tsx'

# Confirm hero has priority prop
grep -rn 'priority' apps/ploutos/clients/<slug>/src/ --include='*.tsx'
```

For any above-fold `<img>` lacking `next/image` and `priority`: flag it — this directly impacts LCP score and page ranking. Flag missing `alt` as both accessibility and SEO issue.

## Step 6 — www → apex Redirect

Add to `vercel.json` in the client directory if the `redirects` array is missing:

```json
{
  "redirects": [
    {
      "source": "/(.*)",
      "has": [{ "type": "host", "value": "www.<domain>" }],
      "destination": "https://<domain>/$1",
      "permanent": true
    }
  ]
}
```

This prevents duplicate-content penalty from `www` and apex both serving the same content.

**Prerequisite**: `www.<domain>` must be added as a domain on the Vercel project. Verify in Vercel dashboard → Domains. If not added, run:
```bash
vercel api /v9/projects/<project-id>/domains --scope launch-ops -X POST -F name=www.<domain>
```

## Step 7 — Backport to `_template`

After fixes are proven on the client, create SEO starter files in `apps/ploutos/clients/_template/src/app/` so future `/new-client` scaffolds start SEO-complete:

- `opengraph-image.tsx` — placeholder with `TODO: replace with brand colors/logo`
- `apple-touch-icon.tsx` — same pattern
- `sitemap.ts` — env-driven base URL, homepage entry with TODO comment for sections
- `robots.ts` — standard allow-all with sitemap pointer

Check `_template/package.json` exists before creating `src/` — Next.js needs it.

## Verification Checklist

- [ ] `pnpm --filter @ploutos/<slug> build` passes — no TypeScript or module errors
- [ ] `curl https://<domain>/sitemap.xml` returns XML with all expected routes
- [ ] `curl https://<domain>/robots.txt` shows `Sitemap:` pointing to correct URL
- [ ] `curl -s https://<domain>/ | grep -A5 'application/ld+json'` shows JSON-LD with updated fields
- [ ] OG image loads at `https://<domain>/opengraph-image` in browser
- [ ] Apple touch icon loads at `https://<domain>/apple-touch-icon` in browser
- [ ] Validate JSON-LD: paste into Google Rich Results Test or schema.org/SchemaValidator
- [ ] `curl -I https://www.<domain>/` returns HTTP 301 → `https://<domain>/`
- [ ] After first production deploy: submit `https://<domain>/sitemap.xml` to Google Search Console

## Known Gotchas

**OG image auto-discovery**: Next.js App Router discovers `opengraph-image.tsx` automatically — do NOT also set `openGraph.images` in `metadata`. Both active causes duplicate OG image tags in `<head>`. The twitter card still needs an explicit `images` array (different system).

**Anchor routes in sitemap**: Google crawls `/#services` but does not treat it as a separate indexable page. Add anchor entries as lower-priority signals, not as ranking shortcuts. For real sub-pages use full paths.

**JSON-LD geo coordinates**: Only add `geo` if you have accurate lat/lng. Wrong coordinates hurt local pack ranking more than omitting them entirely.

**www redirect + Vercel domains**: The redirect in `vercel.json` only fires if `www.<domain>` is actually registered as a Vercel project domain. Check the dashboard — if `www` isn't listed, the redirect config is a no-op.

**`_template` has no `src/`**: Creating `src/app/` inside `_template` is new structure. Confirm `_template/package.json` exists and has a `name` field before scaffolding — otherwise `pnpm turbo` won't discover it as a workspace package.
