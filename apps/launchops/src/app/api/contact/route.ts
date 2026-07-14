import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sendEmail } from '@forge/email'
import '@forge/email/templates'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 5
const contactRateLimit = new Map<string, { count: number; resetAt: number }>()

function getClientIdentifier(req: NextRequest) {
  const forwardedFor = req.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown'
  return ip
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, company, email, message, engagement, website } = body

    if (typeof website === 'string' && website.trim() !== '') {
      console.warn('[contact] blocked honeypot submission')
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
    }

    const clientId = getClientIdentifier(req)
    const now = Date.now()
    const current = contactRateLimit.get(clientId)

    if (!current || current.resetAt <= now) {
      contactRateLimit.set(clientId, {
        count: 1,
        resetAt: now + RATE_LIMIT_WINDOW_MS,
      })
    } else if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
      console.warn('[contact] rate limit exceeded')
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    } else {
      current.count += 1
      contactRateLimit.set(clientId, current)
    }

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const companyLine = company ? ` (${company as string})` : ''
    const result = await sendEmail(
      'launchops-contact',
      { name, company: company ?? '', email, message, engagement: engagement ?? '', companyLine },
      {
        from: 'Ploutos Solutions <noreply@ploutossolutions.com>',
        to: ['hello@ploutossolutions.com'],
        replyTo: email as string,
      }
    )

    if (!result.ok) {
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
