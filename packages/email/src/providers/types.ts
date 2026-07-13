import type { EmailContent, SendEmailOptions, SendEmailResult } from '../types'

export interface EmailProviderAdapter {
  send(options: SendEmailOptions & EmailContent): Promise<SendEmailResult>
}
