import type { SiteConfig } from './types'

export const siteConfig: SiteConfig = {
  name: 'MindRithm',
  nameAccent: 'Rithm',
  workspaceName: 'MindRithm Demo',
  description:
    'MindRithm helps businesses launch AI agents they own, control, and can prove, so they can serve customers faster without risking data or trust.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/brands/mindrithm/og.png',
}
