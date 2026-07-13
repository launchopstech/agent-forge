import { registerTemplate } from './registry'
import { CONTACT_FORM_TEMPLATE } from './definitions/contact-form'
import { LAUNCHOPS_CONTACT_TEMPLATE } from './definitions/launchops-contact'

// Side-effect: registers all built-in templates when this module is imported.
// Import '@forge/email/templates' in your API routes to activate.
registerTemplate(CONTACT_FORM_TEMPLATE)
registerTemplate(LAUNCHOPS_CONTACT_TEMPLATE)

export { CONTACT_FORM_TEMPLATE } from './definitions/contact-form'
export { LAUNCHOPS_CONTACT_TEMPLATE } from './definitions/launchops-contact'
export { loadTemplate, registerTemplate } from './registry'
export { renderTemplate } from './renderer'
export type { EmailTemplateMetadata, TemplateVariable, VariableType } from './types'
