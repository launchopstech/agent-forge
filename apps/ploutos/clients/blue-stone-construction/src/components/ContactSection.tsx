'use client'

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Clock, Shield, Loader2, CheckCircle } from 'lucide-react'

const SERVICES_OPTIONS = [
  'General Contracting',
  'Home Remodel',
  'Room Addition',
  'New Construction',
  'Exterior Work',
  'Commercial',
  'Other',
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preselectedService, setPreselectedService] = useState('')

  useEffect(() => {
    const handler = (e: Event) => {
      setPreselectedService((e as CustomEvent<string>).detail)
    }
    window.addEventListener('selectService', handler)
    return () => window.removeEventListener('selectService', handler)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const data = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          service: data.get('service'),
          description: data.get('description'),
        }),
      })
      if (!res.ok) throw new Error('send failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please email us directly at admin@bluestoneconstruction.llc.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" style={{ padding: '96px 24px', background: 'var(--navy)' }}>
      <div
        style={{
          maxWidth: 'var(--max)',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'start',
        }}
      >
        {/* Left: contact info */}
        <div className="reveal">
          <div
            className="eyebrow"
            style={{
              background: 'rgba(27,111,171,0.2)',
              borderColor: 'rgba(27,111,171,0.3)',
              color: '#7BC4EE',
            }}
          >
            Get In Touch
          </div>
          <h2 className="section-heading" style={{ color: '#fff' }}>
            Let&apos;s Talk About
            <br />
            Your Project
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 40 }}>
            Whether you have a detailed plan or just an idea, we&apos;d love to hear about your
            project. Fill out the form and we&apos;ll get back to you within 24 hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              {
                icon: <Phone size={20} />,
                label: 'Phone',
                value: process.env.NEXT_PUBLIC_PHONE ?? '(862) XXX-XXXX',
                href: `tel:+1${(process.env.NEXT_PUBLIC_PHONE ?? '').replace(/\D/g, '')}`,
              },
              {
                icon: <Mail size={20} />,
                label: 'Email',
                value: 'admin@bluestoneconstruction.llc',
                href: 'mailto:admin@bluestoneconstruction.llc',
              },
              {
                icon: <MapPin size={20} />,
                label: 'Location',
                value: 'Lake Hiawatha, NJ 07034',
                href: 'https://maps.google.com/?q=Lake+Hiawatha+NJ+07034',
              },
              {
                icon: <Clock size={20} />,
                label: 'Hours',
                value: 'Mon–Fri 7am–6pm · Sat 8am–2pm',
                href: null,
              },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(27,111,171,0.2)',
                    borderRadius: 'var(--r)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7BC4EE',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </div>
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div
          className="reveal d1 contact-form-card"
          style={{
            background: '#fff',
            borderRadius: 'var(--r-xl)',
            padding: '40px 36px',
            boxShadow: '0 8px 48px rgba(0,0,0,0.2)',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircle size={48} style={{ color: 'var(--green)', marginBottom: 16 }} />
              <h3 style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 8 }}>
                Request Sent!
              </h3>
              <p style={{ color: 'var(--text-sub)' }}>
                We&apos;ll be in touch within 24 hours to discuss your project.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  color: 'var(--text)',
                  marginBottom: 4,
                }}
              >
                Get My Free Quote
              </h3>

              {[
                {
                  name: 'name',
                  label: 'Full Name',
                  type: 'text',
                  placeholder: 'John Smith',
                  required: true,
                },
                {
                  name: 'phone',
                  label: 'Phone Number',
                  type: 'tel',
                  placeholder: '(973) 555-0100',
                  required: true,
                },
                {
                  name: 'email',
                  label: 'Email Address',
                  type: 'email',
                  placeholder: 'john@example.com',
                  required: true,
                },
              ].map((f) => (
                <div key={f.name}>
                  <label
                    htmlFor={f.name}
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginBottom: 6,
                    }}
                  >
                    {f.label} {f.required && <span style={{ color: 'var(--green)' }}>*</span>}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    required={f.required}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid var(--border-sub)',
                      borderRadius: 'var(--r)',
                      fontSize: '0.9rem',
                      background: 'var(--bg-alt)',
                      color: 'var(--text)',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}

              <div>
                <label
                  htmlFor="service"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 6,
                  }}
                >
                  Service Needed
                </label>
                <select
                  id="service"
                  name="service"
                  value={preselectedService}
                  onChange={(e) => setPreselectedService(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-sub)',
                    borderRadius: 'var(--r)',
                    fontSize: '0.9rem',
                    background: 'var(--bg-alt)',
                    color: 'var(--text)',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="">Select a service...</option>
                  {SERVICES_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="description"
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: 6,
                  }}
                >
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Tell us about your project..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid var(--border-sub)',
                    borderRadius: 'var(--r)',
                    fontSize: '0.9rem',
                    background: 'var(--bg-alt)',
                    color: 'var(--text)',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  justifyContent: 'center',
                  fontSize: '1rem',
                  padding: '16px',
                  opacity: loading ? 0.75 : 1,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Sending…
                  </>
                ) : (
                  'Get My Free Quote'
                )}
              </button>

              {error && (
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#dc2626',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  {error}
                </p>
              )}

              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Shield size={12} /> We respect your privacy. Your info is never shared or sold.
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .contact-form-card { padding: 24px 20px !important; }
        }
      `}</style>
    </section>
  )
}
