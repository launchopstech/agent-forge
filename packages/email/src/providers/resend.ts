import { Resend } from 'resend'
import type { EmailContent, SendEmailOptions, SendEmailResult } from '../types'
import type { EmailProviderAdapter } from './types'

export class ResendAdapter implements EmailProviderAdapter {
  async send(options: SendEmailOptions & EmailContent): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return { ok: false, error: 'RESEND_API_KEY not set' }
    }

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: options.from,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })

    if (error) {
      console.error('[email:resend]', error.message)
      return { ok: false, error: error.message }
    }

    return { ok: true }
  }
}
