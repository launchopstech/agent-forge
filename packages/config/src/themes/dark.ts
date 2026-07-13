/**
 * Dark theme preset CSS variable overrides.
 * These complement the .dark class set by next-themes;
 * use these for programmatic per-brand overrides on top of the dark base.
 */
export const darkTheme: Record<string, string> = {
  '--color-brand-50': 'oklch(0.15 0.03 280)',
  '--color-brand-100': 'oklch(0.20 0.05 280)',
  '--color-brand-200': 'oklch(0.26 0.08 280)',
  '--color-brand-300': 'oklch(0.36 0.11 280)',
  '--color-brand-400': 'oklch(0.48 0.14 280)',
  '--color-brand-500': 'oklch(0.57 0.17 280)',
  '--color-brand-600': 'oklch(0.65 0.15 280)',
  '--color-brand-700': 'oklch(0.73 0.13 280)',
  '--color-brand-800': 'oklch(0.82 0.10 280)',
  '--color-brand-900': 'oklch(0.93 0.05 280)',
  '--primary': 'oklch(0.65 0.15 280)',
  '--primary-foreground': 'oklch(0.12 0 0)',
  '--ring': 'oklch(0.65 0.15 280)',
  '--radius': '0.625rem',
}
