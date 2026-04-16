'use client'

import { useState } from 'react'

const FORMSPREE_ID = 'mkokjzrr'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      })
      if (res.ok) {
        setSent(true)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border-sub)',
    borderRadius: 8,
    padding: '12px 15px',
    fontFamily: 'inherit',
    fontSize: '.875rem',
    color: 'var(--lo-text)',
    outline: 'none',
    width: '100%',
    transition: 'border-color .2s,box-shadow .2s',
  }

  return (
    <section id="contact" style={{ padding: '112px 0', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'start',
          }}
          className="contact-inner"
        >
          {/* Left */}
          <div className="reveal">
            <div className="eyebrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="11"
                height="11"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Get in touch
            </div>
            <h2 className="h2">
              Tell us what
              <br />
              you want to <span className="grad">launch.</span>
            </h2>
            <p className="lead">
              First idea or next product — tell us what you&apos;re working on. We&apos;ll reply
              within one business day with real thoughts on scope, stack, and timeline.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30 }}>
              {[
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      width="17"
                      height="17"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  title: '1-day response',
                  body: 'Real reply, not an autoresponder. We read every submission.',
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      width="17"
                      height="17"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  title: 'NDA on request',
                  body: 'Happy to sign before you share details — just ask.',
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      width="17"
                      height="17"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  ),
                  title: 'Honest scoping',
                  body: "We'll tell you if it needs 3 months or 3 weeks. No inflation.",
                },
              ].map((perk) => (
                <div key={perk.title} style={{ display: 'flex', gap: 13 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      background: 'rgba(124,58,237,.1)',
                      border: '1px solid rgba(124,58,237,.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--violet-hi)',
                      flexShrink: 0,
                    }}
                  >
                    {perk.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '.875rem', fontWeight: 700, marginBottom: 3 }}>
                      {perk.title}
                    </div>
                    <div style={{ fontSize: '.82rem', color: 'var(--lo-sub)' }}>{perk.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <form
            className="reveal d2"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 15 }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 15,
              }}
              className="form-row"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label
                  style={{
                    fontSize: '.75rem',
                    fontWeight: 700,
                    color: 'var(--lo-sub)',
                    letterSpacing: '.04em',
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,.45)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-sub)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <label
                  style={{
                    fontSize: '.75rem',
                    fontWeight: 700,
                    color: 'var(--lo-sub)',
                    letterSpacing: '.04em',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,.45)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,.1)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-sub)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label
                style={{
                  fontSize: '.75rem',
                  fontWeight: 700,
                  color: 'var(--lo-sub)',
                  letterSpacing: '.04em',
                }}
              >
                What are you building?
              </label>
              <textarea
                name="message"
                placeholder="Describe your product idea, the problem it solves, and where technology fits in. The more detail, the better our response."
                required
                style={{ ...inputStyle, resize: 'vertical', minHeight: 96 }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,.45)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-sub)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label
                style={{
                  fontSize: '.75rem',
                  fontWeight: 700,
                  color: 'var(--lo-sub)',
                  letterSpacing: '.04em',
                }}
              >
                Engagement type
              </label>
              <select
                name="engagement"
                style={{ ...inputStyle, WebkitAppearance: 'none', cursor: 'pointer' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,.45)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,.1)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-sub)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <option value="">Select one...</option>
                <option>Discovery Sprint ($4,500)</option>
                <option>MVP Build (from $18,000)</option>
                <option>Platform License (custom)</option>
                <option>Fractional CTO / Advisory</option>
                <option>Not sure yet — just exploring</option>
              </select>
            </div>

            {error && (
              <p style={{ fontSize: '.82rem', color: '#ef4444', textAlign: 'center' }}>
                Something went wrong — please email{' '}
                <a href="mailto:hello@launchops.co" style={{ color: '#ef4444' }}>
                  hello@launchops.co
                </a>{' '}
                directly.
              </p>
            )}
            {sent ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: '#059669',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--r)',
                  padding: 15,
                  fontSize: '.95rem',
                  fontWeight: 700,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Sent — we&apos;ll be in touch soon.
              </div>
            ) : (
              <button
                id="submitBtn"
                type="submit"
                disabled={submitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'var(--violet)',
                  color: '#fff',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  fontFamily: 'inherit',
                  fontSize: '.95rem',
                  fontWeight: 700,
                  padding: 15,
                  borderRadius: 'var(--r)',
                  transition: 'all .2s var(--ease)',
                  width: '100%',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            )}

            <p style={{ fontSize: '.75rem', color: 'var(--lo-muted)', textAlign: 'center' }}>
              No spam. No mailing list. Just a real conversation.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
