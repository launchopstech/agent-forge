export interface ThemeStore {
  load(
    brandKey: string
  ): Promise<{ light: Record<string, string>; dark: Record<string, string> } | null>
  save(
    brandKey: string,
    theme: { light: Record<string, string>; dark: Record<string, string> }
  ): Promise<void>
  reset(brandKey: string): Promise<void>
}
