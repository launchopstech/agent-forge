import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sendEmail } from '@forge/email'
import '@forge/email/templates'

export async function POST(req: NextRequest) {
  const { name, phone, email, service, description } = (await req.json()) as {
    name: string
    phone: string
    email: string
    service: string
    description: string
  }

  const result = await sendEmail(
    'contact-form',
    { name, phone, email, service, description },
    {
      from: 'Blue Stone Construction <noreply@bluestoneconstruction.com>',
      to: ['bluestonegcllc@gmail.com'],
      replyTo: email,
    }
  )

  if (!result.ok) {
    const status = result.error === 'RESEND_API_KEY not set' ? 503 : 500
    return NextResponse.json({ error: result.error ?? 'Failed to send email' }, { status })
  }

  return NextResponse.json({ ok: true })
}
