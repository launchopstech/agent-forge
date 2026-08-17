import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://example.com'
  // TODO: add section anchors after scaffolding page sections (run /seo to enrich)
  return [{ url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 }]
}
