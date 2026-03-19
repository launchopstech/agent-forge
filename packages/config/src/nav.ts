import { Paintbrush } from 'lucide-react'
import type { NavGroup, NavItem } from './types'

export const marketingNavItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Pricing', href: '#pricing' },
]

export const dashboardNavGroups: NavGroup[] = [
  {
    items: [
      { label: 'Overview', labelKey: 'overview', href: '/dashboard' },
      { label: 'Agents', labelKey: 'agents', href: '/dashboard/agents' },
      { label: 'Workflows', labelKey: 'workflows', href: '/dashboard/workflows' },
    ],
  },
  {
    label: 'Manage',
    labelKey: 'manage',
    items: [
      { label: 'Analytics', labelKey: 'analytics', href: '/dashboard/analytics' },
      { label: 'Integrations', labelKey: 'integrations', href: '/dashboard/integrations' },
      { label: 'Team', labelKey: 'team', href: '/dashboard/team' },
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
  { label: 'Settings', labelKey: 'settings', href: '/dashboard/settings' },
  { label: 'Help', labelKey: 'help', href: '/dashboard/help' },
]

export const footerNavColumns: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: 'Product',
    items: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
    ],
  },
  {
    heading: 'Company',
    items: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#blog' },
      { label: 'Careers', href: '#careers' },
    ],
  },
  {
    heading: 'Legal',
    items: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]
