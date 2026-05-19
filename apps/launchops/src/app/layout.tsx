import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ClientInit } from '@/features/marketing/components/ClientInit'
import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'LaunchOps — Build. Launch. Operate.',
    template: '%s | LaunchOps',
  },
  description:
    'We design, build, and launch software products for founders, operators, and businesses ready to move fast. Your idea shipped — without the agency overhead.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://launchops.co'),
  openGraph: {
    title: 'LaunchOps — Build. Launch. Operate.',
    description:
      'We design, build, and launch software products for founders, operators, and businesses ready to move fast.',
    url: 'https://launchops.co',
    siteName: 'LaunchOps',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LaunchOps' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LaunchOps — Build. Launch. Operate.',
    description: 'We design, build, and launch software products. Your idea shipped.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LaunchOps',
  url: 'https://launchops.co',
  logo: 'https://launchops.co/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@launchops.co',
  },
}

const widgetUrl =
  process.env.NODE_ENV === 'development' &&
  (!process.env.NEXT_PUBLIC_WIDGET_URL ||
    process.env.NEXT_PUBLIC_WIDGET_URL === 'http://localhost:3000/widget.js')
    ? '/widget.js'
    : (process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://mindrithm.ai/widget.js')
const demoAgentId = process.env.NEXT_PUBLIC_DEMO_AGENT_ID?.trim()
const demoShareToken = process.env.NEXT_PUBLIC_DEMO_SHARE_TOKEN?.trim()
const forgeApiUrl =
  process.env.NEXT_PUBLIC_FORGE_API_BASE_URL ??
  process.env.NEXT_PUBLIC_FORGE_API_URL ??
  'https://api.mindrithm.ai'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <ClientInit />
        <Analytics />
        <SpeedInsights />
        {demoAgentId && demoShareToken && (
          <Script
            id="mindrithm-chat"
            src={widgetUrl}
            data-agent-id={demoAgentId}
            data-share-token={demoShareToken}
            data-api-url={forgeApiUrl}
            data-brand-color="#4f2edc"
            data-mode="floating"
            data-position="bottom-right"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  )
}
