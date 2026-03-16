/**
 * Default (light) theme preset.
 * Each key maps to a CSS custom property name; value is the CSS value.
 * Apply via ThemeSwitcher or document.documentElement.style.setProperty().
 */
export const defaultTheme: Record<string, string> = {
  '--color-brand-50': 'oklch(0.97 0.02 280)',
  '--color-brand-100': 'oklch(0.93 0.05 280)',
  '--color-brand-200': 'oklch(0.87 0.08 280)',
  '--color-brand-300': 'oklch(0.78 0.11 280)',
  '--color-brand-400': 'oklch(0.68 0.14 280)',
  '--color-brand-500': 'oklch(0.57 0.17 280)',
  '--color-brand-600': 'oklch(0.47 0.17 280)',
  '--color-brand-700': 'oklch(0.40 0.16 280)',
  '--color-brand-800': 'oklch(0.35 0.15 280)',
  '--color-brand-900': 'oklch(0.25 0.12 280)',
  '--primary': 'oklch(0.35 0.15 280)',
  '--primary-foreground': 'oklch(1 0 0)',
  '--ring': 'oklch(0.35 0.15 280)',
  '--radius': '0.625rem',
}
