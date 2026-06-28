import type { SendEmailOptions, SendEmailResult } from './types'
import type { EmailTemplateMetadata } from './templates/types'
import { loadTemplate } from './templates/registry'
import { renderTemplate } from './templates/renderer'
import { getEmailProvider } from './providers'

/**
 * Send an email using a template ID (looked up from registry/CMS)
 * or a metadata object passed directly.
 *
 * @param template - Template ID string or EmailTemplateMetadata object
 * @param data     - Variables to interpolate into the template ({{key}} syntax)
 * @param options  - Delivery options: from, to, replyTo
 */
export async function sendEmail(
  template: string | EmailTemplateMetadata,
  data: Record<string, unknown>,
  options: SendEmailOptions
): Promise<SendEmailResult> {
  const meta = typeof template === 'string' ? await loadTemplate(template) : template
  const content = renderTemplate(meta, data)
  return getEmailProvider().send({ ...options, ...content })
}
