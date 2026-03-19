'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@forge/ui/src/button'
import { ArrowRight, Zap, Brain, Shield } from 'lucide-react'
import { useUser } from '@/hooks/use-user'

export default function HomePage() {
  const { isAuthenticated } = useUser()
  const t = useTranslations('marketing')
  const ctaHref = isAuthenticated ? '/dashboard' : '/signup'

  const heroCards = [
    { icon: Zap, title: t('feature1Title'), desc: t('feature1Description') },
    { icon: Brain, title: t('feature2Title'), desc: t('feature2Description') },
    { icon: Shield, title: t('feature3Title'), desc: t('feature3Description') },
  ]

  const features = [
    { title: t('featureApiTitle'), desc: t('featureApiDesc') },
    { title: t('featureMonitorTitle'), desc: t('featureMonitorDesc') },
    { title: t('featureWorkflowTitle'), desc: t('featureWorkflowDesc') },
    { title: t('featureVersionTitle'), desc: t('featureVersionDesc') },
  ]

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
  ]

  return (
    <div className="bg-background">
      {/* Announcement Banner */}
      <div className="border-b border-border bg-muted/50 px-6 py-3 text-center">
        <p className="text-sm text-muted-foreground">
          {t('announcement')}{' '}
          <a href="#" className="font-semibold text-primary hover:underline">
            {t('announcementLink')}
          </a>
        </p>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 sm:px-8 sm:py-32">
        <div className="text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {t('heroHeading')}
          </h1>
          <p className="mt-6 text-balance text-xl text-muted-foreground">{t('heroSubtitle')}</p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link href={ctaHref}>
                {isAuthenticated ? t('heroPrimaryAuth') : t('heroPrimary')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              {t('heroSecondary')}
            </Button>
          </div>
        </div>

        {/* Feature Cards in Hero */}
        <div className="mt-16 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
          {heroCards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <p className="mt-4 font-semibold text-foreground">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/30 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground">{t('featuresTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('featuresSubtitle')}</p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-border bg-card p-8">
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-foreground">{t('statsTitle')}</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary">{stat.value}</p>
                <p className="mt-2 text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="pricing"
        className="border-t border-border bg-primary px-6 py-24 text-center sm:px-8"
      >
        <h2 className="text-4xl font-bold text-primary-foreground">{t('ctaTitle')}</h2>
        <p className="mt-4 text-lg text-primary-foreground/80">{t('ctaSubtitle')}</p>
        <Button
          size="lg"
          className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          asChild
        >
          <Link href={ctaHref}>
            {isAuthenticated ? t('heroPrimaryAuth') : t('ctaButton')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
