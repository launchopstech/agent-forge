import { defaultBrand } from './default'
import { clientABrand } from './client-a'
import { clientBBrand } from './client-b'
import type { BrandConfig } from './types'

export type { BrandConfig } from './types'
export type { BrandColors, BrandAssets, BrandSiteConfig } from './types'

export type BrandKey = 'default' | 'client-a' | 'client-b'

const brandRegistry: Record<BrandKey, BrandConfig> = {
  default: defaultBrand,
  'client-a': clientABrand,
  'client-b': clientBBrand,
}

export function getBrand(key: string): BrandConfig {
  return brandRegistry[key as BrandKey] ?? defaultBrand
}

/**
 * The active brand for this deployment.
 * SWAP POINT: replace process.env read with a per-request domain lookup
 * (e.g. `getBrandByDomain(headers().get('host'))`) for runtime multi-tenancy.
 */
export const activeBrand: BrandConfig = getBrand(process.env.NEXT_PUBLIC_BRAND ?? 'default')

export { defaultBrand, clientABrand, clientBBrand }
