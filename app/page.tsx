'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Brain, Shield, Sparkles, Cpu, Gauge } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-border bg-card px-6 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="AgentForge" className="h-9 w-9" />
          <span className="text-lg font-bold text-foreground">AgentForge</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Why AgentForge
          </a>
          <a href="#cta" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Log in
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section with Purple Background */}
      <section className="bg-gradient-to-br from-primary via-primary/90 to-primary/85 px-6 py-20 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <div className="mb-6 inline-block">
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                Introducing AI Agent Platform
              </span>
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-white sm:text-7xl">
              Build intelligent agents that work for you
            </h1>
            <p className="mt-6 text-balance text-lg text-white/80 sm:text-xl">
              The complete platform for building, deploying, and managing AI agents. Automate complex workflows with enterprise-grade reliability.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="bg-white hover:bg-white/90 text-primary font-semibold">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Documentation
              </Button>
            </div>
          </div>

          {/* Feature Grid in Hero */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-6 border border-white/20">
              <Zap className="h-6 w-6 text-white" />
              <p className="mt-4 font-semibold text-white">Lightning Fast</p>
              <p className="mt-2 text-sm text-white/70">Deploy agents in minutes, not weeks</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-6 border border-white/20">
              <Brain className="h-6 w-6 text-white" />
              <p className="mt-4 font-semibold text-white">AI-Powered</p>
              <p className="mt-2 text-sm text-white/70">Leverage latest LLM models</p>
            </div>
            <div className="rounded-lg bg-white/10 backdrop-blur-sm p-6 border border-white/20">
              <Shield className="h-6 w-6 text-white" />
              <p className="mt-4 font-semibold text-white">Enterprise Secure</p>
              <p className="mt-2 text-sm text-white/70">SOC 2 compliant infrastructure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground">Powerful capabilities</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything needed for intelligent automation</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Multi-Agent Orchestration', desc: 'Coordinate multiple agents for complex tasks' },
              { icon: Cpu, title: 'Advanced Processing', desc: 'Handle high-throughput workloads effortlessly' },
              { icon: Gauge, title: 'Real-time Monitoring', desc: 'Live dashboards with detailed performance metrics' },
              { icon: Brain, title: 'Custom AI Models', desc: 'Fine-tune and deploy your own LLM models' },
              { icon: Zap, title: 'API Integration', desc: 'Connect seamlessly to any external service' },
              { icon: Shield, title: 'Security First', desc: 'Built-in encryption and access controls' },
            ].map((feature, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-8 hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-secondary/50 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-4">Why teams choose AgentForge</h2>
          <p className="text-center text-muted-foreground mb-16">Join leading companies building the future with intelligent agents</p>
          
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { label: '10x faster', detail: 'Agent development time' },
              { label: '99.99%', detail: 'Uptime SLA guarantee' },
              { label: '24/7', detail: 'Priority support' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-5xl font-bold text-primary">{item.label}</p>
                <p className="mt-3 text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-gradient-to-r from-primary to-primary/80 px-6 py-24 text-center sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold text-white">Ready to transform your workflows?</h2>
          <p className="mt-4 text-lg text-white/80">
            Start building intelligent agents today. No credit card required.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-white hover:bg-white/90 text-primary font-semibold">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src="/logo.png" alt="AgentForge" className="h-7 w-7" />
                <p className="font-bold text-foreground">AgentForge</p>
              </div>
              <p className="text-sm text-muted-foreground">Build intelligent agents with enterprise features</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Product</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Company</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground">Legal</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
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
