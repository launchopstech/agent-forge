export type VariableType = 'string' | 'email' | 'phone' | 'select' | 'textarea'

export interface TemplateVariable {
  key: string
  label: string
  required: boolean
  type: VariableType
  options?: string[]
}

/**
 * JSON-serializable email template — can be stored in a CMS or DB.
 * Use {{variableName}} placeholders in subject, textBody, and htmlBody.
 */
export interface EmailTemplateMetadata {
  id: string
  name: string
  description?: string
  subject: string
  textBody: string
  htmlBody?: string
  variables: TemplateVariable[]
}
