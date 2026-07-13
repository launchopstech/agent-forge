'use client'

import { useState } from 'react'

const faqs = [
  {
    q: "Do you work with clients who don't have technical teams?",
    a: 'Yes — most of our clients have a product or ops lead but no in-house AI engineers. We act as the full technical team: architecture, engineering, and deployment. You stay close to the decisions without needing to write code.',
  },
  {
    q: 'How fixed is the 6-week timeline?',
    a: "Very fixed — that's why we run a Discovery Sprint first. We spec and lock scope before writing code. If scope changes mid-build we discuss a change order transparently. Our track record on CampO was 6 weeks from signed brief to production.",
  },
  {
    q: 'Which AI models do you use?',
    a: "It depends on your latency, cost, and capability requirements. We typically use Claude 3.5 Sonnet or GPT-4o for reasoning-heavy tasks and faster models for high-volume routing and classification. We design model-agnostic architectures so you're not locked in.",
  },
  {
    q: 'How do you handle data privacy and GDPR?',
    a: 'Compliance is built into every layer from day one. We run a DPIA as part of Discovery, implement PII redaction at the guardrail layer, use audit-logging middleware on all LLM calls, and deliver a compliance pack you can hand to a DPO.',
  },
  {
    q: 'What do we own at the end of the engagement?',
    a: 'Everything. Full IP transfer — you own 100% of the code. You also get a private GitHub repo, deployment docs, a runbook, an evals suite, and observability dashboards set up in LangSmith and PostHog, plus 30 days support.',
  },
  {
    q: 'Can we extend or add features after launch?',
    a: 'Absolutely. We scope follow-on work as discrete sprints or ongoing via our Platform License. Because we wrote the original codebase, iteration is significantly faster than handing it to a new team.',
  },
  {
    q: 'Do you work on-site or remotely?',
    a: "We're async-first and work with clients globally. Key sessions — kickoff, architecture review, weekly demos — happen over video. For enterprise engagements we can arrange on-site workshops where needed.",
  },
  {
    q: 'How many projects do you take on at once?',
    a: 'We limit ourselves to 2–3 active builds at any time. This is deliberate — it means your project gets genuine senior attention, not a junior team running in parallel on ten other accounts.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" style={{ padding: '112px 0', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 'var(--max)', margin: '0 auto', padding: '0 28px' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="eyebrow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="11"
              height="11"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            FAQ
          </div>
          <h2 className="h2">Questions we get asked.</h2>
          <p className="lead" style={{ margin: '0 auto' }}>
            Answered plainly, without the agency spin.
          </p>
        </div>

        <div style={{ maxWidth: 740, margin: '0 auto' }} className="reveal">
          {faqs.map((item, i) => (
            <div
              key={i}
              style={{
                borderBottom: '1px solid var(--border-sub)',
                borderTop: i === 0 ? '1px solid var(--border-sub)' : undefined,
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '21px 0',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontSize: '.975rem',
                  fontWeight: 700,
                  color: open === i ? 'var(--violet-hi)' : 'var(--lo-text)',
                  gap: 16,
                  transition: 'color .2s',
                }}
              >
                {item.q}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="20"
                  height="20"
                  style={{
                    flexShrink: 0,
                    color: open === i ? 'var(--violet-hi)' : 'var(--lo-muted)',
                    transform: open === i ? 'rotate(180deg)' : undefined,
                    transition: 'transform .3s,color .2s',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                style={{
                  maxHeight: open === i ? 260 : 0,
                  overflow: 'hidden',
                  transition: 'max-height .35s var(--ease),padding .35s',
                  paddingBottom: open === i ? 20 : 0,
                  fontSize: '.9rem',
                  color: 'var(--lo-sub)',
                  lineHeight: 1.8,
                }}
              >
                {item.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
