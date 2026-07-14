import { describe, it, expect } from 'vitest'
import { renderTemplate } from './renderer'
import type { EmailTemplateMetadata } from './types'

const base: EmailTemplateMetadata = {
  id: 'test',
  name: 'Test',
  subject: 'Hello {{name}}',
  textBody: 'Name: {{name}}\nEmail: {{email}}',
  variables: [],
}

describe('renderTemplate()', () => {
  it('interpolates variables in subject and textBody', () => {
    const result = renderTemplate(base, { name: 'Alice', email: 'alice@example.com' })
    expect(result.subject).toBe('Hello Alice')
    expect(result.text).toBe('Name: Alice\nEmail: alice@example.com')
  })

  it('interpolates variables in htmlBody when provided', () => {
    const meta = { ...base, htmlBody: '<p>Hi {{name}}</p>' }
    const result = renderTemplate(meta, { name: 'Bob' })
    expect(result.html).toBe('<p>Hi Bob</p>')
  })

  it('omits html field when htmlBody is not defined', () => {
    const result = renderTemplate(base, { name: 'Alice' })
    expect(result.html).toBeUndefined()
  })

  it('renders unknown variables as empty string', () => {
    const result = renderTemplate(base, { name: 'Alice' })
    expect(result.text).toBe('Name: Alice\nEmail: ')
  })

  it('handles repeated use of the same variable', () => {
    const meta = { ...base, subject: '{{name}} — {{name}}', textBody: '{{name}}' }
    const result = renderTemplate(meta, { name: 'Carol' })
    expect(result.subject).toBe('Carol — Carol')
  })

  it('handles empty data object', () => {
    const result = renderTemplate(base, {})
    expect(result.subject).toBe('Hello ')
    expect(result.text).toBe('Name: \nEmail: ')
  })

  it('converts non-string variable values to string', () => {
    const meta = { ...base, subject: 'Count: {{count}}', textBody: '{{count}}' }
    const result = renderTemplate(meta, { count: 42 })
    expect(result.subject).toBe('Count: 42')
  })
})
