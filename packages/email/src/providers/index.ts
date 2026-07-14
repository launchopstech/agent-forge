import type { EmailProviderAdapter } from './types'
import { ResendAdapter } from './resend'

// Set EMAIL_PROVIDER to swap providers without code changes.
// Currently supported: 'resend' (default)
// To add a new provider: create providers/<name>.ts implementing EmailProviderAdapter,
// then add a case below.
export function getEmailProvider(): EmailProviderAdapter {
  const provider = process.env.EMAIL_PROVIDER ?? 'resend'

  switch (provider) {
    case 'resend':
      return new ResendAdapter()
    default:
      throw new Error(`[email] Unknown EMAIL_PROVIDER: "${provider}". Supported: resend`)
  }
}

export type { EmailProviderAdapter }
