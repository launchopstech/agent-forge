import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ploutos.digital'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    {
      url: `${base}/#services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/#pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/#architect`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    { url: `${base}/#trust`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/#contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
  ]
}
