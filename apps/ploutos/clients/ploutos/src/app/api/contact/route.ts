import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sendEmail } from '@forge/email'
import '@forge/email/templates'

export async function POST(req: NextRequest) {
  const { name, email, company, message, timeline } = (await req.json()) as {
    name: string
    email: string
    company: string
    message: string
    timeline: string
  }

  const result = await sendEmail(
    'contact-form',
    { name, email, company, message, timeline },
    {
      from: 'Ploutos <noreply@ploutos.digital>',
      to: ['hello@ploutos.digital'],
      replyTo: email,
    }
  )

  if (!result.ok) {
    const status = result.error === 'RESEND_API_KEY not set' ? 503 : 500
    return NextResponse.json({ error: result.error ?? 'Failed to send email' }, { status })
  }

  return NextResponse.json({ ok: true })
}
