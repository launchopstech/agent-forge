'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Brain, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-border bg-card px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="AgentForge" className="h-10 w-10" />
          <span className="text-lg font-bold text-foreground">AgentForge</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Benefits
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </nav>

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
            AgentForge is the complete platform for building, deploying, and managing AI agents. Automate complex workflows with enterprise-grade reliability.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5" />
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
            <p className="mt-2 text-sm text-muted-foreground">Deploy agents in minutes, not weeks</p>
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

      {/* Features Section */}
      <section id="features" className="border-t border-border bg-muted/30 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-foreground">Powerful features</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to build sophisticated AI agents</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {[
              { title: 'API Integration', desc: 'Connect to any API or service seamlessly' },
              { title: 'Real-time Monitoring', desc: 'Track agent performance with live dashboards' },
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
          <h2 className="text-4xl font-bold text-foreground">Why teams choose AgentForge</h2>
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
      <section id="pricing" className="border-t border-border bg-primary px-6 py-24 text-center sm:px-8">
        <h2 className="text-4xl font-bold text-primary-foreground">Ready to get started?</h2>
        <p className="mt-4 text-lg text-primary-foreground/80">
          Join hundreds of teams building intelligent automation with AgentForge.
        </p>
        <Button size="lg" variant="secondary" className="mt-8">
          Create Free Account
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <p className="font-semibold text-foreground">AgentForge</p>
              <p className="mt-2 text-sm text-muted-foreground">Build powerful AI agents</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 AgentForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
