import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@forge/ui/src/button'
import { ArrowRight, ClipboardCheck, MessagesSquare, Rocket, ShieldCheck } from 'lucide-react'
import { ResponsiveImage } from '@/components/ResponsiveImage'

function getDemoHref(): string | null {
  const agentId = process.env.NEXT_PUBLIC_DEMO_AGENT_ID?.trim()
  const shareToken = process.env.NEXT_PUBLIC_DEMO_SHARE_TOKEN?.trim()

  if (!agentId || !shareToken) return null

  return `/chat/${encodeURIComponent(agentId)}?token=${encodeURIComponent(shareToken)}`
}

export default async function HomePage() {
  const t = await getTranslations('marketing')
  const demoHref = getDemoHref()
  const heroCards = [
    { icon: ShieldCheck, title: t('feature1Title'), desc: t('feature1Description') },
    { icon: MessagesSquare, title: t('feature2Title'), desc: t('feature2Description') },
    { icon: Rocket, title: t('feature3Title'), desc: t('feature3Description') },
  ]
  const problemCards = [
    {
      label: t('problemExternalLabel'),
      title: t('problemExternalTitle'),
      desc: t('problemExternalDesc'),
    },
    {
      label: t('problemInternalLabel'),
      title: t('problemInternalTitle'),
      desc: t('problemInternalDesc'),
    },
    {
      label: t('problemPhilosophicalLabel'),
      title: t('problemPhilosophicalTitle'),
      desc: t('problemPhilosophicalDesc'),
    },
  ]
  const features = [
    { title: t('featureBuilderTitle'), desc: t('featureBuilderDesc') },
    { title: t('featureReviewTitle'), desc: t('featureReviewDesc') },
    { title: t('featurePublishTitle'), desc: t('featurePublishDesc') },
    { title: t('featureWhiteLabelTitle'), desc: t('featureWhiteLabelDesc') },
    { title: t('featureRegulatedTitle'), desc: t('featureRegulatedDesc') },
  ]
  const proofSteps = [
    { title: t('proofGovernTitle'), desc: t('proofGovernDesc'), tone: 'border-emerald-500/40' },
    { title: t('proofTestTitle'), desc: t('proofTestDesc'), tone: 'border-amber-500/40' },
    { title: t('proofPublishTitle'), desc: t('proofPublishDesc'), tone: 'border-rose-500/40' },
  ]
  const screenshots = [
    {
      src: '/screenshots/dashboard.png',
      alt: t('dashboardScreenshotAlt'),
      title: t('dashboardScreenshotTitle'),
    },
    {
      src: '/screenshots/builder.png',
      alt: t('builderScreenshotAlt'),
      title: t('builderScreenshotTitle'),
    },
    {
      src: '/screenshots/test-chat.png',
      alt: t('chatScreenshotAlt'),
      title: t('chatScreenshotTitle'),
    },
  ]

  return (
    <div id="top" className="bg-background">
      <div className="border-b border-border bg-muted/50 px-6 py-3 text-center">
        <p className="text-sm text-muted-foreground">
          {t('announcement')}{' '}
          <a href="#ownership" className="font-semibold text-primary hover:underline">
            {t('announcementLink')}
          </a>
        </p>
      </div>

      <section className="relative isolate overflow-hidden bg-background px-6 py-20 sm:px-8">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">{t('eyebrow')}</p>
            <h1 className="mt-5 text-balance text-4xl font-bold text-foreground">
              {t('heroHeading')}
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-xl text-muted-foreground">
              {t('heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  {t('heroPrimary')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              {demoHref && (
                <Button size="lg" variant="outline" asChild>
                  <Link href={demoHref}>{t('heroSecondary')}</Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {heroCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
                <p className="mt-4 font-semibold text-foreground">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="problem" className="border-t border-border bg-muted/30 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">{t('problemEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">{t('problemTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('problemSubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {problemCards.map((problem) => (
              <div key={problem.title} className="rounded-lg border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {problem.label}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-foreground">{problem.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border bg-background px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">{t('featuresEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">{t('featuresTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('featuresSubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-border bg-card p-7">
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ownership" className="border-t border-border px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">{t('proofEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">{t('proofTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('proofSubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {proofSteps.map((step) => (
              <div key={step.title} className={`rounded-lg border bg-card p-7 ${step.tone}`}>
                <ClipboardCheck className="h-6 w-6 text-primary" />
                <h3 className="mt-5 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="border-t border-border bg-muted/30 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary">{t('screenshotsEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold text-foreground">{t('screenshotsTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('screenshotsSubtitle')}</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {screenshots.map((screenshot) => (
              <figure key={screenshot.src} className="rounded-lg border border-border bg-card p-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-border bg-muted">
                  <ResponsiveImage
                    src={screenshot.src}
                    alt={screenshot.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-2 pt-3 text-sm font-medium text-foreground">
                  {screenshot.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-border bg-primary px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-primary-foreground">{t('ctaTitle')}</h2>
          <p className="mt-4 text-lg text-primary-foreground/90">{t('ctaSubtitle')}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              asChild
            >
              <Link href="/signup">
                {t('ctaButton')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            {demoHref && (
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href={demoHref}>{t('ctaSecondary')}</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
