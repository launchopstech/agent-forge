import { BrevoClient } from '@getbrevo/brevo'
import type { EmailContent, SendEmailOptions, SendEmailResult } from '../types'
import type { EmailProviderAdapter } from './types'

export class BrevoAdapter implements EmailProviderAdapter {
  async send(options: SendEmailOptions & EmailContent): Promise<SendEmailResult> {
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      return { ok: false, error: 'BREVO_API_KEY not set' }
    }

    const brevo = new BrevoClient({ apiKey })

    // Parse "Name <email@domain.com>" format
    const fromMatch = options.from.match(/^(.*?)\s*<(.+)>$/)
    const senderName = fromMatch?.[1]?.trim() ?? options.from
    const senderEmail = fromMatch?.[2] ?? options.from

    const to = (Array.isArray(options.to) ? options.to : [options.to]).map((email) => ({ email }))

    try {
      await brevo.transactionalEmails.sendTransacEmail({
        sender: { name: senderName, email: senderEmail },
        to,
        replyTo: options.replyTo ? { email: options.replyTo } : undefined,
        subject: options.subject,
        htmlContent: options.html,
        textContent: options.text,
      })
      return { ok: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Brevo send failed'
      console.error('[email:brevo]', message)
      return { ok: false, error: message }
    }
  }
}
