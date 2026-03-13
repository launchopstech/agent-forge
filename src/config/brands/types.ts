export interface BrandColors {
  light: Record<string, string>
  dark: Record<string, string>
}

export interface BrandAssets {
  logoPath: string
  faviconPath: string
}

export interface BrandSiteConfig {
  name: string
  description: string
  url?: string
  ogImage?: string
}

/**
 * Full brand configuration for a single client/tenant.
 * BrandFonts is a forwards-compatible stub for per-brand font support
 * (not yet implemented — all brands share Inter/JetBrains Mono at build time).
 */
export interface BrandConfig {
  key: string
  site: BrandSiteConfig
  colors: BrandColors
  assets: BrandAssets
}
