// Minimal type declarations for culori v4 (no bundled .d.ts)
// Re-declared here so apps/web TypeScript compilation can resolve the module
declare module 'culori' {
  export interface Oklch {
    mode: 'oklch'
    l: number
    c: number
    h?: number
    alpha?: number
  }

  export interface Color {
    mode: string
    alpha?: number
  }

  export function parse(color: string): Color | undefined
  export function converter(mode: 'oklch'): (color: Color | undefined) => Oklch | undefined
  export function converter(mode: string): (color: Color | undefined) => Color | undefined
  export function formatHex(color: Color | undefined): string | undefined
}
