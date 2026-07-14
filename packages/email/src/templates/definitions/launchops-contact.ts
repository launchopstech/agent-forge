import type { EmailTemplateMetadata } from '../types'

export const LAUNCHOPS_CONTACT_TEMPLATE: EmailTemplateMetadata = {
  id: 'launchops-contact',
  name: 'LaunchOps Contact Form',
  description: 'Sent when a visitor submits the contact form on the LaunchOps marketing site.',
  subject: 'New contact from {{name}}{{companyLine}}',
  textBody: [
    'Name: {{name}}',
    'Company: {{company}}',
    'Email: {{email}}',
    'Engagement: {{engagement}}',
    '',
    '{{message}}',
  ].join('\n'),
  variables: [
    { key: 'name', label: 'Full Name', required: true, type: 'string' },
    { key: 'company', label: 'Company', required: false, type: 'string' },
    { key: 'email', label: 'Email Address', required: true, type: 'email' },
    {
      key: 'engagement',
      label: 'Engagement Type',
      required: false,
      type: 'select',
      options: ['Ongoing', 'Project-based', 'Advisory', 'Other'],
    },
    { key: 'message', label: 'Message', required: true, type: 'textarea' },
    { key: 'companyLine', label: 'Company (formatted)', required: false, type: 'string' },
  ],
}
