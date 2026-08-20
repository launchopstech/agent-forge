import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const fontSerif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ploutos.digital'

export const metadata: Metadata = {
  title: {
    default: 'Ploutos — Websites, Local SEO & Google Ads for Service Businesses',
    template: '%s | Ploutos',
  },
  description:
    'Ploutos builds conversion-focused websites and manages local SEO and Google Ads for service businesses across the U.S.',
  alternates: { canonical: '/' },
  metadataBase: new URL(BASE_URL),
  keywords: [
    'local service business websites',
    'local SEO agency',
    'Google Ads management',
    'contractor website design',
    'Google Business Profile optimization',
  ],
  openGraph: {
    title: 'Ploutos — Websites, Local SEO & Google Ads for Service Businesses',
    description: 'One founder-led team for your website, local search visibility, and Google Ads.',
    url: BASE_URL,
    siteName: 'Ploutos',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ploutos — Websites, Local SEO & Google Ads for Service Businesses',
    description: 'One founder-led team for your website, local search visibility, and Google Ads.',
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Ploutos',
  url: BASE_URL,
  email: 'admin@ploutos.llc',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'admin@ploutos.llc',
    contactType: 'sales',
    areaServed: 'US',
  },
  description:
    'Conversion-focused websites, local SEO, and Google Ads for service businesses across the U.S.',
  priceRange: '$$',
  areaServed: { '@type': 'Country', name: 'US' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Services for Local Business',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Website Design & Development',
          description: 'Fast, professional websites that convert visitors into customers.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Local SEO',
          description: 'Google Business Profile and on-page optimization for local visibility.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Google Ads Management',
          description: 'Search campaigns with call and conversion tracking.',
        },
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
