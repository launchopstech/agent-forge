import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// TODO: Wire up your preferred email service (Resend, Postmark, etc.)
// Example with Resend:
//   import { Resend } from 'resend'
//   const resend = new Resend(process.env.RESEND_API_KEY)
//   await resend.emails.send({ from: '...', to: 'hello@ploutos.dev', subject: '...', html: '...' })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, company, email, message, engagement } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Log for now — replace with actual delivery
    console.log('[contact]', { name, company, email, engagement, message })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
