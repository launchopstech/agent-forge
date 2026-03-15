/**
 * Storybook mock for @forge/i18n/actions.
 * Replaces the Next.js server action (which uses next/headers + next/cache)
 * with a browser-safe no-op so LocaleSwitcher renders without crashing.
 *
 * To change locale in Storybook, use the globe toolbar at the top.
 */
export async function setLocale(_locale: string): Promise<void> {
  // no-op — locale is controlled via the Storybook toolbar global
}
