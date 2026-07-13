import type { EmailTemplateMetadata } from './types'

// In-memory registry for built-in and app-registered templates.
// CMS migration: replace loadTemplate with an async fetch to your CMS/DB.
// Call-site interface is unchanged — sendEmail('template-id', data, options) works identically.
const registry = new Map<string, EmailTemplateMetadata>()

export function registerTemplate(template: EmailTemplateMetadata): void {
  registry.set(template.id, template)
}

// Async from day one so the CMS swap requires zero call-site changes.
export async function loadTemplate(id: string): Promise<EmailTemplateMetadata> {
  const template = registry.get(id)
  if (!template) {
    throw new Error(
      `[email] Template "${id}" not found in registry. ` +
        `Import '@forge/email/templates' to register built-ins, or pass the metadata object directly.`
    )
  }
  return template
}

export function clearRegistry(): void {
  registry.clear()
}
