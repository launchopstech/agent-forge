// types exports

export interface NavItem {
  label: string
  labelKey?: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
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
  description: string
  url: string
  ogImage?: string
}
