import type { Metadata } from 'next'
import { siteConfig } from '@/config/site'

interface PageMetadataOptions {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description ?? siteConfig.description
  const metaImage = image ?? `${siteConfig.url}${siteConfig.ogImage}`

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [{ url: metaImage, width: 1200, height: 630, alt: metaTitle }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  }
}
