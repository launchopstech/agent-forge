'use client'

/* eslint-disable i18next/no-literal-string -- This client site ships English marketing copy only. */
import { useCallback, useState, type FormEvent } from 'react'
import { track } from '@vercel/analytics'
import { ScrollReveal } from './ScrollReveal'

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setStatus('sending')

    const data = {
      name: (form.querySelector('#f-name') as HTMLInputElement).value,
      email: (form.querySelector('#f-email') as HTMLInputElement).value,
      company: (form.querySelector('#f-url') as HTMLInputElement).value,
      message: (form.querySelector('#f-problem') as HTMLTextAreaElement).value,
      timeline: '',
      faxNumber: (form.querySelector('#f-fax') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
        track('website_review_requested')
      } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }, [])

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 9,
    padding: '13px 16px',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    transition: 'border-color .2s, box-shadow .2s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--sub)',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 6,
  }

  return (
    <section id="contact" style={{ padding: '96px 0', background: 'var(--bg-alt)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 28px' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                width={11}
                height={11}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Free Website Review
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem,3.2vw,2.4rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                marginBottom: 16,
              }}
            >
              Get Your Free Website Review — No Sales Pitch.
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--sub)',
                lineHeight: 1.8,
                maxWidth: 560,
                margin: '0 auto',
              }}
            >
              Tell us about your business and we&apos;ll send three prioritized findings about your
              website and online presence. Plain English feedback — no jargon, no hard sell.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <form
            noValidate
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
              className="form-row"
            >
              <div>
                <label htmlFor="f-name" style={labelStyle}>
                  Your Name
                </label>
                <input
                  id="f-name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="f-email" style={labelStyle}>
                  Business Email
                </label>
                <input
                  id="f-email"
                  name="email"
                  type="email"
                  placeholder="jane@yourbusiness.com"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label htmlFor="f-url" style={labelStyle}>
                Current Website URL <span style={{ fontWeight: 500 }}>(optional)</span>
              </label>
              <input
                id="f-url"
                name="url"
                type="url"
                placeholder="https://yourbusiness.com"
                style={inputStyle}
              />
            </div>

            <div hidden>
              <label htmlFor="f-fax">Fax number</label>
              <input id="f-fax" name="faxNumber" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="f-problem" style={labelStyle}>
                Your Biggest Tech or Marketing Headache?
              </label>
              <textarea
                id="f-problem"
                name="problem"
                placeholder="Tell us what's not working — slow load times, poor rankings, ads not converting, manual processes eating your time... any detail helps."
                required
                style={{ ...inputStyle, resize: 'vertical', minHeight: 130 }}
              />
            </div>

            {status === 'success' && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--r)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: 'rgba(16,185,129,.1)',
                  border: '1px solid rgba(16,185,129,.25)',
                  color: 'var(--accent)',
                }}
              >
                Audit request received — we&apos;ll be in touch within 48 hours.
              </div>
            )}

            {status === 'error' && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--r)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  background: 'rgba(239,68,68,.09)',
                  border: '1px solid rgba(239,68,68,.18)',
                  color: '#f87171',
                }}
              >
                We couldn&apos;t send your request. Try again or email{' '}
                <a
                  href="mailto:admin@ploutos.llc"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  admin@ploutos.llc
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending' || status === 'success'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: status === 'success' ? '#059669' : 'var(--accent)',
                color: '#fff',
                border: 'none',
                cursor: status === 'sending' || status === 'success' ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                fontSize: '1rem',
                fontWeight: 700,
                padding: '16px 20px',
                borderRadius: 'var(--r)',
                transition: 'all .2s var(--ease)',
                width: '100%',
                opacity: status === 'sending' ? 0.7 : 1,
                letterSpacing: '0.02em',
                boxShadow: status === 'success' ? 'none' : '0 4px 24px rgba(16,185,129,.25)',
              }}
            >
              {status === 'sending' ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    width={18}
                    height={18}
                    style={{ animation: 'spin .8s linear infinite' }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Running diagnostics...
                </>
              ) : status === 'success' ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    width={18}
                    height={18}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Audit Request Received
                </>
              ) : (
                <>
                  Get My Free Website Review
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    width={18}
                    height={18}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--muted)',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              No sales pitch. No obligation. Three prioritized findings delivered within 48 hours.
            </p>
          </form>
        </ScrollReveal>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) { .form-row { grid-template-columns: 1fr !important; } }
        #f-name:focus, #f-email:focus, #f-url:focus, #f-problem:focus {
          border-color: rgba(16,185,129,.5);
          box-shadow: 0 0 0 3px rgba(16,185,129,.08);
        }
      `}</style>
    </section>
  )
}
