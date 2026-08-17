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
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Ploutos',
  url: BASE_URL,
  email: 'hello@ploutos.digital',
  description: 'Elite software engineering and growth architecture agency.',
  priceRange: '$$$',
  areaServed: { '@type': 'Country', name: 'AU' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Engineering Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Engineering',
          description: 'Dashboards, web portals, automation tools, API and database architectures.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Premium Digital Commerce',
          description: 'Custom WordPress frameworks, Shopify development, speed optimization.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Performance Marketing',
          description: 'Google Local Services Ads, advanced local SEO, conversion tracking.',
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
