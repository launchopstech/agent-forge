import type { SiteConfig } from './types'

export const siteConfig: SiteConfig = {
  name: 'AgentForge',
  description:
    'Build, deploy, and manage AI agents with AgentForge. The complete platform for intelligent automation.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/og.png',
}
