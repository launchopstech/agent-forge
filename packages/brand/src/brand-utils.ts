import type { BrandConfig } from './config/types'

export function brandCssVars(brand: BrandConfig): string {
  const toVars = (map: Record<string, string>) =>
    Object.entries(map)
      .map(([k, v]) => `  ${k}: ${v} !important;`)
      .join('\n')
  return `:root {\n${toVars(brand.colors.light)}\n}\n.dark {\n${toVars(brand.colors.dark)}\n}`
}
