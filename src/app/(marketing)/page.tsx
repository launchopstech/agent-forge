'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Brain, Shield, MessageSquare, BarChart2, Code2, Database, GitBranch, Bell } from 'lucide-react'
import { useUser } from '@/hooks/use-user'

export default function HomePage() {
  const { isAuthenticated } = useUser()
  const ctaHref = isAuthenticated ? '/dashboard' : '/signup'
  return (
    <div className="bg-background">
      {/* Announcement Banner */}
      <div className="border-b border-border bg-muted/50 px-6 py-3 text-center">
        <p className="text-sm text-muted-foreground">
          New: Enterprise features now available.{' '}
          <a href="#" className="font-semibold text-primary hover:underline">
            Learn more →
          </a>
        </p>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 sm:px-8 sm:py-32">
        <div className="text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Build intelligent agents that work for you
          </h1>
          <p className="mt-6 text-balance text-xl text-muted-foreground">
            The complete platform for building, deploying, and managing AI agents. Automate complex
            workflows with enterprise-grade reliability.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              asChild
            >
              <Link href={ctaHref}>
                {isAuthenticated ? 'Go to Dashboard' : 'Start Building Free'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Feature Cards in Hero */}
        <div className="mt-16 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <Zap className="h-6 w-6 text-primary" />
            <p className="mt-4 font-semibold text-foreground">Fast Deployment</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Deploy agents in minutes, not weeks
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Brain className="h-6 w-6 text-primary" />
            <p className="mt-4 font-semibold text-foreground">AI-Powered</p>
            <p className="mt-2 text-sm text-muted-foreground">Leverage latest LLM models</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <Shield className="h-6 w-6 text-primary" />
            <p className="mt-4 font-semibold text-foreground">Enterprise Security</p>
            <p className="mt-2 text-sm text-muted-foreground">SOC 2 compliant infrastructure</p>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground">What can you do?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From customer support to data pipelines — AgentForge agents handle it all
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: 'Automate Support',
                desc: 'Answer customer questions, triage tickets, and escalate edge cases — 24/7 without human intervention.',
              },
              {
                icon: BarChart2,
                title: 'Generate Reports',
                desc: 'Pull data from any source, analyze trends, and deliver formatted reports to your inbox on any schedule.',
              },
              {
                icon: Code2,
                title: 'Run Code & Scripts',
                desc: 'Execute scripts, call CLIs, and chain together code-based tasks as part of a larger automated workflow.',
              },
              {
                icon: Database,
                title: 'Process Data',
                desc: 'Ingest, clean, transform, and route structured or unstructured data across your entire stack.',
              },
              {
                icon: GitBranch,
                title: 'Orchestrate Workflows',
                desc: 'Design multi-step, branching workflows that adapt based on real-time inputs and outcomes.',
              },
              {
                icon: Bell,
                title: 'Monitor & Alert',
                desc: 'Watch APIs, services, and metrics — trigger alerts or automated remediation when something goes wrong.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-6">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/30 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground">Powerful features</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to build sophisticated AI agents
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {[
              { title: 'API Integration', desc: 'Connect to any API or service seamlessly' },
              {
                title: 'Real-time Monitoring',
                desc: 'Track agent performance with live dashboards',
              },
              { title: 'Custom Workflows', desc: 'Design complex multi-step agent behaviors' },
              { title: 'Version Control', desc: 'Manage agent versions and rollbacks easily' },
            ].map((feature, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-8">
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
          <h2 className="text-4xl font-bold text-foreground">Why teams choose us</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { label: '10x faster', detail: 'Time to production' },
              { label: '99.9%', detail: 'Uptime SLA' },
              { label: '24/7', detail: 'Priority support' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-primary">{item.label}</p>
                <p className="mt-2 text-muted-foreground">{item.detail}</p>
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
        <h2 className="text-4xl font-bold text-primary-foreground">Ready to get started?</h2>
        <p className="mt-4 text-lg text-primary-foreground/80">
          Join hundreds of teams building intelligent automation.
        </p>
        <Button size="lg" variant="secondary" className="mt-8" asChild>
          <Link href={ctaHref}>
            {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
