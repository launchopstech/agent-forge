import {
  LayoutDashboard,
  Bot,
  GitBranch,
  BarChart3,
  Plug,
  Users,
  Settings,
  HelpCircle,
  Paintbrush,
} from 'lucide-react'
import type { NavGroup, NavItem } from './types'

export const marketingNavItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Ownership', href: '#ownership' },
  { label: 'Demo', href: '#demo' },
]

export const dashboardNavGroups: NavGroup[] = [
  {
    items: [
      { label: 'Overview', labelKey: 'overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Agents', labelKey: 'agents', href: '/agents', icon: Bot },
      { label: 'Workflows', labelKey: 'workflows', href: '/dashboard/workflows', icon: GitBranch },
    ],
  },
  {
    label: 'Manage',
    labelKey: 'manage',
    items: [
      { label: 'Analytics', labelKey: 'analytics', href: '/dashboard/analytics', icon: BarChart3 },
      {
        label: 'Integrations',
        labelKey: 'integrations',
        href: '/dashboard/integrations',
        icon: Plug,
      },
      { label: 'Team', labelKey: 'team', href: '/dashboard/team', icon: Users },
    ],
  },
]

// Agency-only: edit any client brand (protected by forge_role === 'agency')
export const dashboardAdminNavItems: NavItem[] = [
  { label: 'Theme Editor', labelKey: 'adminTheme', href: '/admin/theme', icon: Paintbrush },
]

// Client admin: edit only their own brand instance
export const dashboardClientNavItems: NavItem[] = [
  { label: 'Theme', labelKey: 'theme', href: '/dashboard/theme', icon: Paintbrush },
]

export const dashboardFooterNavItems: NavItem[] = [
  { label: 'Settings', labelKey: 'settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Help', labelKey: 'help', href: '/dashboard/help', icon: HelpCircle },
]

export const footerNavColumns: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: 'Product',
    items: [
      { label: 'Features', href: '#features' },
      { label: 'Ownership', href: '#ownership' },
      { label: 'Demo', href: '#demo' },
    ],
  },
  {
    heading: 'MindRithm',
    items: [
      { label: 'Get started', href: '/signup' },
      { label: 'Log in', href: '/login' },
      { label: 'Contact', href: 'mailto:hello@mindrithm.ai', external: true },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy', href: 'mailto:hello@mindrithm.ai?subject=Privacy', external: true },
      { label: 'Terms', href: 'mailto:hello@mindrithm.ai?subject=Terms', external: true },
      { label: 'AgentForge', href: '#top' },
    ],
  },
]
