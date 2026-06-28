export interface EmailContent {
  subject: string
  text: string
  html?: string
}

export interface SendEmailOptions {
  from: string
  to: string[]
  replyTo?: string
}

export interface SendEmailResult {
  ok: boolean
  error?: string
}
