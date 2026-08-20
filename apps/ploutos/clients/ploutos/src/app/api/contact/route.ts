import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sendEmail } from '@forge/email'
import '@forge/email/templates'

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5
const requestsByIp = new Map<string, { count: number; resetAt: number }>()
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() || 'Ploutos Website <website@ploutos.llc>'
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL?.trim() || 'admin@ploutos.llc'

type ContactPayload = {
  name?: unknown
  email?: unknown
  company?: unknown
  message?: unknown
  timeline?: unknown
  faxNumber?: unknown
}

function isStringWithin(value: unknown, min: number, max: number): value is string {
  return typeof value === 'string' && value.trim().length >= min && value.trim().length <= max
}

function isValidEmail(value: unknown): value is string {
  return isStringWithin(value, 3, 254) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const current = requestsByIp.get(ip)
  if (!current || current.resetAt <= now) {
    requestsByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > MAX_REQUESTS
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  let payload: ContactPayload
  try {
    payload = (await req.json()) as ContactPayload
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (typeof payload.faxNumber === 'string' && payload.faxNumber.trim()) {
    return NextResponse.json({ ok: true })
  }

  if (
    !isStringWithin(payload.name, 2, 100) ||
    !isValidEmail(payload.email) ||
    !isStringWithin(payload.message, 10, 3000) ||
    (payload.company !== undefined && !isStringWithin(payload.company, 0, 300)) ||
    (payload.timeline !== undefined && !isStringWithin(payload.timeline, 0, 100))
  ) {
    return NextResponse.json({ error: 'Please check the submitted fields.' }, { status: 400 })
  }

  const name = payload.name.trim()
  const email = payload.email.trim().toLowerCase()
  const company = typeof payload.company === 'string' ? payload.company.trim() : ''
  const message = payload.message.trim()
  const timeline = typeof payload.timeline === 'string' ? payload.timeline.trim() : ''

  const result = await sendEmail(
    'contact-form',
    { name, email, company, message, timeline },
    {
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      replyTo: email,
    }
  )

  if (!result.ok) {
    const status = result.error === 'RESEND_API_KEY not set' ? 503 : 500
    return NextResponse.json({ error: 'Unable to send your message right now.' }, { status })
  }

  return NextResponse.json({ ok: true })
}
