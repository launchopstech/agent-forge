export { sendEmail } from './send-email'
export { getEmailProvider } from './providers'
export type { EmailProviderAdapter } from './providers'
export type { EmailContent, SendEmailOptions, SendEmailResult } from './types'
// Template types and low-level utilities (no auto-registration side effect)
export type { EmailTemplateMetadata, TemplateVariable, VariableType } from './templates/types'
export { loadTemplate, registerTemplate } from './templates/registry'
export { renderTemplate } from './templates/renderer'
