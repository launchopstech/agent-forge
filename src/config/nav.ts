import type { NavGroup, NavItem } from '@/types'

export const marketingNavItems: NavItem[] = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Features', href: '#features' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Pricing', href: '#pricing' },
]

export const dashboardNavGroups: NavGroup[] = [
  {
    items: [
      { label: 'Overview', href: '/dashboard' },
      { label: 'Agents', href: '/dashboard/agents' },
      { label: 'Workflows', href: '/dashboard/workflows' },
    ],
  },
  {
    label: 'Manage',
    items: [
      { label: 'Analytics', href: '/dashboard/analytics' },
      { label: 'Integrations', href: '/dashboard/integrations' },
      { label: 'Team', href: '/dashboard/team' },
    ],
  },
]

export const dashboardFooterNavItems: NavItem[] = [
  { label: 'Settings', href: '/dashboard/settings' },
  { label: 'Help', href: '/dashboard/help' },
]

export const footerNavColumns: Array<{ heading: string; items: NavItem[] }> = [
  {
    heading: 'Product',
    items: [
      { label: 'Capabilities', href: '#capabilities' },
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
