import { parse, converter, formatHex } from 'culori'

const toOklch = converter('oklch')

/**
 * Convert an OKLCH CSS string (e.g. "oklch(0.35 0.15 280)") to a hex color.
 * Returns the input unchanged if parsing fails.
 */
export function oklchToHex(oklchStr: string): string {
  if (!oklchStr || typeof oklchStr !== 'string') return oklchStr
  try {
    const parsed = parse(oklchStr)
    if (!parsed) return oklchStr
    const hex = formatHex(parsed)
    return hex ?? oklchStr
  } catch {
    return oklchStr
  }
}

/**
 * Convert a hex color (e.g. "#ff0000") to an OKLCH CSS string.
 * Values are rounded to 3 decimal places.
 * Returns the input unchanged if parsing fails.
 */
export function hexToOklch(hex: string): string {
  if (!hex || typeof hex !== 'string') return hex
  try {
    const parsed = parse(hex)
    if (!parsed) return hex
    const ok = toOklch(parsed)
    if (!ok) return hex
    const l = (ok.l ?? 0).toFixed(3)
    const c = (ok.c ?? 0).toFixed(3)
    const h = (ok.h ?? 0).toFixed(3)
    return `oklch(${l} ${c} ${h})`
  } catch {
    return hex
  }
}
