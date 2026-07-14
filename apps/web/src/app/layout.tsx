import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { AuthProvider } from '@forge/auth/provider'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeSwitcher } from '@forge/ui/src/theme-switcher'
import { TenantProvider, activeBrand, brandCssVars } from '@forge/brand'
import { siteConfig } from '@forge/config/src/site'
import '@forge/config/src/env'
import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: activeBrand.site.name,
      template: `%s | ${activeBrand.site.name}`,
    },
    description: activeBrand.site.description,
    metadataBase: new URL(siteConfig.url ?? 'http://localhost:3000'),
    generator: 'v0.app',
    openGraph: {
      title: activeBrand.site.name,
      description: activeBrand.site.description,
      url: activeBrand.site.url,
      siteName: activeBrand.site.name,
      images: [
        {
          url: activeBrand.site.ogImage ?? '/og.png',
          width: 1200,
          height: 630,
          alt: activeBrand.site.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: activeBrand.site.name,
      description: activeBrand.site.description,
      images: [activeBrand.site.ogImage ?? '/og.png'],
    },
    icons: {
      icon: activeBrand.assets.faviconPath,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Brand CSS variables injected server-side to prevent FOUC */}
        <style dangerouslySetInnerHTML={{ __html: brandCssVars(activeBrand) }} />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TenantProvider brand={activeBrand}>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <ThemeSwitcher />
              </ThemeProvider>
            </AuthProvider>
          </TenantProvider>
        </NextIntlClientProvider>
        <Analytics />
        {process.env.VERCEL_SPEED_INSIGHTS_ID && <SpeedInsights />}
      </body>
    </html>
  )
}
