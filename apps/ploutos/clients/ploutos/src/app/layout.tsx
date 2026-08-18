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
    default: 'Ploutos — Websites, Online Stores & Digital Marketing for Local Business',
    template: '%s | Ploutos',
  },
  description:
    'Ploutos builds fast, professional websites, online stores, and runs Google & social ads for local businesses. No tech jargon. No long-term contracts. Just results.',
  metadataBase: new URL(BASE_URL),
  keywords: [
    'software engineering agency',
    'custom web applications',
    'growth architecture',
    'local business digital agency',
    'Shopify development',
    'workflow automation',
    'performance marketing',
    'Google local ads',
    'web portal development',
  ],
  openGraph: {
    title: 'Ploutos — Websites, Online Stores & Digital Marketing for Local Business',
    description:
      'Fast websites, online stores, and Google & social ads that bring real customers to your door.',
    url: BASE_URL,
    siteName: 'Ploutos',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ploutos — Websites, Online Stores & Digital Marketing for Local Business',
    description:
      'Fast websites, online stores, and Google & social ads that bring real customers to your door.',
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Ploutos',
  url: BASE_URL,
  email: 'hello@ploutos.digital',
  description:
    'Websites, online stores, and Google & social ads that bring real customers to local businesses. No tech jargon. No long-term contracts.',
  priceRange: '$$',
  areaServed: [
    { '@type': 'Country', name: 'AU' },
    { '@type': 'Country', name: 'US' },
  ],
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
          name: 'Online Store Setup',
          description: 'Shopify and WordPress ecommerce stores built to sell.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Google & Social Ads',
          description: 'Google Local Services Ads and social campaigns that drive foot traffic.',
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
