import type { Metadata } from 'next'
import { Inter, Oswald } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const fontHeading = Oswald({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Blue Stone Construction LLC | General Contractor in Lake Hiawatha, NJ',
    template: '%s | Blue Stone Construction LLC',
  },
  description:
    "Blue Stone Construction LLC is Lake Hiawatha's trusted general contractor. We specialize in home remodels, additions, new construction, and commercial projects across Morris County, NJ. Licensed & insured. Free estimates.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://bluestoneconstruction.com'),
  keywords: [
    'general contractor NJ',
    'home remodel Lake Hiawatha',
    'room addition Morris County',
    'new construction New Jersey',
    'contractor near me',
    'Blue Stone Construction',
  ],
  openGraph: {
    title: 'Blue Stone Construction LLC | General Contractor NJ',
    description:
      'Trusted general contracting in Lake Hiawatha, NJ. Remodels, additions, new builds. Licensed & insured. Free estimates.',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://bluestoneconstruction.com',
    siteName: 'Blue Stone Construction LLC',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blue Stone Construction LLC | General Contractor NJ',
    description: 'Trusted general contracting in Lake Hiawatha, NJ. Free estimates.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://bluestoneconstruction.llc',
  name: 'Blue Stone Construction LLC',
  description: 'General contractor serving Lake Hiawatha, NJ and Morris County.',
  url: 'https://bluestoneconstruction.llc',
  telephone: '(973) 830-6838',
  email: 'admin@bluestoneconstruction.llc',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lake Hiawatha',
    addressRegion: 'NJ',
    postalCode: '07034',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.8698,
    longitude: -74.3804,
  },
  areaServed: {
    '@type': 'State',
    name: 'New Jersey',
  },
  priceRange: '$$',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontHeading.variable}`}>
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
