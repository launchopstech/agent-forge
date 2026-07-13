// types exports
import type { ComponentType } from 'react'

export interface NavItem {
  label: string
  labelKey?: string
  href: string
  icon?: ComponentType<{ className?: string }>
  badge?: string
  external?: boolean
  children?: NavItem[]
}

export interface NavGroup {
  label?: string
  labelKey?: string
  items: NavItem[]
}

export interface SiteConfig {
  name: string
  /** Suffix of the name to render in the primary accent colour, e.g. 'Hub' for 'AgentHub' */
  nameAccent?: string
  /** Tenant / workspace display name shown in the topbar */
  workspaceName?: string
  description: string
  url: string
  ogImage?: string
}
