import { describe, it, expect } from 'vitest'
import { brandCssVars } from './brand-utils'
import type { BrandConfig } from './config/types'

const mockBrand: BrandConfig = {
  key: 'test',
  site: { name: 'Test', description: 'desc' },
  colors: {
    light: { '--primary': 'oklch(0.5 0.1 200)', '--ring': 'oklch(0.5 0.1 200)' },
    dark: { '--primary': 'oklch(0.7 0.1 200)', '--ring': 'oklch(0.7 0.1 200)' },
  },
  assets: { logoPath: '/logo.svg', faviconPath: '/favicon.ico' },
}

describe('brandCssVars()', () => {
  it('generates :root block with light vars', () => {
    const css = brandCssVars(mockBrand)
    expect(css).toContain(':root {')
    expect(css).toContain('--primary: oklch(0.5 0.1 200) !important;')
  })

  it('generates .dark block with dark vars', () => {
    const css = brandCssVars(mockBrand)
    expect(css).toContain('.dark {')
    expect(css).toContain('--primary: oklch(0.7 0.1 200) !important;')
  })

  it('includes all light vars in :root', () => {
    const css = brandCssVars(mockBrand)
    expect(css).toContain('--ring: oklch(0.5 0.1 200) !important;')
  })

  it('includes all dark vars in .dark', () => {
    const css = brandCssVars(mockBrand)
    expect(css).toContain('--ring: oklch(0.7 0.1 200) !important;')
  })
})
