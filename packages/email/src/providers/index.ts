import type { EmailProviderAdapter } from './types'
import { ResendAdapter } from './resend'
import { BrevoAdapter } from './brevo'

// Set EMAIL_PROVIDER to swap providers without code changes.
// Supported: 'resend' (default), 'brevo'
export function getEmailProvider(): EmailProviderAdapter {
  const provider = process.env.EMAIL_PROVIDER ?? 'resend'

  switch (provider) {
    case 'resend':
      return new ResendAdapter()
    case 'brevo':
      return new BrevoAdapter()
    default:
      throw new Error(`[email] Unknown EMAIL_PROVIDER: "${provider}". Supported: resend, brevo`)
  }
}

export type { EmailProviderAdapter }
