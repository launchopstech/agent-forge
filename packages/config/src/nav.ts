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
  { label: 'Benefits', href: '#benefits' },
  { label: 'Pricing', href: '#pricing' },
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
