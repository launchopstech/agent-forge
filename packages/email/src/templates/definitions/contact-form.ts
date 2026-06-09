import type { EmailTemplateMetadata } from '../types'

export const CONTACT_FORM_TEMPLATE: EmailTemplateMetadata = {
  id: 'contact-form',
  name: 'Contact Form Submission',
  description: 'Sent when a visitor submits the quote request form on a client site.',
  subject: 'Quote Request from {{name}}',
  textBody: [
    'Name: {{name}}',
    'Phone: {{phone}}',
    'Email: {{email}}',
    'Service: {{service}}',
    '',
    '{{description}}',
  ].join('\n'),
  variables: [
    { key: 'name', label: 'Full Name', required: true, type: 'string' },
    { key: 'phone', label: 'Phone Number', required: false, type: 'phone' },
    { key: 'email', label: 'Email Address', required: true, type: 'email' },
    {
      key: 'service',
      label: 'Service Needed',
      required: false,
      type: 'select',
      options: [
        'General Contracting',
        'Home Remodel',
        'Room Addition',
        'New Construction',
        'Exterior Work',
        'Commercial',
        'Other',
      ],
    },
    { key: 'description', label: 'Project Description', required: false, type: 'textarea' },
  ],
}
