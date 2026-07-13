import type { EmailContent } from '../types'
import type { EmailTemplateMetadata } from './types'

function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(data[key] ?? ''))
}

export function renderTemplate(
  meta: EmailTemplateMetadata,
  data: Record<string, unknown>
): EmailContent {
  return {
    subject: interpolate(meta.subject, data),
    text: interpolate(meta.textBody, data),
    html: meta.htmlBody ? interpolate(meta.htmlBody, data) : undefined,
  }
}
